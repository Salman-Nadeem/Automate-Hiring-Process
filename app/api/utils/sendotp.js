import nodemailer from "nodemailer";

export async function sendOTP(email, otp) {  // TypeScript types hata diye
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // .env file se email
      pass: process.env.EMAIL_PASS, // .env file se password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}
