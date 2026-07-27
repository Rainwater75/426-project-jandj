import express from "express";
import nodemailer from "nodemailer";

const app = express();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const email_deadline_digest = async (req, res) => {
  try {
    const { admin_email, admin_name, property_name, deadlines } = req.body;

    //input validation
    if (
      !admin_email ||
      !property_name ||
      !Array.isArray(deadlines) ||
      deadlines.length === 0
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: admin_email, property_name, and non-empty deadlines array",
      });
    }

    const sorted_deadlines = [...deadlines].sort(
      (a, b) => new Date(a.due_date) - new Date(b.due_date),
    );

    //compose deadline digest
    const deadline_digest_html = sorted_deadlines
      .map((item) => {
        const formattedDate = new Date(item.due_date).toLocaleDateString(
          undefined,
          {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          },
        );

        return `
          <tr style="border-bottom: 1px solid #e0e0e0;">
            <td style="padding: 10px; font-weight: bold;">${item.title}</td>
            <td style="padding: 10px; color: #d9534f; font-weight: bold;">${formattedDate}</td>
            <td style="padding: 10px;">${item.description || "N/A"}</td>
          </tr>
        `;
      })
      .join("");

    //compose email body
    const email_body = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
        <h2>TOPA Critical Deadlines Digest</h2>
        <p>Hi ${admin_name || "Tenant Admin"},</p>
        <p>Here is your digest of upcoming TOPA compliance deadlines for <strong>${property_name}</strong>:</p>

        <table style="width: 100%; border-collapse: collapse; text-align: left; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f4f4f4;">
              <th style="padding: 10px;">Milestone / Action</th>
              <th style="padding: 10px;">Due Date</th>
              <th style="padding: 10px;">Details</th>
              <th style="padding: 10px;">Link</th>
            </tr>
          </thead>
          <tbody>
            ${deadline_digest_html}
          </tbody>
        </table>

        <p style="font-size: 0.9em; color: #666;">
          <em>Note: Missing a statutory TOPA deadline can forfeit tenant rights. Please review these items with your legal counsel or assignee non-profit promptly.</em>
        </p>

        <p>Best regards,<br/>Your Tenant Organizing Platform</p>
      </div>
    `;

    //send email
    const result = await transporter.sendMail({
      from: process.env.DEFAULT_FROM_EMAIL,
      to: admin_email,
      subject: `[TOPA Alert] Upcoming Deadlines Digest for ${property_name}`,
      html: email_body,
    });

    res.status(200).json({
      success: true,
      messageId: result.messageId,
      type: "topa_digest_notification",
    });
  } catch (error) {
    console.error("TOPA digest notification error:", error);
    res.status(500).json({
      error: "Failed to send TOPA deadline digest",
      message: error.message,
    });
  }
};

//expected payload
// {
//   "admin_email": "admin@gmail.org",
//   "admin_name": "Alex",
//   "property_name": "742 Evergreen Terrace",
//   "deadlines": [
//     {
//       "title": "Notice of Intent to Match",
//       "due_date": "2026-08-15T23:59:59Z",
//       "description": "30-day window to match outside contract price",
//     },
//     {
//       "title": "Execute Purchase & Sale Agreement",
//       "due_date": "2026-09-14T23:59:59Z",
//       "description": "Finalize formal P&S contract with owner attorneys",
//     }
//   ]
// }

app.post("/email_deadline_digest", email_deadline_digest);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Email Ambassador running on port ${PORT}`);
});
