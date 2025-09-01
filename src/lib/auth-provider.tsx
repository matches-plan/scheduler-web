import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import { login as loginApi, me as meApi, User } from '@/api/users';

interface AuthContextType {
    user: User | null;
    status: 'PENDING' | 'LOGGED_IN' | 'LOGGED_OUT';
    login: (
        id: string,
        password: string
    ) => Promise<{ ok: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token =
            typeof window !== 'undefined'
                ? localStorage.getItem('token')
                : null;
        if (token) {
            meApi().then(({ ok, user }) => {
                if (ok) {
                    setUser(user);
                } else {
                    setUser(null);
                }
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (id: string, password: string) => {
        const { ok, token, error } = await loginApi(id, password);
        if (ok && token) {
            localStorage.setItem('token', token);
            // 로그인 후 사용자 정보 갱신
            const meRes = await meApi();
            if (meRes.ok) {
                setUser(meRes.user);
            }
        } else {
            setUser(null);
        }
        return { ok, error };
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const status: 'PENDING' | 'LOGGED_IN' | 'LOGGED_OUT' = isLoading
        ? 'PENDING'
        : user
        ? 'LOGGED_IN'
        : 'LOGGED_OUT';

    return (
        <AuthContext.Provider value={{ user, status, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth는 AuthProvider 내에서 사용해야 합니다.');
    }
    return context;
}
