const nodemailer = require('nodemailer');

const sendVerificationEmail = async (userEmail, otpCode) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // 587 par STARTTLS
            logger: true,
            debug: true,
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
            },
            connectionTimeout: 15000,
        });

        await transporter.verify();

        const info = await transporter.sendMail({
            from: `"Expensify App" <${process.env.EMAIL}>`,
            to: userEmail,
            subject: 'Verify Your Expensify Account',
            html: `<h3>Your Verification Code is: <b>${otpCode}</b></h3><p>Please enter this code in your profile to verify your email.</p>`,
        });

        console.log('Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error in sending email:', error.code, error.message);
        return false;
    }
};

module.exports = sendVerificationEmail;