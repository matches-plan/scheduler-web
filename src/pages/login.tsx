import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth-provider';

export default function Login() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        // TODO: 실제 로그인 로직 구현
        const { ok, error } = await login(id, password);

        if (!ok && error) {
            setError(error);
        } else {
            router.push('/');
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md dark:bg-zinc-900"
            >
                <h1 className="mb-6 text-2xl font-bold text-center">로그인</h1>
                <div className="mb-4">
                    <label
                        className="block mb-1 text-sm font-medium"
                        htmlFor="email"
                    >
                        아이디
                    </label>
                    <input
                        id="email"
                        autoComplete="username"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label
                        className="block mb-1 text-sm font-medium"
                        htmlFor="password"
                    >
                        비밀번호
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && (
                    <div className="mb-4 text-sm text-destructive text-center">
                        {error}
                    </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? '로그인 중...' : '로그인'}
                </Button>
            </form>
        </div>
    );
}
