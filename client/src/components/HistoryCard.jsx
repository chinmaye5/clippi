import { Trash2, ExternalLink, Clock, ImageIcon, RefreshCw, X, Download } from "lucide-react";

const OPERATION_META = {
    "bgremove": { label: "Remove Background", color: "bg-black" },
    "edit": { label: "Edit Image", color: "bg-yellow-500" },
    "restore": { label: "Restore Image", color: "bg-blue-600" },
    "upscale": { label: "Upscale Image", color: "bg-green-600" },
    "variations": { label: "Variations", color: "bg-pink-500" },
    "portrait": { label: "Portrait", color: "bg-orange-600" },
    "uncrop": { label: "Uncrop", color: "bg-purple-600" },
};


export default function HistoryCard({ item, onClick }) {
    const meta = OPERATION_META[item.operation] || { label: item.operation, color: "bg-zinc-600" };

    // Determine the primary image to display on the card (usually output)
    const displayImage = item.output_image || item.input_image;

    const date = new Date(item.createdAt).toLocaleDateString(undefined, {
        month: "short", day: "numeric"
    });

    const handleDownload = async (e) => {
        e.stopPropagation(); // Prevent opening the modal
        if (!displayImage) return;

        try {
            // Fetch the image as a blob to force a download (avoids opening in a new tab for cross-origin URLs)
            const response = await fetch(displayImage);
            if (!response.ok) throw new Error("Network response was not ok");
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `clippi-${item.operation}-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Clean up
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        } catch (error) {
            console.error("Failed to download image. Falling back to open in new tab.", error);
            // Fallback to opening in new tab if fetching fails (e.g., CORS issues)
            window.open(displayImage, "_blank");
        }
    };

    return (
        <div
            onClick={() => onClick(item)}
            className="border-4 border-black bg-white cursor-pointer group transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full"
        >
            {/* Top badge */}
            <div className={`p-1.5 border-b-4 border-black flex justify-between items-center ${meta.color}`}>
                <span className="text-white text-[9px] font-black uppercase tracking-widest px-1 truncate">
                    {meta.label}
                </span>
            </div>

            {/* Main Image */}
            <div className="w-full aspect-square bg-zinc-100 flex items-center justify-center overflow-hidden checkerboard-bg border-b-4 border-black relative">
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={meta.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <ImageIcon className="text-zinc-300" size={32} />
                )}

                {/* Overlay hover effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
            </div>

            {/* Bottom info bar */}
            <div className="p-2 flex justify-between items-center bg-zinc-50">
                <span className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-1">
                    <Clock size={10} />
                    {date}
                </span>

                <button
                    onClick={handleDownload}
                    className="p-1 border-2 border-transparent hover:border-black hover:bg-black hover:text-white text-zinc-500 transition-all"
                    title="Download Image"
                >
                    <Download size={12} strokeWidth={3} />
                </button>
            </div>
        </div>
    );
}