const nodemailer = require("nodemailer");
const expressAsyncHandler = require("express-async-handler");

const sendEmail = expressAsyncHandler(async (data, req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MP,
      },
    });

    const info = await transporter.sendMail({
      from: '"Zeenet e-commerce" <technologieszeent@gmail.com>',
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL:%s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = sendEmail;
