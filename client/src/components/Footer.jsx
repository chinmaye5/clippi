import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full bg-white border-t-4 border-black font-mono">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* Brand */}
                <div className="text-center md:text-left">
                    <Link to="/" className="text-2xl font-black uppercase tracking-tight hover:underline">
                        Clippi
                    </Link>
                    <p className="text-xs font-bold text-zinc-500 uppercase mt-2">
                        AI Image toolkit for creators.
                    </p>
                </div>

                {/* Links */}
                <div className="flex gap-6 text-sm font-black uppercase tracking-tight">
                    <Link to="/login" className="hover:text-violet-600 transition-colors">Login</Link>
                    <Link to="/dashboard" className="hover:text-cyan-600 transition-colors">Tools</Link>
                    <a href="https://github.com/chinmaye5" target="_blank" rel="noopener noreferrer" className="hover:text-fuchsia-600 transition-colors">
                        Github
                    </a>
                </div>
            </div>
            
            {/* Copyright bar */}
            <div className="w-full bg-black text-white text-[10px] font-black uppercase tracking-widest py-3 text-center">
                © {new Date().getFullYear()} Clippi. All rights reserved.
            </div>
        </footer>
    );
}
