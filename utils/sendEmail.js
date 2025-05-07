const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmail({ to, subject, text, html }) {
  let transporter;

  if (process.env.NODE_ENV === 'development') {
    // Use Ethereal Email for development
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log(`[DEBUG] Ethereal test account created: ${testAccount.user}`);
  } else {
    // Use real SMTP settings for production
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465, // Use port 465 for SSL
      secure: true, // Enable SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'no-reply@example.com',
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }
}

module.exports = sendEmail;
