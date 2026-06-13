import { useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";

export default function RemoveBackground() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [processing, setProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const { user, setUser } = useContext(AuthContext);
    const fileInputRef = useRef(null);
    const resultRef = useRef(null);

    // Checkerboard style to indicate transparency behind output images
    const checkeredStyle = {
        backgroundImage: `
            linear-gradient(45deg, #f4f4f5 25%, transparent 25%), 
            linear-gradient(-45deg, #f4f4f5 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #f4f4f5 75%), 
            linear-gradient(-45deg, transparent 75%, #f4f4f5 75%)
        `,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
        backgroundColor: "#ffffff"
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Verify that selected file is indeed an image
        if (!file.type.startsWith("image/")) {
            setErrorMsg("Please select a valid image file.");
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setImageUrl(""); // Clear any previous results
        setErrorMsg("");
    };

    // Clear file selection and reset layout states
    const handleClearFile = () => {
        setSelectedFile(null);
        setPreviewUrl("");
        setImageUrl("");
        setErrorMsg("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Trigger file dialog window
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Send image to background removal endpoint
    const handleProcessImage = async () => {
        if (!selectedFile) return;
        setProcessing(true);
        setErrorMsg("");
        setImageUrl("");

        try {
            const formData = new FormData();
            formData.append("image_file", selectedFile);

            const response = await api.post("/image/remove-bg", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                setImageUrl(response.data.imageUrl);
                // Deduct credits locally in AuthContext
                if (response.data.credits !== undefined && user) {
                    setUser({ ...user, credits: response.data.credits });
                }
                // Auto-scroll to result on mobile
                setTimeout(() => {
                    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                setErrorMsg(response.data.message || "Failed to remove background.");
            }
        } catch (error) {
            console.error(error);
            setErrorMsg(
                error.response?.data?.message ||
                "Something went wrong while processing the image."
            );
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full md:h-full font-mono bg-zinc-50 md:overflow-hidden">
            {/* Left Column: File Upload and Processing Controls */}
            <div className="w-full md:w-80 lg:w-96 border-b-4 md:border-b-0 md:border-r-4 border-black bg-white p-6 flex flex-col justify-between md:h-full md:overflow-y-auto select-none">
                <div className="space-y-6">
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight border-b-4 border-black pb-2">
                        Remove BG
                    </h2>

                    <div className="space-y-3">
                        <label className="block text-xs font-black uppercase tracking-wider text-zinc-700">
                            Upload Source Image:
                        </label>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />

                        {!selectedFile ? (
                            <div
                                onClick={triggerFileInput}
                                className="border-4 border-dashed border-zinc-400 p-8 text-center bg-zinc-50 hover:bg-zinc-100 transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <Upload className="mx-auto mb-3 text-zinc-500" size={32} />
                                <p className="text-xs font-black uppercase text-zinc-700">Choose Image File</p>
                                <p className="text-[10px] text-zinc-500 uppercase mt-1">PNG, JPG, WEBP</p>
                            </div>
                        ) : (
                            <div className="border-4 border-black p-4 bg-zinc-50 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <p className="text-[10px] font-black uppercase text-zinc-500 mb-2 truncate pr-6">
                                    File: {selectedFile.name}
                                </p>
                                <div className="border-2 border-black overflow-hidden bg-white max-h-44 flex items-center justify-center">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="max-w-full max-h-44 object-contain"
                                    />
                                </div>
                                <button
                                    onClick={handleClearFile}
                                    className="absolute top-2.5 right-2.5 bg-red-500 text-white border-2 border-black p-1 hover:bg-red-600 transition-all cursor-pointer"
                                    title="Remove Image"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4 mt-6">
                    {/* Cost indicator */}
                    <div className="border-2 border-black p-3 bg-zinc-50 text-xs font-black uppercase flex justify-between items-center">
                        <span>Cost:</span>
                        <span className="bg-black text-white px-2 py-0.5 text-[10px]">1 Credit</span>
                    </div>

                    {/* Error Banner */}
                    {errorMsg && (
                        <div className="border-4 border-red-500 bg-red-50 text-red-600 font-bold p-3 text-xs uppercase">
                            ⚠️ {errorMsg}
                        </div>
                    )}

                    {/* Process Button */}
                    <button
                        onClick={handleProcessImage}
                        disabled={processing || !selectedFile}
                        className="w-full bg-black text-white border-4 border-black font-black uppercase py-3.5 hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                    >
                        {processing ? "PROCESSING..." : "REMOVE BACKGROUND ⚡"}
                    </button>
                </div>
            </div>

            {/* Right Column: Dynamic Output Workspace */}
            <div ref={resultRef} className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 min-h-[50vh] md:h-full bg-zinc-50 md:overflow-hidden relative">
                {imageUrl ? (
                    <div className="border-4 border-black bg-white p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-full max-h-full flex flex-col items-center justify-center">
                        <p className="text-xs font-black uppercase tracking-wider mb-2.5 text-zinc-500 self-start">
                            Output Result (Transparent Background):
                        </p>
                        {/* Display checkered background behind png to highlight transparency */}
                        <div
                            style={checkeredStyle}
                            className="border-2 border-black flex items-center justify-center overflow-hidden max-h-[60vh] max-w-full"
                        >
                            <img
                                src={imageUrl}
                                alt="Background removed result"
                                className="max-w-full max-h-[60vh] object-contain"
                            />
                        </div>
                        <a
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-block w-full border-2 border-black py-2.5 text-xs font-black uppercase hover:bg-black hover:text-white transition-all text-center bg-white"
                        >
                            Open Original ↗
                        </a>
                    </div>
                ) : (
                    <div className="border-4 border-dashed border-zinc-400 p-10 sm:p-12 text-center max-w-md bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                        <ImageIcon className="mx-auto mb-4 text-zinc-400" size={48} />
                        <h3 className="text-base font-black uppercase tracking-tight mb-2">Workspace</h3>
                        <p className="text-xs text-zinc-500 uppercase leading-relaxed">
                            Upload a source image on the left, then click process. The transparent, background-removed result will show up here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}