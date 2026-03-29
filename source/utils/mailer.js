const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Gửi email sử dụng transport đã cấu hình
 * @param {Object} mailOptions Options cho việc gửi mail (to, from, subject, html, ...)
 * @returns {Promise} Trả về promise của việc gửi mail
 */
const sendMail = (mailOptions) => {
    return transporter.sendMail({
        from: `"TimeCapsule" <${process.env.EMAIL_USER}>`,
        ...mailOptions
    });
};

module.exports = {
    transporter,
    sendMail
};
