import Link from 'next/link';
import { useAuth } from '@/lib/auth-provider';

export default function Navbar() {
    const { user, status, logout } = useAuth();

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white border-b dark:bg-zinc-900 dark:border-zinc-800">
            <div className="flex items-center gap-8">
                <Link href="/" className="text-lg font-bold">
                    SCHEDULER
                </Link>
                <Link
                    href="/logs"
                    className="text-sm text-muted-foreground hover:text-primary"
                >
                    로그
                </Link>
                {/* <Link
                    href="/users"
                    className="text-sm text-muted-foreground hover:text-primary"
                >
                    유저 관리
                </Link> */}
                {/* 필요시 추가 메뉴 */}
            </div>
            <div className="flex items-center gap-8">
                {status === 'LOGGED_IN' && user ? (
                    <>
                        <span className="text-sm">{user.name}</span>
                        <button
                            className="text-sm text-muted-foreground hover:text-destructive"
                            onClick={logout}
                        >
                            로그아웃
                        </button>
                    </>
                ) : (
                    <Link
                        href="/login"
                        className="text-sm text-primary hover:underline"
                    >
                        로그인
                    </Link>
                )}
            </div>
        </nav>
    );
}
