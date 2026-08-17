import "server-only";

/**
 * SENDING MAIL, AND BEING HONEST WHEN WE CANNOT
 *
 * glaze.md's rules, applied:
 *
 *   - SMTP through a mailbox the bakery already owns, not a hosted API. Nodemailer is
 *     a package, not a service; nobody pays a subscription for this.
 *   - The reply address is the customer, so Jason hits reply and it goes to the person
 *     who ordered rather than to us.
 *   - When mail is unconfigured the submission must still succeed for the visitor and
 *     the whole payload gets logged, because the delivery is the operator's problem to
 *     see, not the customer's.
 *   - What is explicitly not acceptable is a stub that pauses and says "thanks, we got
 *     it" while sending nowhere. So when mail is off, the confirmation page says so in
 *     plain words and hands the visitor the phone number and their own summary.
 *
 * Secrets are set in the Vercel dashboard. .env.example is the authority on what this
 * needs, and nothing here reads a value that is written down in the repo.
 */

export type OrderInquiry = {
  name: string;
  phone: string;
  email: string;
  wanted: string;
  when: string;
  notes: string;
};

export type SendResult =
  | { delivered: true }
  | { delivered: false; reason: "unconfigured" | "failed" };

function configured() {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.ORDER_TO,
  );
}

export function summarize(o: OrderInquiry) {
  return [
    `Name:   ${o.name}`,
    `Phone:  ${o.phone}`,
    o.email ? `Email:  ${o.email}` : null,
    `Wants:  ${o.wanted}`,
    `When:   ${o.when}`,
    o.notes ? `Notes:  ${o.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendOrderInquiry(o: OrderInquiry): Promise<SendResult> {
  const body = summarize(o);

  if (!configured()) {
    /*
      Not a swallowed error. This is the whole payload, on one line, in the place the
      operator actually looks. Nothing a customer typed is lost because a variable is
      unset, and the confirmation page tells them the truth about what happened.
    */
    console.info("[order-inquiry] mail not configured, payload follows:\n" + body);
    return { delivered: false, reason: "unconfigured" };
  }

  try {
    const nodemailer = (await import("nodemailer")).default;
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT ?? 587) === 465,
      auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    });

    await transport.sendMail({
      from: `"Louie's Bakery website" <${process.env.SMTP_USER}>`,
      to: process.env.ORDER_TO!,
      // Jason replies to the customer, not to us.
      replyTo: o.email || undefined,
      subject: `Order inquiry from ${o.name}`,
      text: body,
    });
    return { delivered: true };
  } catch (err) {
    // Same rule as unconfigured: the visitor is not punished for our plumbing, and the
    // payload survives in the log.
    console.error("[order-inquiry] send failed, payload follows:\n" + body, err);
    return { delivered: false, reason: "failed" };
  }
}
