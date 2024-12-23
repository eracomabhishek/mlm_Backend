const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // Use SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000, // Increase connection timeout (10 seconds)
  greetingTimeout: 30000,   // Increase greeting timeout (30 seconds)
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const sendEmails = async (savedUser) => {
  try {
    const ownerEmailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="background-color: #f8f9fa; padding: 20px; border-bottom: 2px solid #007bff;">
          <h2 style="color: #007bff; text-align: center; margin: 0;">New Contact Form Submission</h2>
        </div>
        <div style="padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; margin: 20px auto; max-width: 600px;">
          <p><strong>Name:</strong> ${savedUser.firstName} ${savedUser.lastName}</p>
          <p><strong>Email:</strong> ${savedUser.email}</p>
          <p><strong>Phone:</strong> ${savedUser.phoneNumber}</p>
          <p><strong>Subject:</strong> ${savedUser.subject}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color: #f1f1f1; padding: 10px; border-radius: 5px; color: #555;">${savedUser.message}</p>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 15px; color: #666;">
          <p>Click <a href="https://wa.me/${savedUser.phoneNumber}?text=Hello%20${savedUser.firstName}%20${savedUser.lastName},%20I%20have%20a%20question%20about%20your%20message." target="_blank" style="color: #25D366; font-weight: bold;">here</a> to chat with the sender on WhatsApp.</p>
        </div>
      </div>
    `;

    const senderEmailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="background-color: #007bff; color: #fff; padding: 20px; border-bottom: 2px solid #0056b3;">
          <h2 style="text-align: center; margin: 0;">Thank You for Contacting Us</h2>
        </div>
        <div style="padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; margin: 20px auto; max-width: 600px;">
          <p>Hi <strong>${savedUser.firstName}</strong>,</p>
          <p>Thank you for reaching out! We have received your message and will get back to you as soon as possible.</p>
          <h3 style="color: #007bff;">Here are the details of your submission:</h3>
          <p><strong>Subject:</strong> ${savedUser.subject}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color: #f1f1f1; padding: 10px; border-radius: 5px; color: #555;">${savedUser.message}</p>
          <p style="margin-top: 20px;">Best regards,</p>
          <p><strong>Team</strong></p>
        </div>
        <div style="background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd;">
          <p>© 2017 Eracom Technology. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send email to the owner
    await sendEmail({
      to: process.env.SMTP_USER,   // owner email
      subject: "New Contact Form Submission",
      html: ownerEmailContent,
    });

    // Send confirmation email to the sender
    await sendEmail({
      to: savedUser.email,
      subject: "We've received your query!",
      html: senderEmailContent,
    });
  } catch (error) {
    console.error("Error in sending emails:", error);
    throw error;
  }
};

module.exports = { sendEmails };





// const nodemailer = require("nodemailer");
// require("dotenv").config()

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,  
//   port: process.env.SMTP_PORT,
//   secure: true, 
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
//   connectionTimeout: 10000, // Increase connection timeout (10 seconds)
//   greetingTimeout: 30000,    // Increase greeting timeout (30 seconds)
// });

// exports.sendEmail = async ({ to, subject, html }) => {
//   try {
//     await transporter.sendMail({
//       from: process.env.SMTP_USER,
//       to,
//       subject,
//       html,
//     });
//     console.log("Email sent successfully");
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }
// };
