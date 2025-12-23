import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If Supabase is not configured, check localStorage for mock auth
        if (!isSupabaseConfigured()) {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
            setLoading(false);
            return;
        }

        // Get initial session from Supabase
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchUserProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event);

                if (session) {
                    await fetchUserProfile(session.user.id);
                } else {
                    setUser(null);
                    setLoading(false);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchUserProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            setUser({
                id: userId,
                email: data.email,
                name: data.name,
                role: data.role,
                nim: data.nim,
                major: data.major,
            });
        } catch (err) {
            console.error('Error fetching user profile:', err);
            // Fallback to basic user info
            const { data: { user: authUser } } = await supabase.auth.getUser();
            setUser({
                id: authUser.id,
                email: authUser.email,
                name: authUser.email.split('@')[0],
                role: 'student',
            });
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        // If Supabase is not configured, use mock login
        if (!isSupabaseConfigured()) {
            let userData = null;

            if (email === 'admin@kampus.ac.id' && password === 'admin123') {
                userData = { email, role: 'admin', name: 'Admin User' };
            } else if (email === 'mahasiswa@kampus.ac.id' && password === 'mhs123') {
                userData = { email, role: 'student', name: 'Mahasiswa' };
            } else if (email.includes('@') && password.length >= 3) {
                userData = { email, role: 'student', name: email.split('@')[0] };
            }

            if (userData) {
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true, user: userData };
            }
            return { success: false, error: 'Invalid credentials' };
        }

        // Supabase login
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            return { success: true, user: data.user };
        } catch (err) {
            console.error('Login error:', err);
            return { success: false, error: err.message };
        }
    };

    const signup = async (email, password, userData) => {
        if (!isSupabaseConfigured()) {
            return { success: false, error: 'Supabase not configured' };
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            // Create profile
            if (data.user) {
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    email,
                    name: userData.name,
                    role: userData.role || 'student',
                    nim: userData.nim,
                    major: userData.major,
                });
            }

            return { success: true, user: data.user };
        } catch (err) {
            console.error('Signup error:', err);
            return { success: false, error: err.message };
        }
    };

    const logout = async () => {
        if (!isSupabaseConfigured()) {
            setUser(null);
            localStorage.removeItem('user');
            return;
        }

        await supabase.auth.signOut();
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
