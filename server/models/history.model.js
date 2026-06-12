import mongoose from "mongoose";

const historySchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    operation: {
        type: String,
        required: true,
        enum: ["text-to-image", "remove-text", "upscale", "remove-background", "replace-background", "uncrop"],
    },

    prompt: {
        type: String
    },

    input_image: {
        type: String
    },

    output_image: {
        type: String,
        required: true
    },

}, { timestamps: true })

const historyModel = mongoose.model("History", historySchema);

export default historyModel;