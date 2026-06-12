import express from "express";
import multer from "multer";
import { removeBackground } from "../controllers/remove_background.controller.js";
import { remove_text } from "../controllers/remove_text.controller.js";
import { text_to_image } from "../controllers/text_to_image.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { image_upscaling } from "../controllers/Image_upscaling.controller.js";
import { replace_background } from "../controllers/replace_background.controller.js";
import { uncrop } from "../controllers/uncrop.controller.js";

// Initialize express router
const router = express.Router();

// Configure multer to store uploaded files in memory as standard Buffers.
// This prevents writing temporary files to disk, making it highly secure and efficient.
const storage = multer.memoryStorage();

// Clipdrop API supports: JPEG, PNG, WebP, BMP, TIFF
// This filter runs before any upload and rejects unsupported formats instantly.
const SUPPORTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"];

const fileFilter = (req, file, cb) => {
    if (SUPPORTED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        // Reject the file with a human-readable error message
        cb(new Error(`Unsupported image format: "${file.mimetype}". Please upload a JPEG, PNG, WebP, BMP, or TIFF image.`));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // Set 10MB limit as a safe default for images
    }
});

/**
 * Route: POST /api/image/remove-bg
 * Description: Remove background from an uploaded image file and save to ImageKit.
 * Middleware: 
 *   - protect: Authenticates user, verifies their session, and parses req.user.
 *   - upload.single("image_file"): Extracts a single file uploaded with key "image_file" in FormData.
 * Controller:
 *   - removeBackground: Integrates Clipdrop API, processes buffer, uploads to ImageKit, deducts user credit, and returns details.
 */
router.post("/remove-bg", protect, upload.single("image_file"), removeBackground);

router.post("/remove-text", protect, upload.single("image_file"), remove_text);

router.post("/text-to-image", protect, upload.none(), text_to_image);

router.post("/upscale-image", protect, upload.single("image_file"), image_upscaling);

router.post("/replace-background", protect, upload.single("image_file"), replace_background);

router.post("/uncrop", protect, upload.single("image_file"), uncrop);


export default router;
