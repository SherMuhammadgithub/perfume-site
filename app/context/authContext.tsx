'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const isAdmin = user?.role === 'admin';

    // Check if user is authenticated on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/auth/me');
            setUser(data.user);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.post('/api/auth/login', { email, password });
            setUser(data.user);
            return data.user; // Return the user object directly
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.post('/api/auth/register', { name, email, password });
            setUser(data.user);
            return data;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to register');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await axios.post('/api/auth/logout');
            setUser(null);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to logout');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            login,
            register,
            logout,
            checkAuth,
            isAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};