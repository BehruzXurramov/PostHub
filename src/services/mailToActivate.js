import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendActivationMail(to, link) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Account Activation - PostHub",
    html: `<div>
        <h3></h3>To activate your account, please click on the link below:</h3>
        <a href="${link}">Verify Account</a>
        <br/>
        <h4 style="color:red">Please ignore this email if you did not request an account activation.</h4>
      </div>`,
  });
}
