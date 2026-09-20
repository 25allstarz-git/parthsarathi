/**
 * Server-only transactional email. Uses Resend when RESEND_API_KEY is configured;
 * otherwise the in-app notification remains the delivery channel.
 */

export async function sendAdvocateCodeEmail(input: {
  to: string;
  name: string;
  code: string;
}): Promise<{ sent: boolean }> {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return { sent: false };

  const from = process.env["RESEND_FROM"] ?? "ParthSarathi <onboarding@resend.dev>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: "Your ParthSarathi Advocate Code",
        html: `<p>Dear ${input.name},</p>
<p>Your Bar Council credentials have been verified.</p>
<p><strong>Your ParthSarathi Advocate Code is ${input.code}</strong> — you'll use this to sign in.</p>
<p>Keep this code confidential. It identifies you as a verified advocate on ParthSarathi.</p>`,
      }),
    });
    return { sent: response.ok };
  } catch {
    return { sent: false };
  }
}
