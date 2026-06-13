export const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            dns: {
                family: 4
            }
        });

        const mailOptions = {
            from: `"Clippi Auth" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("📨 Email sent successfully! ID:", info.messageId);
        return info;
    } catch (emailError) {
        console.error("❌ Nodemailer Error inside sendEmail:", emailError.message);
        throw emailError;
    }
};