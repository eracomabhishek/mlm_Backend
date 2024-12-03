const axios = require('axios');
require('dotenv').config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

exports.sendTelegramMessage = async (message) => {

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    // Sending a POST request to Telegram API
    const response = await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });

    // Log the response for debugging
    console.log('Message sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    throw error;  // Re-throw the error for further handling if needed
  }
};
