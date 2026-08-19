import type { Metadata } from "next";
import { ButtonLink, PageHero } from "@/components/Ui";
import CallHint from "@/components/CallHint";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Order sent",
  description: "Your order inquiry has gone to Louie's Bakery in Marshall, Michigan.",
  robots: { index: false },
};

/**
 * Two messages, and they must not look the same.
 *
 * `sent` means it is in the bakery's inbox.
 *
 * `logged` means mail is not configured yet, or a send failed. The submission was kept
 * and is in the server log, but nobody at the bakery has been pinged, and glaze.md is
 * explicit that saying "thanks, we got it" in that situation is the thing you do not
 * do. So this says what actually happened and puts the phone number in front of them.
 *
 * The state comes in on the query string from the redirect. It is not a secret and not
 * worth a session for.
 */
export default async function ReceivedPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  /* No payment path reaches this page: /order takes no money. "sent" is the only
     state that means the bakery has it. */
  const delivered = state === "sent";
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

  return (
    <>
      <PageHero
        eyebrow={delivered ? "Got it" : "Saved, but read this"}
        title={delivered ? "That is with the bakery." : "We have your order. Please ring to confirm."}
      />

      <section className="grain relative isolate bg-paper">
        <div className="relative mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
          {delivered ? (
            <div className="space-y-4 text-lg leading-relaxed text-awning/85">
              <p>
                It landed in their inbox. Someone will call you back to confirm the time and
                what it comes to, usually the same morning they open next.
              </p>
              <p>
                They bake Tuesday through Saturday and open at half past five. If you have
                not heard by the end of the next open day, ring the shop.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-lg leading-relaxed text-awning/85">
              <p>
                <strong className="font-semibold text-awning">
                  {failed
                    ? "Your details are saved, but the email to the bakery did not go through,"
                    : "Your details are saved, but email from this site is not switched on yet,"}
                </strong>{" "}
                so nobody at the bakery has been notified. That is on us, not on you.
              </p>
              <p>
                Please ring the shop and they will take the order in about a minute. It is
                the fastest way regardless.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={site.phoneHref} variant="dark">
              Call {site.phone}
            </ButtonLink>
            <ButtonLink href="/menu" variant="dark">
              Back to the case
            </ButtonLink>
          </div>
          <CallHint />
        </div>
      </section>
    </>
  );
}
