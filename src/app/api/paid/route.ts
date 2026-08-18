import { NextResponse, type NextRequest } from "next/server";
import { CART_COOKIE } from "@/lib/cart";

/**
 * WHERE STRIPE SENDS PEOPLE BACK TO.
 *
 * Not the confirmation page directly, for two reasons that both bit this build.
 *
 * One: `?state=paid` on a page is a claim anybody can make. The confirmation page was
 * telling whoever loaded that URL that their card had been charged and a receipt was on
 * its way, which is a lie to a customer whose payment actually failed and a shareable
 * fake receipt for everybody else. Here the session is looked up with the bakery's own
 * secret key and the page is only told "paid" when Stripe says it was paid.
 *
 * Two: the cart. It was cleared on the email path and never on the paid one, so a
 * customer who paid still had the same three boxes waiting in the header, and pressing
 * the button again charged for them a second time. The cookie is cleared here, once,
 * against a session that really was paid.
 *
 * A GET with side effects is usually a smell, and the side effect here is deleting a
 * cookie belonging to the person making the request. Stripe redirects with a GET; this
 * is the one place that is true.
 */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("session_id") ?? "";
  const key = process.env.STRIPE_SECRET_KEY;

  const to = (state: string) =>
    NextResponse.redirect(new URL(`/shop/received?state=${state}`, request.url), 303);

  if (!key || !id.startsWith("cs_")) {
    // Somebody arrived here without a session. Nothing is claimed and nothing is
    // cleared: they are shown the page that says the bakery has the order but no money
    // has moved, which is the safe half-truth of the two.
    return to("logged");
  }

  try {
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(id)}`,
      { headers: { Authorization: `Bearer ${key}` } },
    );
    const session = (await res.json()) as { payment_status?: string };
    if (!res.ok || session.payment_status !== "paid") {
      console.warn("[paid] session not paid:", id, session.payment_status ?? res.status);
      return to("logged");
    }
  } catch (err) {
    console.error("[paid] could not verify the session with Stripe", err);
    return to("logged");
  }

  const response = to("paid");
  response.cookies.set({ name: CART_COOKIE, value: "", path: "/", maxAge: 0 });
  return response;
}
