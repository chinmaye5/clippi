import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
    try {
        // 1. If BREVO_API_KEY is configured, use Brevo HTTP API (perfect for Render Free Tier)
        if (process.env.BREVO_API_KEY) {
            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    sender: {
                        name: "Clippi Auth",
                        email: process.env.SENDER_EMAIL || process.env.EMAIL_USER
                    },
                    to: [{ email: options.to }],
                    subject: options.subject,
                    textContent: options.text,
                    htmlContent: options.html
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }

            console.log("📨 Email sent successfully via Brevo HTTP API! Message ID:", data.messageId);
            return data;
        }

        // 2. Fallback to standard Nodemailer SMTP (for local development or Render Paid Tier)
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            connectionTimeout: 15000,
            greetingTimeout: 15000,
            family: 4 // Force IPv4 to bypass potential IPv6 ENETUNREACH issues
        });

        const mailOptions = {
            from: `"Clippi Auth" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("📨 Email sent successfully via SMTP! ID:", info.messageId);
        return info;
    } catch (emailError) {
        console.error("❌ Error inside sendEmail:", emailError.message);
        throw emailError;
    }
};