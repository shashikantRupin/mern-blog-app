const nodemailer = require('nodemailer');

/**
 * Configure Nodemailer Transporter
 * Supports Gmail Service or custom SMTP configuration
 */
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '';
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim().replace(/\s+/g, '') : '';

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST.trim(),
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER ? process.env.SMTP_USER.trim() : emailUser,
        pass: process.env.SMTP_PASS ? process.env.SMTP_PASS.trim().replace(/\s+/g, '') : emailPass,
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
    });
  }

  // Use direct Gmail SMTP SSL on port 465 for 100% reliability on cloud hosts (Render, AWS, Vercel)
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL on port 465 prevents STARTTLS hang on Render
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
};

/**
 * Generate Responsive HTML Email Template for OTP
 */
const getOtpHtmlTemplate = (otp, userName = 'Creator') => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0b0f19; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" max-width="540" style="max-width: 540px; background-color: #131b2e; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);">
          
          <!-- Header with Brand Accent -->
          <tr>
            <td style="padding: 36px 36px 20px 36px; text-align: center; border-bottom: 1px solid #1e293b; background: linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%);">
              <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: #ffffff; font-size: 22px; font-weight: bold; border-radius: 12px; text-align: center; margin-bottom: 12px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);">
                ✦
              </div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
                BlogNest Security
              </h1>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 36px;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #f8fafc;">
                Password Reset Verification
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 14.5px; line-height: 1.6; color: #94a3b8;">
                Hello${userName ? ` <strong style="color: #f1f5f9;">${userName}</strong>` : ''},<br>
                We received a request to reset the password for your BlogNest account. Please use the 6-digit security code below to complete the verification process:
              </p>

              <!-- OTP Code Display Box -->
              <div style="margin: 28px 0; padding: 20px; background-color: #0f172a; border: 1.5px solid #6366f1; border-radius: 12px; text-align: center;">
                <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #818cf8; display: block; margin-bottom: 8px;">
                  Your Verification Code
                </span>
                <span style="font-family: 'Courier New', Courier, monospace, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #ffffff; text-shadow: 0 0 12px rgba(99, 102, 241, 0.5);">
                  ${otp}
                </span>
              </div>

              <!-- Time Limit & Expiry Info -->
              <div style="padding: 12px 16px; background-color: rgba(245, 158, 11, 0.1); border-left: 3px solid #f59e0b; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13.5px; color: #fbbf24; line-height: 1.5;">
                  ⏱ <strong>Note:</strong> This verification code expires in <strong>10 minutes</strong>.
                </p>
              </div>

              <p style="margin: 0 0 12px 0; font-size: 13.5px; line-height: 1.5; color: #64748b;">
                If you did not request this password reset, please ignore this email or reach out to support. Your account password remains safe and unchanged.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #0a0f1d; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.5;">
                © 2026 BlogNest Platform • Designed for Creators & Readers<br>
                This is an automated system message, please do not reply directly.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

/**
 * Send OTP Email Function
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.otp - 6-digit numeric OTP code
 * @param {string} [options.userName] - Recipient name
 * @returns {Promise<Object>}
 */
const sendOtpEmail = async ({ to, otp, userName }) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn('\n⚠️ [EMAIL SERVICE WARNING]');
    console.warn('EMAIL_USER and EMAIL_PASS are not configured in backend/.env.');
    console.warn(`Generated OTP for ${to}: ${otp}`);
    console.warn('To send real emails to inboxes, add EMAIL_USER and EMAIL_PASS to backend/.env\n');
    return {
      success: false,
      error: 'SMTP credentials (EMAIL_USER & EMAIL_PASS) are not set in backend/.env',
      simulated: true,
    };
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"BlogNest" <${emailUser}>`,
    to: to,
    subject: `🔐 BlogNest Password Reset Code: ${otp}`,
    text: `Your BlogNest password reset code is: ${otp}. This code is valid for 10 minutes.`,
    html: getOtpHtmlTemplate(otp, userName),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SERVICE] OTP Email sent successfully to ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EMAIL SERVICE ERROR] Failed to send email to ${to}:`, error.message);
    throw error;
  }
};

module.exports = { sendOtpEmail };
