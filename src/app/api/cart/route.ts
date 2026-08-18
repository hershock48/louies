import { NextResponse, type NextRequest } from "next/server";
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
  const form = await request.formData();
  const field = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v.trim().slice(0, 120) : "";
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
