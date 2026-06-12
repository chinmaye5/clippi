import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

// This middleware protects routes. It checks if the user is logged in
// before allowing them to access the route.
export const protect = async (req, res, next) => {
    try {
        // 1. Get the token from cookies or authorization headers
        let token = "";

        // Check if token exists in cookies
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } 
        // If not in cookies, check if it's in the Authorization header (e.g. Bearer <token>)
        else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // 2. If no token is found, the user is not logged in
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Not authorized. Please login first." 
            });
        }

        // 3. Verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Find the user in the database using the ID from the token
        // We use .select("-password") so we don't fetch the password hash for safety
        const user = await userModel.findById(decoded.userId).select("-password");

        // 5. If user is not found, return an error
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found with this token." 
            });
        }

        // 6. Attach the user data to the request object (req.user)
        // This makes the user details available in the next function (controller)
        req.user = user;

        // 7. Go to the next middleware or controller function
        next();

    } catch (error) {
        console.error("Auth middleware error:", error.message);
        return res.status(401).json({ 
            success: false, 
            message: "Not authorized. Invalid or expired token." 
        });
    }
};
