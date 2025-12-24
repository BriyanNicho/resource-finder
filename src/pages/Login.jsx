
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield, User, GraduationCap, LogIn } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e, demoEmail, demoPassword) => {
        if (e) e.preventDefault();
        setError('');
        setLoading(true);

        const loginEmail = demoEmail || email;
        const loginPassword = demoPassword || password;

        const result = await login(loginEmail, loginPassword);

        if (result.success) {
            const role = result.user?.role ||
                (loginEmail === 'admin@kampus.ac.id' ? 'admin' : 'student');
            navigate(role === 'admin' ? '/admin' : '/', { replace: true });
        } else {
            setError(result.error || 'Email atau password salah');
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <GraduationCap size={48} className="text-primary" />
                    </div>
                    <h1>Resource Finder</h1>
                    <p>Sistem Pemesanan Fasilitas Kampus</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    {error && <div className="login-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="nama@kampus.ac.id"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-login" disabled={loading}>
                        {loading ? 'Memproses...' : (
                            <>
                                <LogIn size={18} />
                                Masuk
                            </>
                        )}
                    </button>
                </form>


            </div>
        </div>
    );
}

export default Login;
