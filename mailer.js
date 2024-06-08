const nodemailer = require("nodemailer");

let transporter;
const createTransport = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true" ? true : false,
      auth: {
        user: process.env.SMTP_USER, // generated ethereal user
        pass: process.env.SMTP_PASS, // generated ethereal password
      },
    });
  }
  return transporter;
};

const sendMail = async (to, subject, text, html) => {
  const transporter = createTransport();
  return await transporter.sendMail({
    from: process.env.DEFAULT_SEND_EMAIL,
    to,
    bcc: process.env.DEFAULT_SEND_EMAIL,
    subject: process.env.SUBJECT,
    text,
    html,
  });
};

module.exports = {
  sendMail,
};
