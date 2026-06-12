import nodemailer from "nodemailer";

/**
 * Helper function to send an email using Gmail credentials.
 * It expects an object with: to, subject, and text (or html) content.
 */
export const sendEmail = async (options) => {
    // 1. Create a transporter object using your Gmail account details
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail address 
            pass: process.env.EMAIL_PASS  // Your Gmail App Password 
        }
    });

    // 2. Define the email options (sender, receiver, subject, content)
    const mailOptions = {
        from: `"Clippi Auth" <${process.env.EMAIL_USER}>`, // Sender address
        to: options.to,                                   // List of receivers (e.g. user's email)
        subject: options.subject,                         // Subject line
        text: options.text,                               // Plain text body
        html: options.html                                // HTML body (optional)
    };

    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
};
