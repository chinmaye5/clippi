import express from "express";
import { register, login, logout, getUser, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

// Create a new router instance from Express
const router = express.Router();

// Define authentication endpoints and map them to their controller functions

// 1. Endpoint: POST /api/auth/register -> Runs the register function
router.post("/register", register);

// 2. Endpoint: POST /api/auth/login -> Runs the login function
router.post("/login", login);

// 3. Endpoint: POST /api/auth/logout -> Runs the logout function
router.post("/logout", logout);

// 4. Endpoint: GET /api/auth/me -> Runs the 'protect' middleware first, 
// and then the 'getUser' function if the user is authorized.
router.get("/me", protect, getUser);

// 5. Endpoint: POST /api/auth/forgot-password -> Generates and sends OTP
router.post("/forgot-password", forgotPassword);

// 6. Endpoint: POST /api/auth/reset-password -> Verifies OTP and updates password
router.post("/reset-password", resetPassword);

// Export the router so it can be used in server.js
export default router;
