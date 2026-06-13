import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { sendEmail } from "../config/email.js";

/**
 * 1. REGISTER (Sign Up a new user)
 * This function handles creating a new user account in our database.
 */
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Step 1: Validate input (check if all required fields are filled)
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: name, email, and password."
            });
        }

        // Step 2: Check if user already exists with this email
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "A user with this email already exists."
            });
        }

        // Step 3: Hash (encrypt) the password so it's safe in the database
        // Salt is a random string added to the password to make the hashing stronger
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Step 4: Create a new user in the database with the hashed password
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword // Save the hashed password, NOT the plain text one!
        });

        await newUser.save();

        // Step 5: Generate a JWT (JSON Web Token) to keep the user logged in
        // We embed the user's unique ID inside the token
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // Token is valid for 7 days
        );

        // Step 6: Send the token to the browser inside a secure HTTP-Only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days, for example
        });

        // Step 7: Send a success response back to the client
        // We do NOT send the password back to the user
        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                credits: newUser.credits
            }
        });

    } catch (error) {
        console.error("Register error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong during registration. Please try again."
        });
    }
};

/**
 * 2. LOGIN (Sign In an existing user)
 * This function authenticates a user using their email and password.
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Step 1: Validate input (check if email and password are provided)
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password."
            });
        }

        // Step 2: Search for the user in the database by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password." // Keep error generic for security reasons
            });
        }

        // Step 3: Compare the incoming password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Step 4: Generate a new JWT token for this login session
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Step 5: Send the token in a secure cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Step 6: Return user details and token in response
        return res.status(200).json({
            success: true,
            message: "Logged in successfully!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                credits: user.credits
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong during login. Please try again."
        });
    }
};

/**
 * 3. LOGOUT (Sign Out a user)
 * This function clears the cookie storing the JWT, logging the user out.
 */
export const logout = async (req, res) => {
    try {
        // Clear the token cookie by setting its value to empty and making it expire immediately
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0) // Set expiration date in the past to delete the cookie
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully!"
        });
    } catch (error) {
        console.error("Logout error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong during logout."
        });
    }
};

/**
 * 4. GET USER PROFILE (Retrieve authenticated user's details)
 * This is a protected route. The auth middleware runs before this and attaches 
 * the verified user to req.user.
 */
export const getUser = async (req, res) => {
    try {
        // Simply return the user data that our auth middleware stored in req.user
        return res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.error("Get user error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve user details."
        });
    }
};

/**
 * 5. FORGOT PASSWORD (Send a 6-digit OTP code to user's email)
 */

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide an email address."
            });
        }

        // 1. Generate the random 6-digit OTP string
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Atomically update the OTP fields in the DB (Bypasses .save() validation issues)
        const updatedUser = await userModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    resetOtp: otp,
                    resetOtpExpire: new Date(Date.now() + 10 * 60 * 1000)
                }
            },
            { new: true } // Returns the updated document with user.name populated
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email address."
            });
        }

        // 3. Define the email layout with updatedUser details
        const emailOptions = {
            to: updatedUser.email,
            subject: "Your Clippi Password Reset OTP",
            text: `Hello ${updatedUser.name},\n\nYou requested a password reset. Use this 6-digit OTP to reset your password: ${otp}.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px; max-width: 600px;">
                    <h2 style="color: #4A90E2;">Password Reset Request</h2>
                    <p>Hello <strong>${updatedUser.name}</strong>,</p>
                    <p>You requested a password reset. Please use the following 6-digit One-Time Password (OTP) to reset your password:</p>
                    <div style="background-color: #f5f5f5; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center; padding: 15px; margin: 20px 0; color: #333; border-radius: 4px;">
                        ${otp}
                    </div>
                    <p style="color: #666; font-size: 14px;">This OTP is valid for <strong>10 minutes</strong>.</p>
                </div>
            `
        };

        // 4. Fire off the email trigger
        await sendEmail(emailOptions);

        return res.status(200).json({
            success: true,
            message: "A 6-digit password reset OTP has been sent to your email."
        });

    } catch (error) {
        console.error("Forgot password controller crash:", error.message);
        return res.status(500).json({
            success: false,
            message: `Failed to send password reset email: ${error.message}`
        });
    }
};

/**
 * 6. RESET PASSWORD (Verify OTP and save new password)
 */
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Step 1: Validate input (check if all required fields are provided)
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide email, otp, and the newPassword."
            });
        }

        // Step 2: Find the user in the database
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found with this email address."
            });
        }

        // Step 3: Check if the OTP is set and matches
        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP code. Please check your email and try again."
            });
        }

        // Step 4: Check if the OTP has expired
        // We compare the expiration date with the current date/time
        if (user.resetOtpExpire && user.resetOtpExpire < new Date()) {
            return res.status(400).json({
                success: false,
                message: "This OTP has expired. Please request a new one."
            });
        }

        // Step 5: Hash (encrypt) the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Step 6: Update user details and clear the OTP fields
        // Clearing OTP fields prevents the same OTP from being used again!
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpire = null;

        // Save the updated user document
        await user.save();

        // Step 7: Return success response
        return res.status(200).json({
            success: true,
            message: "Your password has been successfully reset! You can now log in with your new password."
        });

    } catch (error) {
        console.error("Reset password error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting your password. Please try again."
        });
    }
};
