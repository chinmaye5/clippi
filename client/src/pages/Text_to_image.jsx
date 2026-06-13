import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";

export default function TextToImage() {
    const [prompt, setPrompt] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [generating, setGenerating] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const resultRef = useRef(null);
    const { user, setUser } = useContext(AuthContext);

    // Create image from prompt
    const handleGenerateImage = async () => {
        if (!prompt.trim()) return;
        setGenerating(true);
        setErrorMsg("");
        setImageUrl(""); // Clear previous image

        try {
            const formData = new FormData();
            formData.append("prompt", prompt);

            const response = await api.post("/image/text-to-image", formData);
            
            if (response.data.success) {
                setImageUrl(response.data.imageUrl);
                // Update credits in context if returned
                if (response.data.credits !== undefined && user) {
                    setUser({ ...user, credits: response.data.credits });
                }
                // Scroll to result on mobile
                setTimeout(() => {
                    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                setErrorMsg(response.data.message || "Failed to generate image.");
            }
        } catch (error) {
            console.error(error);
            setErrorMsg(
                error.response?.data?.message || 
                "Something went wrong while generating the image."
            );
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full md:h-full font-mono bg-zinc-50 md:overflow-hidden">
            {/* Left Column: Prompt Box and Generation Controls */}
            <div className="w-full md:w-80 lg:w-96 border-b-4 md:border-b-0 md:border-r-4 border-black bg-white p-6 flex flex-col justify-between md:h-full md:overflow-y-auto select-none">
                <div className="space-y-6">
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight border-b-4 border-black pb-2">
                        Text-to-Image
                    </h2>

                    <div className="space-y-3">
                        <label className="block text-xs font-black uppercase tracking-wider text-zinc-700">
                            Enter Prompt:
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g. A vibrant cyberpunk alleyway with neon signs..."
                            disabled={generating}
                            className="w-full border-4 border-black p-3 font-mono text-sm focus:outline-none focus:bg-zinc-50 resize-none h-44 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="space-y-4 mt-6">
                    {/* Error Banner */}
                    {errorMsg && (
                        <div className="border-4 border-red-500 bg-red-50 text-red-600 font-bold p-3 text-xs uppercase">
                            ⚠️ {errorMsg}
                        </div>
                    )}

                    {/* Generator Button */}
                    <button
                        onClick={handleGenerateImage}
                        disabled={generating || !prompt.trim()}
                        className="w-full bg-black text-white border-4 border-black font-black uppercase py-3.5 hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                    >
                        {generating ? "GENERATING..." : "GENERATE IMAGE ⚡"}
                    </button>
                </div>
            </div>

            {/* Right Column: Image Preview Viewport */}
            <div ref={resultRef} className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 min-h-[50vh] md:h-full bg-zinc-50 md:overflow-hidden relative">
                {imageUrl ? (
                    <div className="border-4 border-black bg-white p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-full max-h-full flex flex-col items-center justify-center">
                        <p className="text-xs font-black uppercase tracking-wider mb-2.5 text-zinc-500 self-start">
                            Generated Output:
                        </p>
                        <div className="border-2 border-black bg-zinc-100 flex items-center justify-center overflow-hidden max-h-[60vh] max-w-full">
                            <img
                                src={imageUrl}
                                alt="Generated result"
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
                        <span className="text-5xl block mb-4">🎨</span>
                        <h3 className="text-base font-black uppercase tracking-tight mb-2">Workspace</h3>
                        <p className="text-xs text-zinc-500 uppercase leading-relaxed">
                            Your generated image will appear here. Enter a prompt on the left and hit generate.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}