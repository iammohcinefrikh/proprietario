import nodemailer from "nodemailer";

const sendEmail = (userName: string, userEmail: string, emailSubject: string, formattedEmailBody: string, rawEmailBody: string) => {
  const mailTransporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
  });

  const emailMessage = {
  from: `Proprietario Mailer <${process.env.EMAIL_ADDRESS}>`,
  to: `${userName} <${userEmail}>`,
  subject: `${emailSubject}`,
  text: `${rawEmailBody}`,
  html: `${formattedEmailBody}`
  };

  mailTransporter.sendMail(emailMessage, (error, info) => {
    if (error) {
      return error;
    }
  });
}

export default sendEmail;