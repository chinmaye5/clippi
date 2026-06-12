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


export default function HistoryModal({ item, onClose, onDelete }) {
    if (!item) return null;

    const meta = OPERATION_META[item.operation] || { label: item.operation, color: "bg-zinc-600" };
    const date = new Date(item.createdAt).toLocaleString(undefined, {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm font-mono">
            {/* Modal Container */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-4xl max-h-full flex flex-col relative animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b-4 border-black bg-zinc-50">
                    <div className="flex items-center gap-3">
                        <span className={`text-white text-xs font-black uppercase tracking-widest px-2 py-1 border-2 border-black ${meta.color}`}>
                            {meta.label}
                        </span>
                        <span className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-1">
                            <Clock size={12} />
                            {date}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                onDelete(item._id);
                                onClose();
                            }}
                            className="text-zinc-500 hover:text-white hover:bg-red-500 border-2 border-transparent hover:border-black p-1 transition-all cursor-pointer"
                            title="Delete entry"
                        >
                            <Trash2 size={16} />
                        </button>
                        <button
                            onClick={onClose}
                            className="text-black hover:bg-black hover:text-white border-2 border-transparent hover:border-black p-1 transition-all cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-50 space-y-6">

                    {/* Images Section */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Input Image */}
                        {item.input_image && (
                            <div className="flex-1 border-4 border-black bg-white flex flex-col">
                                <div className="bg-zinc-100 px-3 py-2 text-[10px] font-black uppercase tracking-widest border-b-4 border-black text-zinc-600">
                                    Source Input
                                </div>
                                <div className="flex-1 p-4 flex items-center justify-center relative checkerboard-bg">
                                    <img
                                        src={item.input_image}
                                        alt="Input"
                                        className="max-w-full max-h-[40vh] object-contain border-2 border-zinc-200"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Output Image */}
                        {item.output_image && (
                            <div className="flex-1 border-4 border-black bg-white flex flex-col">
                                <div className="bg-black px-3 py-2 text-[10px] font-black uppercase tracking-widest border-b-4 border-black text-white flex justify-between items-center">
                                    <span>Result Output</span>
                                    <a
                                        href={item.output_image}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline flex items-center gap-1"
                                    >
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                                <div className="flex-1 p-4 flex items-center justify-center relative checkerboard-bg">
                                    <img
                                        src={item.output_image}
                                        alt="Output"
                                        className="max-w-full max-h-[40vh] object-contain border-2 border-zinc-200"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Metadata Section */}
                    <div className="border-4 border-black bg-white p-4">
                        <h3 className="text-xs font-black uppercase tracking-wider border-b-2 border-black pb-2 mb-3">
                            Details
                        </h3>

                        <div className="space-y-3 text-sm">
                            {item.prompt && (
                                <div>
                                    <span className="block text-[10px] font-black uppercase text-zinc-500 mb-1">Prompt</span>
                                    <p className="bg-zinc-100 p-3 border-2 border-black italic">
                                        "{item.prompt}"
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-[10px] font-black uppercase text-zinc-500 mb-1">ID</span>
                                    <p className="font-mono text-xs truncate" title={item._id}>{item._id}</p>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-black uppercase text-zinc-500 mb-1">Status</span>
                                    <p className="font-black uppercase text-green-600">Completed</p>
                                </div>
                            </div>

                            {/* Raw Data Toggle could go here if needed */}
                        </div>
                    </div>

                </div>
            </div>

            {/* Styles for the transparent background checkerboard */}
            <style jsx>{`
                .checkerboard-bg {
                    background-image: 
                        linear-gradient(45deg, #f4f4f5 25%, transparent 25%), 
                        linear-gradient(-45deg, #f4f4f5 25%, transparent 25%), 
                        linear-gradient(45deg, transparent 75%, #f4f4f5 75%), 
                        linear-gradient(-45deg, transparent 75%, #f4f4f5 75%);
                    background-size: 20px 20px;
                    background-position: 0 0, 0 10px, 10px -10px, -10px 0;
                }
            `}</style>
        </div>
    );
}
