import { useState, useEffect } from "react";
import api from "../api/api";
import { RefreshCw, ImageIcon } from "lucide-react";
import HistoryCard from "../components/HistoryCard";
import HistoryModal from "../components/HistoryModal";




export default function History() {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/history/get_history");
            setHistoryData(response.data.data || []);
        } catch (err) {
            console.error("Failed to fetch history:", err);
            setError("Failed to load history. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/history/delete_history_by_id/${id}`);
            setHistoryData((prev) => prev.filter((item) => item._id !== id));
        } catch (err) {
            console.error("Failed to delete history item:", err);
            alert("Failed to delete item.");
        }
    };

    return (
        <div className="bg-zinc-50 text-black w-full min-h-full p-4 sm:p-6 font-mono overflow-y-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-black">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                        History
                    </h2>
                    {!loading && historyData.length > 0 && (
                        <p className="text-xs text-zinc-500 font-black uppercase mt-0.5">
                            {historyData.length} {historyData.length === 1 ? "entry" : "entries"}
                        </p>
                    )}
                </div>
                <button
                    onClick={fetchHistory}
                    disabled={loading}
                    className="flex items-center gap-2 border-2 border-black px-3 py-2 text-xs font-black uppercase hover:bg-black hover:text-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 cursor-pointer"
                >
                    <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* States: loading / error / empty / grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                    <RefreshCw size={36} className="animate-spin mb-4" />
                    <p className="text-sm font-black uppercase">Loading history...</p>
                </div>

            ) : error ? (
                <div className="border-4 border-red-500 bg-red-50 text-red-600 font-bold p-4 text-sm uppercase flex items-center gap-2">
                    ⚠️ {error}
                </div>

            ) : historyData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="border-4 border-dashed border-zinc-400 p-10 text-center max-w-sm bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]">
                        <ImageIcon className="mx-auto mb-4 text-zinc-300" size={48} />
                        <h3 className="text-base font-black uppercase tracking-tight mb-2">No History Yet</h3>
                        <p className="text-xs text-zinc-500 uppercase leading-relaxed">
                            Your processed images and generated results will appear here after you use any feature.
                        </p>
                    </div>
                </div>

            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {historyData.map((item) => (
                        <HistoryCard
                            key={item._id}
                            item={item}
                            onClick={(selected) => setSelectedItem(selected)}
                        />
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedItem && (
                <HistoryModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}