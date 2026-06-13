import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

export default function Login() {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            setUser(response.data.user);
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        // p-4 on mobile, more breathing room on sm+ screens
        <div className="bg-white text-black w-full min-h-[calc(100vh-69px)] flex items-center justify-center p-4 sm:p-8 font-mono">
            {/* Card: full width on mobile, capped at sm on larger screens */}
            <div className="border-4 border-black bg-white p-6 sm:p-8 w-full max-w-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-2">Welcome Back</h2>
                <p className="text-xs sm:text-sm text-zinc-600 mb-6">Enter your details to access your dashboard.</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border-2 border-black text-black text-xs font-bold">
                        ERROR: {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border-2 border-black p-2.5 text-sm text-black focus:outline-none focus:bg-zinc-50"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border-2 border-black p-2.5 text-sm text-black focus:outline-none focus:bg-zinc-50"
                            placeholder="••••••••"
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white hover:bg-white hover:text-black border-2 border-black font-black text-sm py-3 transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                    >
                        {loading ? 'CONNECTING...' : 'SIGN IN'}
                    </button>
                </form>

                <p className="text-xs text-center text-zinc-600 mt-6 font-bold">
                    Don't have an account? <Link to="/register" className="underline hover:text-zinc-500">Sign up</Link>
                </p>
                <p className="text-xs text-center text-zinc-600 mt-2 font-bold">
                    Forgot Password? <Link to="/forgot-password" className="underline hover:text-zinc-500">click here</Link>
                </p>
            </div>
        </div>
    );
}