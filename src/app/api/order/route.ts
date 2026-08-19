import { NextResponse, type NextRequest } from "next/server";
import { sendOrderInquiry, summarize, type OrderInquiry } from "@/lib/mail";

/**
 * The order inquiry endpoint.
 *
 * A plain POST from a plain <form>, deliberately. No JavaScript is involved on the way
 * in, so this works with scripting off, which launch.md requires and which is also just
 * how a form should work. The response is a redirect, so the back button behaves and a
 * refresh does not resubmit.
 *
 * A 303 rather than a 301 or 302: glaze.md notes a 301 can turn a POST into a GET at
 * the wrong moment. 303 says "go and GET this instead", which is exactly what is meant.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  /*
    Only strings. A multipart part named `name` carrying a file coerces to the literal
    "[object File]", which is truthy, so every required-field check passed and the
    bakery got an order from a customer called [object File].
  */
  const field = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v.trim().slice(0, 2000) : "";
  };

  // Honeypot. A real person never fills a field they cannot see, and this costs nothing
  // and needs no third-party captcha service.
  if (field("website_url")) {
    /*
      Logged, not silently dropped. This used to return the same cheerful "it landed in
      their inbox" page while discarding the submission, so a false positive was a lost
      order with no trace anywhere. If a real person ever trips this, the payload is in
      the log to be rescued.
    */
    console.warn("[order-inquiry] honeypot tripped, discarded:\n" + summarize({
      name: field("name"), phone: field("phone"), email: field("email"),
      wanted: field("wanted"), when: field("when"), notes: field("notes"),
    }));
    return NextResponse.redirect(new URL("/order/received?state=sent", request.url), 303);
  }

  const inquiry: OrderInquiry = {
    name: field("name"),
    phone: field("phone"),
    email: field("email"),
    wanted: field("wanted"),
    when: field("when"),
    notes: field("notes"),
  };

  if (!inquiry.name || !inquiry.phone || !inquiry.wanted) {
    return NextResponse.redirect(new URL("/order?error=missing#form", request.url), 303);
  }

  const result = await sendOrderInquiry(inquiry);

  /*
    The confirmation page is told which of the two things happened, because the honest
    message differs. "We have it" and "we have it but nobody is watching that mailbox
    yet, please ring" are not the same sentence and must not look the same.
  */
  /*
    Three states, not two. "unconfigured" means mail was never switched on; "failed"
    means it was and the send threw. They are different sentences to a customer and
    different jobs for whoever fixes it, and collapsing them told people email was off
    when in fact their order had bounced off a broken mailbox.
  */
  const state = result.delivered ? "sent" : result.reason;
  return NextResponse.redirect(new URL(`/order/received?state=${state}`, request.url), 303);
}
