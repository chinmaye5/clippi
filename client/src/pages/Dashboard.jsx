import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Features from '../components/Features';

export default function Dashboard() {
    const { user } = useContext(AuthContext);

    return (
        <div className="bg-zinc-50 text-black w-full min-h-full flex flex-col p-4 sm:p-8 font-mono overflow-y-auto">
            
            {/* Top Bar: User Info & Credits */}
            <div className="border-4 border-black bg-white p-4 sm:p-6 mb-6 w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight">
                        Dashboard
                    </h2>
                    {user ? (
                        <p className="text-xs font-bold mt-0.5 text-zinc-600 truncate">
                            WELCOME BACK, <span className="text-black underline uppercase">{user.name}</span>
                        </p>
                    ) : (
                        <p className="text-xs text-zinc-500 font-bold uppercase mt-0.5">Guest Session</p>
                    )}
                </div>

                {user && (
                    <div className="border-4 border-black bg-zinc-50 px-4 py-2 flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Credits</p>
                            <p className="text-2xl font-black leading-none">{user.credits}</p>
                        </div>
                        <span className="text-3xl">🪙</span>
                    </div>
                )}
            </div>

            {/* Features Grid Component */}
            <div className="mb-8">
                <Features />
            </div>

        </div>
    );
}