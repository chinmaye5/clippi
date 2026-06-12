import userModel from "../models/user.model.js";
import historyModel from "../models/history.model.js";
import { uploadToImageKit } from "../utils/uploadToImageKit.js";

/**
 * Controller to handle background removal using Clipdrop API
 * and then upload the resulting transparent image to ImageKit.
 * 
 * Flow:
 * 1. Ensure a file was uploaded by the user.
 * 2. Check if the authenticated user has enough credits (requires at least 1).
 * 3. Upload the original image to ImageKit.
 * 4. Send the image to Clipdrop Background Removal API.
 * 5. Upload the processed transparent image to ImageKit.
 * 6. Deduct 1 credit from the user's account and save.
 * 7. Create a history log in MongoDB.
 * 8. Return the uploaded ImageKit image URL and the remaining credits to the client.
 */
export const removeBackground = async (req, res) => {
    try {
        // Step 1: Ensure an image file was uploaded by the client
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided. Please upload an image file under the field name 'image_file'."
            });
        }

        // Step 2: Check if the authenticated user has sufficient credits
        // req.user is populated by the auth middleware ('protect')
        const user = req.user;
        if (user.credits < 1) {
            return res.status(400).json({
                success: false,
                message: `Insufficient credits. You have ${user.credits} credit(s), but removing a background requires at least 1 credit.`
            });
        }

        console.log(`Starting background removal for user: ${user.email}. Current credits: ${user.credits}`);

        // Step 2A: Upload original image to ImageKit BEFORE sending to Clipdrop
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

        // Step 3: Prepare and send the image file to Clipdrop Background Removal API
        const clipdropForm = new FormData();

        // Convert the file buffer in memory to a Blob so we can send it in FormData
        const imageBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
        clipdropForm.append("image_file", imageBlob, req.file.originalname || "image.png");

        console.log("Sending image to Clipdrop API...");
        const clipdropResponse = await fetch("https://clipdrop-api.co/remove-background/v1", {
            method: "POST",
            headers: {
                "x-api-key": process.env.CLIPDROP_API_KEY
            },
            body: clipdropForm
        });

        // Handle failure of the Clipdrop API call
        if (!clipdropResponse.ok) {
            const errorText = await clipdropResponse.text();
            console.error("Clipdrop API failed:", errorText);
            return res.status(502).json({
                success: false,
                message: "Failed to remove background. Clipdrop API encountered an error.",
                details: errorText
            });
        }

        // Clipdrop returns the processed transparent image in binary form
        const imageBuffer = await clipdropResponse.arrayBuffer();
        console.log("Successfully received transparent image from Clipdrop.");

        // Step 4: Upload processed transparent image to ImageKit
        let imageKitData;
        try {
            const base64Image = Buffer.from(imageBuffer).toString("base64");
            const originalNameBase = req.file.originalname ? req.file.originalname.split(".")[0] : "image";
            const uniqueFileName = `no-bg-${Date.now()}-${originalNameBase}.png`;
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

        // Step 6: Deduct 1 credit from the user's account and save the user
        user.credits -= 1;
        await user.save();
        console.log(`Deducted 1 credit. Remaining credits for user ${user.email}: ${user.credits}`);

        // Step 6A: Create history entry
        await historyModel.create({
            user: user._id,
            operation: "remove-background",
            input_image: originalImageData.url,
            output_image: imageKitData.url,
        });

        // Step 7: Return success response with URL and updated credit count
        return res.status(200).json({
            success: true,
            message: "Background removed and uploaded successfully!",
            imageUrl: imageKitData.url,
            credits: user.credits,
        });

    } catch (error) {
        console.error("Error in removeBackground controller:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred while processing your request.",
            error: error.message
        });
    }
};

