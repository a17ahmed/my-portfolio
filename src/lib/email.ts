import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions) {
  try {
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      replyTo,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Failed to send email");
  }
}

export function generateContactEmailHtml({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Message</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); padding: 30px; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Message from Portfolio</h1>
        </div>

        <div style="background-color: #1a1a1a; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #333; border-top: none;">
          <div style="margin-bottom: 20px;">
            <p style="color: #888; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase;">From</p>
            <p style="color: #fff; margin: 0; font-size: 16px;">${name}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <p style="color: #888; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase;">Email</p>
            <p style="color: #06b6d4; margin: 0; font-size: 16px;">
              <a href="mailto:${email}" style="color: #06b6d4; text-decoration: none;">${email}</a>
            </p>
          </div>

          <div style="margin-bottom: 20px;">
            <p style="color: #888; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase;">Subject</p>
            <p style="color: #fff; margin: 0; font-size: 16px;">${subject}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <p style="color: #888; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase;">Message</p>
            <div style="background-color: #0a0a0a; padding: 20px; border-radius: 8px; border: 1px solid #333;">
              <p style="color: #fff; margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Reply to ${name}
            </a>
          </div>
        </div>

        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">
          This message was sent from your portfolio contact form.
        </p>
      </div>
    </body>
    </html>
  `;
}
