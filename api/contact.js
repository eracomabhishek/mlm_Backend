const User = require('../model/contactSchema')
const { sendEmails } = require('../services/emailService');
const { sendMessageToTelegram } = require('../services/telegramService');

class ContactController {
  async handleRequest(req, res) {
    const fields = req.body;

    // Input validation
    const requiredFields = ["firstName", "lastName", "phoneNumber", "email", "subject", "message"];
    for (let field of requiredFields) {
      if (!fields[field]) {
        return res.status(400).json({ msg: `Please enter ${field}` });
      }
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(fields.email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    const phoneRegex = /^\+\d{1,4}\s?\d{10}$/;
    if (!phoneRegex.test(fields.phoneNumber)) {
      return res.status(400).json({ msg: "Invalid phone number format" });
    }

    try {
      // Save contact
      const newUser = new User(fields);
      await newUser.save();
      console.log(newUser);

      // Send Telegram message
      await sendMessageToTelegram(newUser);

      // Send emails
      await sendEmails(newUser);

      // Success response
      return res.status(200).json({
        message: "Successful sent!",
        data: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          subject: newUser.subject,
          message: newUser.message,
        },
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
  }
}

const contactcontroller = new ContactController();
module.exports = contactcontroller;


// const profile = new PROFILE();
// module.exports = profile;
















// const User = require("../model/contactSchema");
// const emailService = require("../services/emailService");
// const telegramService = require("../services/telegramService");
// require("dotenv").config()


// class ContactController {
//   constructor(req, res) {
//     this.req = req;
//     this.res = res;
//     this.fields = req.body;
//   }

//   // Input validation method
//   validateFields() {
//     const { firstName, lastName, phoneNumber, email, subject, message } = this.fields;

//     const requiredFields = ["firstName", "lastName", "phoneNumber", "email", "subject", "message"];

//     for (let field of requiredFields) {
//       if (!this.fields[field]) {
//         return this.res.status(400).json({ msg: `Please enter ${field}` });
//       }
//     }

//     const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
//     if (!emailRegex.test(email)) {
//       return this.res.status(400).json({ msg: "Invalid email format" });
//     }

//     const phoneRegex = /^\+\d{1,4}\s?\d{10}$/;
//     if (!phoneRegex.test(phoneNumber)) {
//       return this.res.status(400).json({ msg: "Invalid phone number format" });
//     }

//     return null; // No validation errors
//   }

//   async saveContact() {
//     try {
//       const newUser = new User(this.fields);
//       await newUser.save();
//       console.log(newUser);

//       return newUser;
//     } catch (error) {
//       console.error(error);
//       throw new Error("Database save failed");
//     }
//   }

//   async sendEmails(savedUser) {
//     try {
//       const ownerEmailContent = `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//         <div style="background-color: #f8f9fa; padding: 20px; border-bottom: 2px solid #007bff;">
//           <h2 style="color: #007bff; text-align: center; margin: 0;">New Contact Form Submission</h2>
//         </div>
//         <div style="padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; margin: 20px auto; max-width: 600px;">
//           <p><strong>Name:</strong> ${savedUser.firstName} ${savedUser.lastName}</p>
//           <p><strong>Email:</strong> ${savedUser.email}</p>
//           <p><strong>Phone:</strong> ${savedUser.phoneNumber}</p>
//           <p><strong>Subject:</strong> ${savedUser.subject}</p>
//           <p><strong>Message:</strong></p>
//           <p style="background-color: #f1f1f1; padding: 10px; border-radius: 5px; color: #555;">${savedUser.message}</p>
//         </div>
//         <div style="text-align: center; margin-top: 20px; font-size: 15px; color: #666;">
//           <p>Click <a href="https://wa.me/${savedUser.phoneNumber}?text=Hello%20${savedUser.firstName}%20${savedUser.lastName},%20I%20have%20a%20question%20about%20your%20message." target="_blank" style="color: #25D366; font-weight: bold;">here</a> to chat with the sender on WhatsApp.</p>
//         </div>
//       </div>
//      `;
     
//       const senderEmailContent = `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//         <div style="background-color: #007bff; color: #fff; padding: 20px; border-bottom: 2px solid #0056b3;">
//           <h2 style="text-align: center; margin: 0;">Thank You for Contacting Us</h2>
//         </div>
//         <div style="padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; margin: 20px auto; max-width: 600px;">
//           <p>Hi <strong>${savedUser.firstName}</strong>,</p>
//           <p>Thank you for reaching out! We have received your message and will get back to you as soon as possible.</p>
//           <h3 style="color: #007bff;">Here are the details of your submission:</h3>
//           <p><strong>Subject:</strong> ${savedUser.subject}</p>
//           <p><strong>Message:</strong></p>
//           <p style="background-color: #f1f1f1; padding: 10px; border-radius: 5px; color: #555;">${savedUser.message}</p>
//           <p style="margin-top: 20px;">Best regards,</p>
//           <p><strong>Team</strong></p>
//         </div>
//         <div style="background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd;">
//           <p>© 2017 Eracom Technlogy. All rights reserved.</p>
//         </div>
//       </div>
//      `;

//       // Send email to the owner
//       await emailService.sendEmail({
//         to: process.env.SMTP_USER,   // owner email
//         subject: "New Contact Form Submission",
//         html: ownerEmailContent,
//       });

//       // Send confirmation email to the sender
//       await emailService.sendEmail({
//         to: savedUser.email,
//         subject: "We've received your query!",
//         html: senderEmailContent,
//       });
//     } catch (error) {
//       console.error("Failed to send emails:", error);
//       throw new Error("Email sending failed");
//     }
//   }

//   async sendMessageToTelegram(savedUser) {
//     try {
//       const telegramMessage = `
//         New contact form submission:

//           <b>Name:</b> ${savedUser.firstName} ${savedUser.lastName}
//           <b>Email:</b> ${savedUser.email}
//           <b>Phone:</b> ${savedUser.phoneNumber}
//           <b>Subject:</b> ${savedUser.subject}
//           <b>Message:</b> ${savedUser.message}

//           <a href="https://wa.me/${savedUser.phoneNumber}?text=Hello%20${savedUser.firstName},%20I%20have%20received%20your%20message">Chat on WhatsApp</a>
//         `;
//       await telegramService.sendTelegramMessage(telegramMessage, "HTML");
//     } catch (error) {
//       console.error("Failed to send Telegram message:", error);
//       throw new Error("Telegram message sending failed");
//     }
//   }

//   async handleRequest() {
//     console.log("Processing contact form...");

//     const validationError = this.validateFields();
//     if (validationError) return validationError;

//     try {
//       const savedUser = await this.saveContact();
//       await this.sendMessageToTelegram(savedUser);
//       await this.sendEmails(savedUser);

//       return this.res.status(200).json({
//         message: "Successful sent!",
//         data: {
//           firstName: savedUser.firstName,
//           lastName: savedUser.lastName,
//           email: savedUser.email,
//           phoneNumber: savedUser.phoneNumber,
//           subject: savedUser.subject,
//           message: savedUser.message,
//         },
//       });
//     } catch (error) {
//       console.error(error.message);
//       return this.res.status(500).json({ error: "Something went wrong. Please try again later." });
//     }
//   }
// }

// module.exports = async (req, res) => {
//   const controller = new ContactController(req, res);
//   await controller.handleRequest();
// };
