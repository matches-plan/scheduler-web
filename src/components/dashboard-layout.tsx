import Navbar from '@/components/navbar';
import { useAuth } from '@/lib/auth-provider';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { status } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (status === 'LOGGED_OUT') {
            router.replace('/login');
        }
    }, [status, router]);

    if (status !== 'LOGGED_IN') {
        // 로딩 중이거나 로그아웃이면 아무것도 렌더링하지 않음 (AuthProvider가 로딩화면을 보여줌)
        return null;
    }
    return (
        <div className="min-h-screen bg-muted flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
