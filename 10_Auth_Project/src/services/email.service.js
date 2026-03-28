const config = require('../config/config.js');
const nodemailer = require('nodemailer');

function createTransporter() {
  if (config.GOOGLE_USER && config.GOOGLE_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.GOOGLE_USER,
        pass: config.GOOGLE_APP_PASSWORD
      }
    });
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.GOOGLE_USER,
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      refreshToken: config.GOOGLE_REFRESH_TOKEN
    }
  });
}

const transporter = createTransporter();

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

const sendEmail = async ({ to, subject, text, html } = {}) => {
  try {
    if (!config.GOOGLE_USER) {
      throw new Error('GOOGLE_USER is not configured in environment variables');
    }

    if (!config.GOOGLE_APP_PASSWORD && (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET || !config.GOOGLE_REFRESH_TOKEN)) {
      throw new Error('Email auth is not configured. Set GOOGLE_APP_PASSWORD or OAuth2 values (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN).');
    }

    if (!to) {
      throw new Error('Email recipient (to) is required');
    }

    const info = await transporter.sendMail({
      from: `"Your Name" <${config.GOOGLE_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


module.exports = {transporter, sendEmail};