const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const useSendGrid = Boolean(process.env.SEND_GRID_KEY);

let transporter = null;
if (useSendGrid) {
  transporter = nodemailer.createTransport(
    sendgridTransport({ auth: { api_key: process.env.SEND_GRID_KEY } })
  );
}

const sendMail = async (options) => {
  if (!transporter) {
    console.log("[mail] SendGrid not configured, email skipped:", options.subject);
    return false;
  }
  try {
    const info = await transporter.sendMail({
      from: "mailfoodeazy@gmail.com",
      ...options,
    });
    console.log("[mail] sent:", info.messageId);
    return true;
  } catch (err) {
    console.log("[mail] send failed:", err.message);
    return false;
  }
};

module.exports = { sendMail, useSendGrid };
