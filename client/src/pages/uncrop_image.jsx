import { useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";

export default function Uncrop_image() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [processing, setProcessing] = useState(false);
    // Width/height = pixels to extend on each side (per API docs)
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const { user, setUser } = useContext(AuthContext);
    const fileInputRef = useRef(null);

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setErrorMsg("Please select a valid image file.");
            return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setImageUrl("");
        setErrorMsg("");
    };

    // Clear file and reset all state
    const handleClearFile = () => {
        setSelectedFile(null);
        setPreviewUrl("");
        setImageUrl("");
        setErrorMsg("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Open the hidden file dialog
    const triggerFileInput = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    // Send image + optional dimensions to the uncrop API endpoint
    const handleProcessImage = async () => {
        if (!selectedFile) return;

        // Validate dimension inputs if provided
        if ((width && isNaN(Number(width))) || (height && isNaN(Number(height)))) {
            setErrorMsg("Width and Height must be valid numbers.");
            return;
        }

        setProcessing(true);
        setErrorMsg("");
        setImageUrl("");

        try {
            const formData = new FormData();
            formData.append("image_file", selectedFile);
            // Only send dimensions if the user filled them in
            if (width) formData.append("width", width);
            if (height) formData.append("height", height);

            const response = await api.post("/image/uncrop", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                setImageUrl(response.data.imageUrl);
                // Sync credits with AuthContext
                if (response.data.credits !== undefined && user) {
                    setUser({ ...user, credits: response.data.credits });
                }
            } else {
                setErrorMsg(response.data.message || "Failed to uncrop image.");
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
        <div className="flex flex-col md:flex-row w-full h-full font-mono bg-zinc-50 overflow-hidden">

            {/* ── Left Column: Controls ── */}
            <div className="w-full md:w-80 lg:w-96 border-b-4 md:border-b-0 md:border-r-4 border-black bg-white p-6 flex flex-col justify-between h-full overflow-y-auto select-none">

                {/* Top: image upload + optional expand dimensions */}
                <div className="space-y-5">
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight border-b-4 border-black pb-2">
                        Uncrop Image
                    </h2>

                    {/* Hidden native file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {/* Upload zone or thumbnail preview */}
                    <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-wider text-zinc-700">
                            Source Image:
                        </label>

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
                                    {selectedFile.name}
                                </p>
                                <div className="border-2 border-black overflow-hidden bg-white max-h-36 flex items-center justify-center">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="max-w-full max-h-36 object-contain"
                                    />
                                </div>
                                <button
                                    onClick={handleClearFile}
                                    className="absolute top-2.5 right-2.5 bg-red-500 text-white border-2 border-black p-1 hover:bg-red-600 transition-all cursor-pointer"
                                    title="Remove file"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Optional expand dimensions — sent straight to API on process */}
                    <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-wider text-zinc-700">
                            Expand By (px) — Optional:
                        </label>
                        <p className="text-[10px] text-zinc-400 uppercase leading-relaxed">
                            Pixels added on each side. Leave blank to use the API default.
                        </p>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1">Width</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 200"
                                    value={width}
                                    min="0"
                                    max="2000"
                                    onChange={(e) => setWidth(e.target.value)}
                                    disabled={processing}
                                    className="w-full border-2 border-black px-2 py-1.5 text-sm font-mono focus:outline-none focus:bg-zinc-50 disabled:opacity-50"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1">Height</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 200"
                                    value={height}
                                    min="0"
                                    max="2000"
                                    onChange={(e) => setHeight(e.target.value)}
                                    disabled={processing}
                                    className="w-full border-2 border-black px-2 py-1.5 text-sm font-mono focus:outline-none focus:bg-zinc-50 disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom: cost badge + error + single process button */}
                <div className="space-y-4 mt-6">
                    <div className="border-2 border-black p-3 bg-zinc-50 text-xs font-black uppercase flex justify-between items-center">
                        <span>Cost:</span>
                        <span className="bg-black text-white px-2 py-0.5 text-[10px]">1 Credit</span>
                    </div>

                    {errorMsg && (
                        <div className="border-4 border-red-500 bg-red-50 text-red-600 font-bold p-3 text-xs uppercase">
                            ⚠️ {errorMsg}
                        </div>
                    )}

                    <button
                        onClick={handleProcessImage}
                        disabled={processing || !selectedFile}
                        className="w-full bg-black text-white border-4 border-black font-black uppercase py-3.5 hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                    >
                        {processing ? "PROCESSING..." : "UNCROP IMAGE ⚡"}
                    </button>
                </div>
            </div>

            {/* ── Right Column: Output Workspace ── */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 h-full bg-zinc-50 overflow-hidden">
                {imageUrl ? (
                    <div className="border-4 border-black bg-white p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-full max-h-full flex flex-col items-center justify-center">
                        <p className="text-xs font-black uppercase tracking-wider mb-2.5 text-zinc-500 self-start">
                            Output Result (Uncropped):
                        </p>
                        <div className="border-2 border-black bg-zinc-100 flex items-center justify-center overflow-hidden max-h-[60vh] max-w-full">
                            <img
                                src={imageUrl}
                                alt="Uncropped result"
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
                            Upload an image, optionally enter pixels to expand on each side, then hit Uncrop.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}