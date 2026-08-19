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

/**
 * A box going somewhere. Same pipeline as an order, different shape, because a shipped
 * order needs an address and a date and an order for the counter does not.
 */
export type ShipInquiry = {
  /** Already carries its own per-line quantities: "3 x Nut Rolls; 1 x Signature Tin". */
  box: string;
  /** Boxes in the order, all lines added up. A count, not a multiplier. */
  quantity: string;
  /** What the customer owes, formatted. The person ringing for the card needs a figure. */
  total?: string;
  /** Who it goes to, and where. */
  to: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  arriveBy: string;
  gift: string;
  /** Who is sending it, and how the bakery reaches them for payment. */
  name: string;
  phone: string;
  email: string;
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

export function summarizeShip(o: ShipInquiry) {
  return [
    /*
      NOT `${o.quantity} x ${o.box}`, which is what this said and which put the count in
      front of a string that already had its own counts in it: a cart of three dozen nut
      rolls and two fritters reached the bakery as "5 x 3 x Classic Nut Rolls (1 dozen);
      2 x Apple & Raisin Fritters". A baker reading that packs fifteen dozen. It fired on
      every order.
    */
    `Order:  ${o.box}`,
    o.total ? `Total:  ${o.total}, shipping included. Nothing has been charged.` : null,
    `To:     ${o.to}`,
    `        ${o.address}`,
    `        ${o.city}, ${o.state} ${o.zip}`,
    o.arriveBy ? `Arrive: ${o.arriveBy}` : null,
    o.gift ? `Gift:   ${o.gift}` : null,
    `From:   ${o.name}`,
    `Phone:  ${o.phone}`,
    o.email ? `Email:  ${o.email}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * The shipping request, on exactly the same terms as the order form: it succeeds for
 * the visitor whatever the mail plumbing is doing, and when nothing was sent the
 * confirmation page says so rather than thanking them for nothing.
 *
 * It takes no payment, and the page never implies it did. The bakery rings for the
 * card, which is how they take a shipped order today. Paid checkout is the store
 * add-on, quoted separately, and when it lands this route is what it replaces.
 */
export async function sendShipInquiry(o: ShipInquiry): Promise<SendResult> {
  const body = summarizeShip(o);

  if (!configured()) {
    console.info("[ship-inquiry] mail not configured, payload follows:\n" + body);
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
      replyTo: o.email || undefined,
      subject: `Shipping request from ${o.name} to ${o.city}, ${o.state}`,
      text: body,
    });
    return { delivered: true };
  } catch (err) {
    console.error("[ship-inquiry] send failed, payload follows:\n" + body, err);
    return { delivered: false, reason: "failed" };
  }
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
