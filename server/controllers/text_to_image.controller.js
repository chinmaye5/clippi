import userModel from "../models/user.model.js";
import historyModel from "../models/history.model.js";
import { uploadToImageKit } from "../utils/uploadToImageKit.js";

export const text_to_image = async (req, res) => {
    try {
        const prompt = req.body.prompt;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "No prompt provided."
            })
        }

        const user = req.user;
        if (user.credits < 1) {
            return res.status(400).json({
                success: false,
                message: `Insufficient credits. You have ${user.credits} credit(s), but image generation requires at least 1 credit.`
            });
        }

        const clipdropForm = new FormData();

        clipdropForm.append("prompt", prompt);

        console.log("sending prompt to clipdrop api");

        const clipdropResponse = await fetch("https://clipdrop-api.co/text-to-image/v1", {
            method: "POST",
            headers: {
                "x-api-key": process.env.CLIPDROP_API_KEY
            },
            body: clipdropForm
        });

        if (!clipdropResponse.ok) {
            const errorDetails = await clipdropResponse.text();
            console.log("Clipdrop API failed:", errorDetails);
            return res.status(502).json({
                success: false,
                message: "Failed to generate image. Clipdrop API encountered an error.",
                details: errorDetails
            })
        }

        const imageBuffer = await clipdropResponse.arrayBuffer();

        console.log("Successfully received image from Clipdrop.");

        let imageKitData;
        try {
            const base64Image = Buffer.from(imageBuffer).toString("base64");
            const uniqueFileName = `text-to-image-${Date.now()}.png`;
            const outputImageUrl = await uploadToImageKit(base64Image, uniqueFileName);
            imageKitData = { url: outputImageUrl };
        } catch (uploadError) {
            console.error("ImageKit upload failed:", uploadError);
            return res.status(502).json({
                success: false,
                message: "Image successfully generated, but failed to save to cloud storage (ImageKit).",
                details: uploadError.message
            });
        }

        user.credits -= 1;
        await user.save();
        console.log(`Deducted 1 credit. Remaining credits for user ${user.email}: ${user.credits}`);

        // Create history entry in MongoDB
        await historyModel.create({
            user: user._id,
            operation: "text-to-image",
            prompt: prompt,
            output_image: imageKitData.url,
        });

        return res.status(200).json({
            success: true,
            message: "Image generated and uploaded successfully!",
            imageUrl: imageKitData.url,
            credits: user.credits,
        });

    } catch (error) {
        console.error("Error in textToImage controller:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred while processing your request.",
            error: error.message
        });
    }
}