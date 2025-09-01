export enum LogStatus {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export interface Log {
    id: number;
    jobId: number;
    status: LogStatus;
    httpStatus: number | null;
    message: string | null;
    createdAt: string;
}

export interface FindLogsDto {
    page?: number;
    limit?: number;
    status?: LogStatus;
    jobId?: number;
    from?: string;
    to?: string;
}

export interface FindLogsResponse {
    items: Log[];
    total: number;
    page: number;
    limit: number;
}

export async function getLogs(params?: FindLogsDto): Promise<FindLogsResponse> {
    try {
        const query = new URLSearchParams(
            params as Record<string, string>
        ).toString();
        const response = await fetch(
            `api/logs?${query}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        if (!response.ok) {
            const { message } = await response.json();
            throw new Error(message);
        }
        return await response.json();
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('Unknown error');
        }
    }
}
