import { getEnv } from "./cf";

const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/**
 * Sends mail over SMTP from a Worker (worker-mailer uses cloudflare:sockets).
 * Port 465 = implicit TLS, 587 = STARTTLS. Port 25 is blocked on Workers.
 */
export async function sendMail({ to, subject, text, html }) {
    const env = await getEnv();
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) throw new Error("SMTP is not configured");

    const port = Number(SMTP_PORT || 465);
    const { WorkerMailer } = await import("worker-mailer");
    await WorkerMailer.send(
        {
            host: SMTP_HOST,
            port,
            secure: port === 465,
            startTls: port !== 465,
            authType: "plain",
            credentials: { username: SMTP_USER, password: SMTP_PASS },
        },
        { from: SMTP_FROM || SMTP_USER, to, subject, text, html }
    );
}

export function buildConfirmationEmail(event, registration) {
    const when =
        event.endDate && event.endDate !== event.startDate
            ? `${event.startDate} to ${event.endDate}`
            : event.startDate;
    const where = event.location ? `\nWhere: ${event.location}` : "";
    const text =
        `Hi ${registration.name},\n\n` +
        `You're registered (Going) for "${event.title}".\n\n` +
        `When: ${when}${where}\n\n` +
        `See you there!\nCompSciety - BulSU`;
    const html =
        `<p>Hi ${esc(registration.name)},</p>` +
        `<p>You're registered (<strong>Going</strong>) for <strong>${esc(event.title)}</strong>.</p>` +
        `<p><strong>When:</strong> ${esc(when)}` +
        (event.location ? `<br><strong>Where:</strong> ${esc(event.location)}` : "") +
        `</p><p>See you there!<br>CompSciety - BulSU</p>`;
    return { subject: `You're registered: ${event.title}`, text, html };
}
