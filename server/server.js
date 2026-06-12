import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // Imports the cookie parsing middleware
import connectDb from "./config/db.js";
import authRoutes from "./routes/auth.routes.js"; // Imports our new auth routes
import imageRoutes from "./routes/image.routes.js"; // Imports background removal routes
import historyRoutes from "./routes/history.routes.js"; // Imports history routes
import cors from "cors";

dotenv.config();

const app = express();

//cors configuration

app.use(cors({
    origin: process.env.FRONTEND_URL || "https://clippitools.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware 1: Parses incoming requests with JSON payloads (so we can read req.body)
app.use(express.json());

// Middleware 2: Parses incoming cookies from the browser (so we can read req.cookies)
app.use(cookieParser());

// Database connection
await connectDb();

// Test Route to check if server is running
app.get("/", (req, res) => {
    res.json({
        "message": "running"
    });
});

// Authentication Routes
app.use("/api/auth", authRoutes);

// Image / Background Removal Routes
app.use("/api/image", imageRoutes);

// History Routes
app.use("/api/history", historyRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Server running at : ", PORT);
});
