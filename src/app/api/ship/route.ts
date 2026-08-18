import { NextResponse, type NextRequest } from "next/server";
import { sendShipInquiry, type ShipInquiry } from "@/lib/mail";

/**
 * The shipping request endpoint.
 *
 * Twin of /api/order in every respect that matters: a plain POST from a plain form, no
 * JavaScript on the way in, and a 303 back so the back button behaves and a refresh
 * does not resubmit.
 *
 * It takes no payment. The bakery rings for the card, and the confirmation page says
 * which of the two things happened to the message rather than thanking everybody
 * identically.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const field = (k: string) => String(form.get(k) ?? "").trim().slice(0, 2000);

  // Honeypot: a real person never fills a field they cannot see.
  if (field("company")) {
    return NextResponse.redirect(new URL("/shop/received?state=sent", request.url), 303);
  }

  const inquiry: ShipInquiry = {
    box: field("box"),
    quantity: field("quantity") || "1",
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

  const missing =
    !inquiry.box ||
    !inquiry.to ||
    !inquiry.address ||
    !inquiry.city ||
    !inquiry.state ||
    !inquiry.zip ||
    !inquiry.name ||
    !inquiry.phone;

  if (missing) {
    return NextResponse.redirect(new URL("/shop?error=missing#ship", request.url), 303);
  }

  const result = await sendShipInquiry(inquiry);
  const state = result.delivered ? "sent" : "logged";
  return NextResponse.redirect(new URL(`/shop/received?state=${state}`, request.url), 303);
}
