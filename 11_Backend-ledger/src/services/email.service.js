require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error setting up email transporter:', error);
    } else {
        console.log('NodeMailer | Email transporter is ready to send messages');
    }
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Backend Ledger" <${process.env.GOOGLE_EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });
        console.log('NodeMailer | Email sent successfully:', info.messageId);
        console.log('NodeMailer | Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('NodeMailer | Error sending email:', error);
    }
};

async function sendRegistrationEmail(userEmail, userName) {
    const subject = 'Welcome to Backend Ledger!';
    // email text
    const text = `Hi ${userName},\n\nThank you for registering with Backend Ledger! We're excited to have you on board.\n\nBest regards,\nThe Backend Ledger Team`;
    // email html
    const html = `<p>Hi ${userName},</p><p>Thank you for registering with <strong>Backend Ledger</strong>! We're excited to have you on board.</p><p>Best regards,<br>The Backend Ledger Team</p>`;
    // send the email
    await sendEmail(userEmail, subject, text, html);
}

module.exports = { sendRegistrationEmail };