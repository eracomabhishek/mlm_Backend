const User = require("../model/contactSchema")
const emailService = require("../services/emailService");
const telegramService = require("../services/telegramService");

class ContactController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.fields = req.body;
  }

  // Input validation method
  validateFields() {
    const { firstName, lastName, phoneNumber, email, subject, message } = this.fields;

    const requiredFields = ["firstName", "lastName", "phoneNumber", "email", "subject", "message"];
  
    // Check if all required fields are present
    for (let field of requiredFields) {
      if (!this.fields[field]) {
        return this.res.status(400).json({ msg: `Please enter ${field}` });
      }
    }

      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(email)) {
      return this.res.status(400).json({ msg: "Invalid email format" });
      }

    const phoneRegex = /^\+\d{1,4}\s?\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return this.res.status(400).json({ msg: "Invalid phone number format" });
    }

    return null; // No validation errors
  }

  // Method to save user to the database
  async saveContact() {
    try {
      const newUser = new User(this.fields);
      await newUser.save();
      console.log(newUser);
      
      return newUser; // Return the saved user data for further processing
    } catch (error) {
      console.error(error);
      throw new Error('Database save failed');
    }
  }

  // Method to send email to the owner
  async sendEmailToOwner(savedUser) {
    try {
      const emailContent = `
        New contact form submission:
        Name: ${savedUser.firstName} ${savedUser.lastName}
        Email: ${savedUser.email}
        Phone: ${savedUser.phoneNumber}
        Subject: ${savedUser.subject}
        Message: ${savedUser.message}
      `;
      console.log(`email here ${emailContent}`);
      
      await emailService.sendEmail({
        to: "abhishekeracom@gmail.com", // Replace with the owner's email
        subject: "New Contact Form Submission",
        text: emailContent,
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new Error('Email sending failed');
    }
  }

  // Method to send message to Telegram
  async sendMessageToTelegram(savedUser) {
    try {
      const telegramMessage = `
        New contact form submission:
        Name: ${savedUser.firstName} ${savedUser.lastName}
        Email: ${savedUser.email}
        Phone: ${savedUser.phoneNumber}
        Subject: ${savedUser.subject}
        Message: ${savedUser.message}
      `;
      await telegramService.sendTelegramMessage(telegramMessage);
    } catch (error) {
      console.error("Failed to send Telegram message:", error);
      throw new Error('Telegram message sending failed');
    }
  }

  // Main handler
  async handleRequest() {
    console.log("Processing contact form...");
    // console.log(this.fields);

    // Validate fields
    const validationError = this.validateFields();
    if (validationError) return validationError;

    try {
      // Save contact to the database
      const savedUser = await this.saveContact();
        // console.log(` before save ${savedUser}`);
        
        
        // Send message to Telegram
        await this.sendMessageToTelegram(savedUser);
        
        // Send email to the owner
        await this.sendEmailToOwner(savedUser);
        
      return this.res.status(201).json({ message: 'Successful sent!',
                                          data: {
                                              firstName: savedUser.firstName,
                                              lastName: savedUser.lastName,
                                              email: savedUser.email,
                                              phoneNumber: savedUser.phoneNumber,
                                              subject: savedUser.subject,
                                              message: savedUser.message,
                                            },
       });
    } catch (error) {
      console.error(error.message);
      return this.res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
  }
}

module.exports = async (req, res) => {
  const controller = new ContactController(req, res);
  await controller.handleRequest();
};
