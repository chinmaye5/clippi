import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CircleUser } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    // Controls whether the mobile menu drawer is open or closed
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-white text-black border-b-4 border-black font-mono">

            {/* ── Top Bar (always visible) ── */}
            <div className="px-4 sm:px-6 py-3 flex justify-between items-center">

                {/* Brand Logo */}
                <Link
                    to="/"
                    className="text-lg sm:text-xl font-black tracking-tight border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-all"
                >
                    CLIPPI.
                </Link>

                {/* Desktop nav — hidden on mobile */}
                <div className="hidden sm:flex space-x-4 text-sm font-bold items-center">
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                    <a href='/#tools' className="hover:underline">tools</a>
                    <a href='/#steps' className="hover:underline">steps</a>

                    {user ? (
                        <>
                            <span className="border-2 border-black px-2.5 py-1 bg-white text-xs">
                                CREDITS: {user.credits}
                            </span>
                            <span className="border-2 border-black px-2.5 py-1 bg-zinc-100 text-xs truncate max-w-[120px] flex items-center gap-1.5">
                                <CircleUser />
                                {user.name}
                            </span>
                            <button
                                onClick={logout}
                                className="border-2 border-black px-3 py-1 bg-black text-white hover:bg-white hover:text-black transition-all text-xs font-bold cursor-pointer"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:underline">Login</Link>
                            <Link to="/register" className="border-2 border-black px-3 py-1 bg-black text-white hover:bg-white hover:text-black transition-all text-xs font-bold">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Hamburger button — visible only on mobile */}
                <button
                    className="sm:hidden border-2 border-black p-2 font-black text-sm hover:bg-black hover:text-white transition-all"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* ── Mobile Drawer (drops down when menuOpen is true) ── */}
            {menuOpen && (
                <div className="sm:hidden border-t-4 border-black flex flex-col text-sm font-bold">
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="px-4 py-3 border-b-2 border-black hover:bg-zinc-100">Dashboard</Link>
                    <Link to="/history" onClick={() => setMenuOpen(false)} className="px-4 py-3 border-b-2 border-black hover:bg-zinc-100">History</Link>

                    {user ? (
                        <>
                            <div className="px-4 py-3 border-b-2 border-black text-xs">CREDITS: {user.credits}</div>
                            <div className="px-4 py-3 border-b-2 border-black text-xs bg-zinc-50">{user.name}</div>
                            <button
                                onClick={() => { logout(); setMenuOpen(false); }}
                                className="px-4 py-3 text-left bg-black text-white hover:bg-zinc-800 text-xs font-bold"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-3 border-b-2 border-black hover:bg-zinc-100">Login</Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)} className="px-4 py-3 bg-black text-white hover:bg-zinc-800 text-xs font-bold">Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}