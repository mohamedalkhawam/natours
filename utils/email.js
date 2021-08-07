const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    logger: true,
    debug: true,
    //activate in gmail less secure app option
  });
  // 2) Define the email options
  const mailOptions = {
    from: 'Mohamed AL-Khawam <mohamed.kh1994@live.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  // 3) Send the email with nodeMailer
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
