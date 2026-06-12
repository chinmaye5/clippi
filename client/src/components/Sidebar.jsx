import { NavLink, useLocation } from 'react-router-dom';
import { Wand2, ImageIcon, History, LayoutDashboard, Trash2, Plus, ArrowUp10, Eraser } from 'lucide-react';

// All feature links in one place — used by both mobile and desktop nav
const NAV_LINKS = [
    { to: '/dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { to: '/text-to-image', label: 'TEXT TO IMAGE', icon: Wand2 },
    { to: '/remove-background', label: 'REMOVE BG', icon: ImageIcon },
    { to: '/replace-background', label: 'REPLACE BACKGROUND', icon: Eraser },
    { to: '/remove-text', label: 'REMOVE TEXT', icon: Trash2 },
    { to: '/upscale', label: 'UPSCALE', icon: Plus },
    { to: '/uncrop', label: 'UNCROP', icon: ArrowUp10 },
    { to: '/history', label: 'HISTORY', icon: History },
];

// Shared active/inactive class logic
const linkClass = (isActive) =>
    `border-2 border-black flex items-center gap-3 transition-all
     shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
     active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
     ${isActive
        ? 'bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]'
        : 'bg-white text-black hover:bg-zinc-100'}`;

export default function Sidebar() {
    return (
        <>
            {/* ── Desktop Left Sidebar (hidden on mobile) ── */}
            <aside className="hidden sm:flex w-56 lg:w-64 border-r-4 border-black bg-white flex-col text-sm font-bold h-full select-none flex-shrink-0">
                <div className="p-4 border-b-4 border-black uppercase tracking-wider text-xs font-black bg-zinc-50">
                    Menu
                </div>
                <nav className="flex-1 flex flex-col p-3 space-y-2.5 overflow-y-auto">
                    {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) => `p-3 ${linkClass(isActive)}`}
                        >
                            <Icon size={17} strokeWidth={2.5} />
                            <span className="text-xs">{label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* ── Mobile Bottom Tab Bar (hidden on sm and above) ── */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-black flex h-16 font-mono">
                {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex-1 flex flex-col items-center justify-center gap-0.5 text-[9px] font-black uppercase tracking-tight transition-all border-r-2 last:border-r-0 border-black
                             ${isActive ? 'bg-black text-white' : 'bg-white text-zinc-600 hover:bg-zinc-100'}`
                        }
                    >
                        <Icon size={18} strokeWidth={2.5} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </>
    );
}
