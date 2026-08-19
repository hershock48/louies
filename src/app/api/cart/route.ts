import { NextResponse, type NextRequest } from "next/server";

/**
 * A form value, made safe to write into a plain-text order record.
 *
 * Two things beyond trimming, both found by trying them:
 *
 * NEWLINES ARE FLATTENED. `.trim()` only removes them from the ends, so a name of
 * "Bob\r\nPhone: 000" forged an extra line inside the record, and the person reading it
 * cannot tell a typed "Phone:" from a real one. Nodemailer already folds CR and LF out
 * of a subject, so this is not header injection; it is worse in a way, because the log
 * IS the order while mail is unconfigured.
 *
 * THE LIMIT COUNTS CHARACTERS, NOT UNITS. `.slice(0, 2000)` cut an emoji in half and
 * left a replacement character at the end of the record. Spreading the string first
 * counts what a person would count.
 */
function clean(value: string, limit: number) {
  const flat = value.replace(/[\r\n\t]+/g, " ").trim();
  return [...flat].slice(0, limit).join("");
}
import { CART_COOKIE, addToCart, applyChange, parseCart, serializeCart } from "@/lib/cart";

/**
 * Cart mutations, as plain form posts.
 *
 * Every button that touches the cart is a submit button in its own tiny form, so all of
 * this works with JavaScript switched off, and a 303 back means the back button behaves
 * and a refresh does not add another box.
 *
 * The redirect target comes from a `back` field and is deliberately NOT trusted: only
 * the path is kept, and only if it starts with a single slash. An open redirect on a
 * bakery's cart is still an open redirect.
 */
function safeBack(raw: string, request: NextRequest) {
  const here = new URL(request.url);
  const fallback = new URL("/shop", here);
  try {
    const target = new URL(raw, here);
    /*
      ORIGIN COMPARISON, NOT A PREFIX CHECK.

      The prefix check this replaces let three bypasses through, because the string was
      tested raw and then handed to a parser with its own ideas. `new URL()` follows the
      WHATWG rules: a backslash is a slash, and tabs and newlines are stripped before
      parsing. So "/\evil.com", "/%0A/evil.com" and "/%09/evil.com" all began with a
      single slash, passed, and then resolved to https://evil.com/. Comparing the parsed
      origin cannot be fooled by anything the parser does, because it asks the parser.
    */
    return target.origin === here.origin ? target : fallback;
  } catch {
    return fallback;
  }
}

export async function POST(request: NextRequest) {
  /*
    A body that is not a form used to throw here and return a blank 500: no message, no
    redirect, submission gone. text/plain is a legal form encoding, so this was
    reachable without curl.
  */
  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.redirect(new URL("/shop", request.url), 303);
  }
  const field = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? clean(v, 120) : "";
  };

  const slug = field("slug");
  const op = field("op");
  const qty = Number(field("qty"));
  const back = safeBack(field("back") || "/shop", request);

  const entries = parseCart(request.cookies.get(CART_COOKIE)?.value);
  const next =
    op === "set"
      ? applyChange(entries, slug, Number.isFinite(qty) ? qty : 1)
      : op === "remove"
        ? applyChange(entries, slug, 0)
        : addToCart(entries, slug, Number.isFinite(qty) && qty > 0 ? qty : 1);

  const response = NextResponse.redirect(back, 303);
  response.cookies.set({
    name: CART_COOKIE,
    value: serializeCart(next),
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    // Thirty days. Long enough that a box picked out on a phone at the weekend is still
    // there on Monday, short enough that it is not a permanent record of anybody.
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
