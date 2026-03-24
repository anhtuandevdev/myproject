const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email đã được đăng ký!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Đăng xuất thành công trên hệ thống!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng với email này!" });

        const token = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 600000;
        await user.save();

        const resetUrl = `http://localhost:3000/reset-password.html?token=${token}`;
        const mailOptions = {
            to: user.email,
            from: `"Cỗ Máy Thời Gian" <${process.env.EMAIL_USER}>`,
            subject: 'Khôi phục mật khẩu tài khoản',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Khôi phục mật khẩu</h2>
                    <p>Bạn nhận được email này vì bạn đã yêu cầu khôi phục mật khẩu cho tài khoản của mình.</p>
                    <p>Vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu (Liên kết có hiệu lực trong 10 phút):</p>
                    <a href="${resetUrl}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Đặt lại mật khẩu</a>
                    <p>Nếu bạn không yêu cầu điều này, hãy bỏ qua email này và mật khẩu của bạn sẽ không thay đổi.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Một email khôi phục đã được gửi đến ' + user.email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Mã khôi phục không hợp lệ hoặc đã hết hạn!" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: "🎉 Đặt lại mật khẩu thành công! Bây giờ bạn có thể đăng nhập." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};