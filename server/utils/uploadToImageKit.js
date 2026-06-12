/**
 * Uploads a base64 encoded image to ImageKit using their official REST upload API.
 * 
 * @param {string} base64 - The base64 encoded file data to upload.
 * @param {string} fileName - The filename to assign to the uploaded file.
 * @returns {Promise<string>} The public URL of the uploaded image.
 */
export const uploadToImageKit = async (base64, fileName) => {
    // ImageKit server-side upload requires Basic authentication: base64(privateKey + ":")
    const authHeader = "Basic " + Buffer.from(process.env.IMAGEKIT_PRIVATE_KEY + ":").toString("base64");

    const imageKitForm = new FormData();
    imageKitForm.append("file", base64);
    imageKitForm.append("fileName", fileName);

    console.log(`Uploading file ${fileName} to ImageKit...`);
    const imageKitResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        headers: {
            "Authorization": authHeader
        },
        body: imageKitForm
    });

    if (!imageKitResponse.ok) {
        const errorDetails = await imageKitResponse.text();
        console.error("ImageKit upload failed:", errorDetails);
        throw new Error(`ImageKit upload failed: ${errorDetails}`);
    }

    const imageKitData = await imageKitResponse.json();
    return imageKitData.url;
};
