const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
      user: 'elta.jakubowski@ethereal.email',
      pass: '9n8mJay8UrqCvSXH3n'
  },
  logger: true, // Log connection details
  debug: true,  // Enable debugging output
});

   

exports.sendEmail = async ({ to, subject, text }) => {
    try {
      await transporter.sendMail({
        from:'"Abhishek" <brennan42@ethereal.email>',
        to,
        subject,
        text,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };
