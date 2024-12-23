const axios = require('axios');
require('dotenv').config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const sendTelegramMessage = async (message, parseMode = "MarkdownV2") => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    // Sending a POST request to Telegram API
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: parseMode,
    });
    console.log('Telegram sent successfully');
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    throw error;  // Re-throw the error for further handling if needed
  }
};

const sendMessageToTelegram = async (savedUser) => {
  try {
    const telegramMessage = `
      New contact form submission:

      <b>Name:</b> ${savedUser.firstName} ${savedUser.lastName}
      <b>Email:</b> ${savedUser.email}
      <b>Phone:</b> ${savedUser.phoneNumber}
      <b>Subject:</b> ${savedUser.subject}
      <b>Message:</b> ${savedUser.message}

      <a href="https://wa.me/${savedUser.phoneNumber}?text=Hello%20${savedUser.firstName},%20I%20have%20received%20your%20message">Chat on WhatsApp</a>
    `;
    await sendTelegramMessage(telegramMessage, "HTML");
  } catch (error) {
    console.error("Error in sending message to Telegram:", error);
    throw error;
  }
};

module.exports = { sendMessageToTelegram };





// const axios = require('axios');
// require('dotenv').config();

// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// exports.sendTelegramMessage = async (message, parseMode = "MarkdownV2") => {

//   try {
//     const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

//     // Sending a POST request to Telegram API
//     await axios.post(url, {
//       chat_id: TELEGRAM_CHAT_ID,
//       text: message,
//       parse_mode: parseMode, 
//     });
//     console.log('Telegram sent successfully');
//   } catch (error) {
//     console.error('Error sending message to Telegram:', error);
//     throw error;  // Re-throw the error for further handling if needed
//   }
// };
