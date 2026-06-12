import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    credits: {
        type: Number,
        default: 3
    },
    resetOtp: {
        type: String,
        default: ""
    },
    resetOtpExpire: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);

export default userModel;