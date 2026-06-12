import console from "node:console";
import userModel from "../models/user.model.js";
import historyModel from "../models/history.model.js";
import { uploadToImageKit } from "../utils/uploadToImageKit.js";

export const image_upscaling = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image provided"
            });
        }



        const user = req.user;
        if (user.credits < 1) {
            return res.status(400).json({
                success: false,
                message: `Insufficient credits. You have ${user.credits} credit(s), but upscaling image requires at least 1 credit.`
            });
        }

        console.log(`Starting image upscaling for user : ${user.email}. Current credits: ${user.credits}`);

        // Upload original image to ImageKit BEFORE sending to Clipdrop
        let originalImageData;
        try {
            const originalBase64 = req.file.buffer.toString("base64");
            const originalNameBase = req.file.originalname ? req.file.originalname.split(".")[0] : "image";
            const originalFileName = `original-${Date.now()}-${originalNameBase}.png`;
            const originalImageUrl = await uploadToImageKit(originalBase64, originalFileName);
            originalImageData = { url: originalImageUrl };
        } catch (uploadError) {
            console.error("Original ImageKit upload failed:", uploadError);
            return res.status(502).json({
                success: false,
                message: "Failed to upload original image to cloud storage (ImageKit).",
                details: uploadError.message
            });
        }

        const clipdropForm = new FormData();

        const imageBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
        clipdropForm.append("image_file", imageBlob, req.file.originalname || "image.png");

        clipdropForm.append("target_width", 1920);
        clipdropForm.append("target_height", 1080);

        console.log("Sending image to Clipdrop API...");

        const clipdropResponse = await fetch("https://clipdrop-api.co/image-upscaling/v1/upscale", {
            method: "POST",
            headers: {
                "x-api-key": process.env.CLIPDROP_API_KEY,
            },
            body: clipdropForm,
        });

        if (!clipdropResponse.ok) {
            const errorText = await clipdropResponse.text();
            console.error("Clipdrop API failed:", errorText);
            return res.status(502).json({
                success: false,
                message: "Failed to upscale image. Clipdrop API encountered an error.",
                details: errorText,
            });
        }

        console.log("Successfully received image from Clipdrop API");

        const imageBuffer = await clipdropResponse.arrayBuffer();

        // Upload processed upscaled image to ImageKit
        let imageKitData;
        try {
            const base64Image = Buffer.from(imageBuffer).toString("base64");
            const originalNameBase = req.file.originalname ? req.file.originalname.split(".")[0] : "image";
            const uniqueFileName = `upscaled-${Date.now()}-${originalNameBase}.png`;
            const outputImageUrl = await uploadToImageKit(base64Image, uniqueFileName);
            imageKitData = { url: outputImageUrl };
        } catch (uploadError) {
            console.error("Processed ImageKit upload failed:", uploadError);
            return res.status(502).json({
                success: false,
                message: "Image successfully processed, but failed to save to cloud storage (ImageKit).",
                details: uploadError.message
            });
        }

        // Deduct 1 credit from the user's account and save the user
        user.credits -= 1;
        await user.save();
        console.log(`Deducted 1 credit. Remaining credits for user ${user.email}: ${user.credits}`);

        // Create history entry in MongoDB
        await historyModel.create({
            user: user._id,
            operation: "upscale",
            input_image: originalImageData.url,
            output_image: imageKitData.url,
        });

        // Return success response with URL and updated credit count
        return res.status(200).json({
            success: true,
            message: "Image upscaled and uploaded successfully!",
            imageUrl: imageKitData.url,
            credits: user.credits,
        });

    } catch (error) {
        console.error("Error in image_upscaling controller:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred while processing your request.",
            error: error.message
        });
    }
};