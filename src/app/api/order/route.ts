import { NextResponse, type NextRequest } from "next/server";
import { sendOrderInquiry, type OrderInquiry } from "@/lib/mail";

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
  const field = (k: string) => String(form.get(k) ?? "").trim().slice(0, 2000);

  // Honeypot. A real person never fills a field they cannot see, and this costs nothing
  // and needs no third-party captcha service.
  if (field("company")) {
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
  const state = result.delivered ? "sent" : "logged";
  return NextResponse.redirect(new URL(`/order/received?state=${state}`, request.url), 303);
}
