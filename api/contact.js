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
