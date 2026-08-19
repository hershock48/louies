import { NextResponse, type NextRequest } from "next/server";
import { CART_COOKIE, cartLines, cartTotal, parseCart } from "@/lib/cart";
import { sendShipInquiry, type ShipInquiry } from "@/lib/mail";
import { site } from "@/data/site";

/**
 * CHECKOUT.
 *
 * Two paths, and which one runs depends on whether the bakery's Stripe key is set. The
 * page never pretends about which one it took.
 *
 *   Configured:   a Stripe hosted Checkout Session is created and the customer is sent
 *                 to Stripe to pay. Card details never touch this site, which is the
 *                 entire reason for using the hosted page rather than building a card
 *                 form: no PCI surface, no card number in a server log, nothing to
 *                 leak. Stripe collects the shipping address itself.
 *
 *   Unconfigured: the order is emailed to the bakery exactly like a phone order, the
 *                 customer lands on a page that says in plain words that nothing has
 *                 been charged and the bakery will ring for the card, and the whole
 *                 payload is logged. That is the honest fallback glaze.md requires, and
 *                 it is also a real way to run a shop: it is how Louie's takes a
 *                 shipped order today.
 *
 * NO STRIPE PACKAGE. This is one POST to a documented REST endpoint, so it is a fetch
 * rather than a 3MB dependency and a version to keep current.
 *
 * PRICES ARE NEVER READ FROM THE REQUEST. Line items are rebuilt from the cart cookie's
 * slugs against src/data/shipping.ts, so the only amount that can be charged is the one
 * the bakery published. A tampered cookie can change what is in the box, never what it
 * costs.
 */
/** The fields a box cannot be sent without. */
function missingDetails(i: ShipInquiry) {
  return !i.to || !i.address || !i.city || !i.state || !i.zip || !i.name || !i.phone;
}

/** Marks the emailed copy of an order that is on its way to the card page. */
function pendingNote(gift: string) {
  return [gift, "[Sent to card payment. Confirm it went through before packing.]"]
    .filter(Boolean)
    .join(" ");
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  // Strings only: a file part coerces to "[object File]", which passes a truthiness
  // check and reaches the bakery as somebody's name.
  const field = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v.trim().slice(0, 300) : "";
  };

  // Honeypot: hidden from people, and unlike a "company" field it is not something a
  // browser's address autofill will ever helpfully complete. Logged in full, because a
  // false positive here is somebody's birthday present quietly deleted, and the log is
  // the only place it could be rescued from.
  if (field("website_url")) {
    console.warn(
      "[checkout] honeypot tripped, discarded. Payload:\n" +
        [field("name"), field("phone"), field("email"), field("to"), field("address"),
         `${field("city")}, ${field("state")} ${field("zip")}`, field("gift")]
          .filter(Boolean).join("\n"),
    );
    return NextResponse.redirect(new URL("/shop/received?state=sent", request.url), 303);
  }

  const entries = parseCart(request.cookies.get(CART_COOKIE)?.value);
  const lines = cartLines(entries);
  if (lines.length === 0) {
    return NextResponse.redirect(new URL("/cart?error=empty", request.url), 303);
  }

  const inquiry: ShipInquiry = {
    box: lines.map((l) => `${l.qty} x ${l.box.name} (${l.box.size})`).join("; "),
    quantity: String(lines.reduce((n, l) => n + l.qty, 0)),
    to: field("to"),
    address: field("address"),
    city: field("city"),
    state: field("state"),
    zip: field("zip"),
    arriveBy: field("arriveBy"),
    gift: field("gift"),
    name: field("name"),
    phone: field("phone"),
    email: field("email"),
  };

  /*
    Validated BEFORE either path, not inside the fallback.

    It used to be checked only on the email path, so with Stripe configured a form
    missing a house number sailed past, skipped the notification email (which is
    conditional on the same check) and sent the customer to pay. That is the one
    outcome this route exists to prevent: a charge the bakery never hears about.
  */
  if (missingDetails(inquiry)) {
    return NextResponse.redirect(new URL("/cart?error=missing#details", request.url), 303);
  }

  const key = process.env.STRIPE_SECRET_KEY;

  if (key) {
    /*
      Hosted Checkout. Stripe collects the address and the card, so this sends the cart
      and the note and nothing else. `price_data` is built here rather than referencing
      Stripe products, so the bakery changing a price in the repo changes the price that
      is charged, with no second place to remember.
    */
    const body = new URLSearchParams();
    body.set("mode", "payment");
    /*
      Back through our own route, carrying the session id, rather than straight to a
      confirmation page. That route asks Stripe whether the session was actually paid
      before it says so, and it is the only place the cart is cleared. Sending people
      directly to a page that reads `?state=paid` meant the page could be linked to by
      anybody, and meant the paid cart was never emptied, so the header still offered
      the same boxes and a second press charged for them again.
    */
    body.set(
      "success_url",
      new URL("/api/paid?session_id={CHECKOUT_SESSION_ID}", request.url).toString(),
    );
    body.set("cancel_url", new URL("/cart?error=cancelled", request.url).toString());
    body.set("shipping_address_collection[allowed_countries][0]", "US");
    if (inquiry.email) body.set("customer_email", inquiry.email);
    if (inquiry.gift) body.set("metadata[gift_note]", inquiry.gift.slice(0, 400));
    if (inquiry.arriveBy) body.set("metadata[arrive_by]", inquiry.arriveBy.slice(0, 200));
    if (inquiry.phone) body.set("metadata[phone]", inquiry.phone);
    /*
      The recipient goes with the payment. Stripe collects the payer's own address at
      checkout, which for the site's main use, a tin sent to somebody else, is the wrong
      address entirely: the name and street the customer typed were being dropped on the
      floor the moment we redirected.
    */
    if (inquiry.to) body.set("metadata[ship_to]", inquiry.to.slice(0, 200));
    if (inquiry.address)
      body.set(
        "metadata[ship_address]",
        `${inquiry.address}, ${inquiry.city}, ${inquiry.state} ${inquiry.zip}`.slice(0, 400),
      );

    lines.forEach((l, i) => {
      body.set(`line_items[${i}][quantity]`, String(l.qty));
      body.set(`line_items[${i}][price_data][currency]`, "usd");
      body.set(`line_items[${i}][price_data][unit_amount]`, String(l.each));
      body.set(`line_items[${i}][price_data][product_data][name]`, `${l.box.name}, ${l.box.size}`);
      body.set(
        `line_items[${i}][price_data][product_data][description]`,
        `Shipping included. Baked the night before and sent on the ${site.shipping.day} truck.`,
      );
    });

    /*
      The bakery is told BEFORE the customer is sent to pay.

      There is no webhook on this build, so a session created and paid was a charge the
      bakery had no record of: no recipient, no gift note, nothing but a Stripe payment
      carrying the payer's own address. Emailing first means the worst case is an order
      the bakery knows about that nobody completed, which is a phone call. The other way
      round, the worst case is a paid box nobody bakes.
    */
    await sendShipInquiry({ ...inquiry, gift: pendingNote(inquiry.gift) });

    try {
      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });
      const session = (await res.json()) as { url?: string; error?: { message?: string } };
      if (res.ok && session.url) {
        return NextResponse.redirect(session.url, 303);
      }
      /*
        Stripe answered and refused. The customer does not get a dead end: the order
        falls through to the same email path an unconfigured site uses, and the
        confirmation page tells them nothing was charged. The reason is logged for us.
      */
      console.error("[checkout] stripe refused the session:", session.error?.message ?? res.status);
    } catch (err) {
      console.error("[checkout] stripe unreachable, falling back to the email path", err);
    }
  }

  /*
    The honest path. Everything the bakery needs to pack and post the box, in an email,
    with the customer told plainly that nobody has taken any money.
  */
  const result = await sendShipInquiry(inquiry);
  const total = cartTotal(lines);
  console.info(
    `[checkout] unpaid order, ${lines.length} line(s), $${(total / 100).toFixed(2)}, ` +
      `${site.shortName} to ring ${inquiry.phone}`,
  );

  const response = NextResponse.redirect(
    new URL(`/shop/received?state=${result.delivered ? "sent" : result.reason}`, request.url),
    303,
  );
  // The cart is spent either way: the order has been taken, and a customer who reloads
  // should not find the same three boxes waiting to be ordered again.
  response.cookies.set({ name: CART_COOKIE, value: "", path: "/", maxAge: 0 });
  return response;
}
