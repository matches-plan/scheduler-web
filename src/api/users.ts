export interface User {
    id: string;
    name: string;
    createdAt: string;
}

export async function login(id: string, password: string) {
    try {
        const response = await fetch(
            `api/users/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, password }),
            }
        );
        if (!response.ok) {
            const { message } = await response.json();
            return {
                ok: false,
                error: message || 'Login failed',
            };
        }
        const { token } = await response.json();
        return {
            ok: true,
            token,
        };
    } catch (error: unknown) {
        console.error('Login failed:', error);
        return {
            ok: false,
            error: (error as Error).message || 'Unknown error',
        };
    }
}

export async function me() {
    try {
        const response = await fetch(
            `api/users/me`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        if (!response.ok) {
            const { message } = await response.json();
            return {
                ok: false,
                error: message || 'Fetch user failed',
                user: null,
            };
        }
        const user = await response.json();
        return {
            ok: true,
            user: {
                id: user.id,
                name: user.name,
                createdAt: user.createdAt,
            },
        };
    } catch (error: unknown) {
        console.error('Fetch user failed:', error);
        return {
            ok: false,
            error: (error as Error).message || 'Unknown error',
            user: null,
        };
    }
}
