const https = require("https");

const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "";
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "Store";
const RECEIVED_EMAIL = process.env.RECEIVED_EMAIL || "";

function sendBrevoEmail({ toEmail, toName, subject, html }) {
  return new Promise((resolve) => {
    if (!BREVO_API_KEY) {
      console.warn("Brevo API key missing.");
      return resolve(false);
    }
    const payload = JSON.stringify({
      sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
      to: [{ email: toEmail, name: toName || toEmail }],
      subject,
      htmlContent: html,
    });
    const req = https.request(
      {
        method: "POST",
        hostname: "api.brevo.com",
        port: 443,
        path: "/v3/smtp/email",
        headers: {
          "api-key": BREVO_API_KEY,
          "content-type": "application/json",
          "content-length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(true);
          } else {
            console.error("Brevo send failed:", res.statusCode, body);
            resolve(false);
          }
        });
      }
    );
    req.on("error", (err) => {
      console.error("Brevo send error:", err);
      resolve(false);
    });
    req.write(payload);
    req.end();
  });
}

// POST /contact
async function submitContact(req, res) {
  const { name, email, phone, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email and message are required." });
  }
  if (!RECEIVED_EMAIL) {
    return res.status(500).json({ success: false, message: "Recipient email not configured." });
  }

  const html = `
    <h2>New Contact Us Enquiry</h2>
    <table cellpadding="6" cellspacing="0">
      <tr><td><strong>Name</strong></td><td>${name}</td></tr>
      <tr><td><strong>Email</strong></td><td>${email}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${phone || "—"}</td></tr>
      <tr><td><strong>Message</strong></td><td>${message}</td></tr>
    </table>
  `;

  const sent = await sendBrevoEmail({
    toEmail: RECEIVED_EMAIL,
    toName: "Store Admin",
    subject: `Contact Us: ${name}`,
    html,
  });

  if (!sent) {
    return res.status(500).json({ success: false, message: "Failed to send email. Please try again." });
  }
  return res.json({ success: true, message: "Message sent successfully." });
}

// POST /b2b-contact
async function submitB2BContact(req, res) {
  const { name, business, email, phone, requirements } = req.body || {};
  if (!name || !email || !requirements) {
    return res.status(400).json({ success: false, message: "Name, email and requirements are required." });
  }
  if (!RECEIVED_EMAIL) {
    return res.status(500).json({ success: false, message: "Recipient email not configured." });
  }

  const html = `
    <h2>New B2B Connect Enquiry</h2>
    <table cellpadding="6" cellspacing="0">
      <tr><td><strong>Name</strong></td><td>${name}</td></tr>
      <tr><td><strong>Business</strong></td><td>${business || "—"}</td></tr>
      <tr><td><strong>Email</strong></td><td>${email}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${phone || "—"}</td></tr>
      <tr><td><strong>Requirements</strong></td><td>${requirements}</td></tr>
    </table>
  `;

  const sent = await sendBrevoEmail({
    toEmail: RECEIVED_EMAIL,
    toName: "Store Admin",
    subject: `B2B Enquiry: ${name}${business ? ` — ${business}` : ""}`,
    html,
  });

  if (!sent) {
    return res.status(500).json({ success: false, message: "Failed to send email. Please try again." });
  }
  return res.json({ success: true, message: "Request sent successfully." });
}

module.exports = { submitContact, submitB2BContact };
