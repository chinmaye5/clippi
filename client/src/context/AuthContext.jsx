import { createContext, useState, useEffect } from 'react';
import api from '../api/api';


export const AuthContext = createContext(null);


export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const checkUserLoggedIn = async () => {
        try {
            const response = await api.get('/auth/me');
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            alert('Logged out successfully!');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const valueToShare = {
        user: user,
        setUser: setUser,
        logout: logout,
        loading: loading
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-zinc-500 flex items-center justify-center text-sm font-mono">
                LOADING_CLIPPI_SESSION...
            </div>
        );
    }

    return (
        <AuthContext.Provider value={valueToShare}>
            {children}
        </AuthContext.Provider>
    );
}