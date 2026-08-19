import type { Metadata } from "next";
import { ButtonLink, PageHero } from "@/components/Ui";
import CallHint from "@/components/CallHint";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Shipping request sent",
  description: "Your box request has gone to Louie's Bakery in Marshall, Michigan.",
  robots: { index: false },
};

/**
 * Same two messages as the order confirmation, and the same rule: they must not look
 * alike. `sent` means it is in the bakery's inbox. `logged` means mail is not switched
 * on yet, the request was kept and logged, and nobody has been pinged, which is a
 * sentence this page says out loud rather than dressing up as a thank you.
 *
 * Only the paid branch says money moved, and it is only reachable through /api/paid,
 * which asks Stripe whether the session was really paid before this page loads.
 */
export default async function ShipReceivedPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  const delivered = state === "sent" || state === "paid";
  /*
    Four states, and each says a different sentence, because they mean different things
    to the person reading and to whoever has to fix it:

      sent          in the bakery's inbox
      paid          the card went through and the order is with them
      unconfigured  mail was never switched on, so nobody has been notified
      failed        mail was switched on and the send threw

    They come in on the query string from the redirect. Not a secret, not worth a
    session for.
  */
  const failed = state === "failed";
  const paid = state === "paid";

  return (
    <>
      <PageHero
        eyebrow={delivered ? "Got it" : "Saved, but read this"}
        title={
          paid
            ? "Paid, and the bakery has it."
            : delivered
              ? "That is with the bakery."
              : "We have your box. Please ring to finish it."
        }
      />

      <section className="grain relative isolate bg-paper">
        <div className="relative mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
          {delivered ? (
            <div className="space-y-4 text-lg leading-relaxed text-awning/85">
              <p>
                {paid
                  ? "Your card has been charged and a receipt is on its way from our card processor. The bakery has the order and the address."
                  : "It landed in their inbox. Someone will ring you to take the card before anything is packed."}
              </p>
              <p>
                Boxes are baked the night before and go out {site.shipping.day} morning on
                the {site.shipping.carrier} truck. If your order lands after that truck
                has gone it waits for the next one
                {paid
                  ? ", and the bakery will email you which week it is on."
                  : ", and they will tell you which week it is on the call."}
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-lg leading-relaxed text-awning/85">
              <p>
                <strong className="font-semibold text-awning">
                  {failed
                    ? "Your box is saved, but the email to the bakery did not go through,"
                    : "Your box is saved, but email from this site is not switched on yet,"}
                </strong>{" "}
                so nobody at the bakery has been notified. That is on us, not on you.
              </p>
              <p>
                Please ring the shop. They can take the address and the card in about two
                minutes, and it is the fastest way regardless.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={site.phoneHref} variant="dark">
              Call {site.phone}
            </ButtonLink>
            <ButtonLink href="/shop" variant="dark">
              Back to the boxes
            </ButtonLink>
          </div>
          <CallHint />
        </div>
      </section>
    </>
  );
}
