// src/components/DashboardLayout.jsx
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
    const { user, loading } = useContext(AuthContext);

    // Wait until the authentication check is complete
    if (loading) {
        return (
            <div className="h-full w-full bg-zinc-50 text-zinc-500 flex items-center justify-center text-sm font-mono">
                LOADING_SESSION...
            </div>
        );
    }

    // Redirect to login if user is not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        // On mobile: column layout, full scroll. On desktop: row layout, fixed height.
        <div className="flex flex-row flex-1 w-full h-full min-h-0 overflow-hidden">
            {/* Sidebar: left panel on desktop, bottom bar on mobile (rendered inside Sidebar) */}
            <Sidebar />

            {/* Page content: scrollable on mobile (with bottom padding for tab bar), fixed on desktop */}
            <div className="flex-1 overflow-y-auto bg-zinc-50 pb-16 sm:pb-0">
                <Outlet />
            </div>
        </div>
    );
}
