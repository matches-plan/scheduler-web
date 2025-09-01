export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

export enum JobStatus {
    ACTIVE = 'ACTIVE',
    PAUSED = 'PAUSED',
}

export interface Job {
    id: number;
    project: string;
    name: string;
    description: string | null;
    cron: string;
    url: string;
    method: HttpMethod;
    xSecret: string | null;
    body: string | null;
    status: JobStatus;
    createdAt: string;
    updatedAt: string;
    lastRunAt: string | null;
    nextRunAt: string | null;
}

interface CreateJobDto {
    project: string;
    name: string;
    description?: string;
    cron: string;
    url: string;
    method: HttpMethod;
    xSecret?: string;
}

export async function getJobs() {
    try {
        const response = await fetch(
            `api/jobs`,
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
                error: message,
                jobs: [],
            };
        }
        const jobs = await response.json();
        return {
            ok: true,
            jobs,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                ok: false,
                error: error.message,
                jobs: [],
            };
        }
        return {
            ok: false,
            error: 'Failed to fetch jobs',
            jobs: [],
        };
    }
}

export async function createJob(createJobDto: CreateJobDto) {
    try {
        const response = await fetch(
            `api/jobs`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(createJobDto),
            }
        );
        if (!response.ok) {
            const { message } = await response.json();
            return {
                ok: false,
                error: message,
            };
        }
        const job = await response.json();
        return {
            ok: true,
            job,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                ok: false,
                error: error.message,
            };
        }
        return {
            ok: false,
            error: 'Failed to create job',
        };
    }
}

// export async function updateJob(jobId: number, updateJobDto: Partial<CreateJobDto>) {
//     try {
//         const response = await fetch(
//             `/jobs/${jobId}`,
//             {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 body: JSON.stringify(updateJobDto),
//             }
//         );
//         if (!response.ok) {
//             const { message } = await response.json();
//             return {
//                 ok: false,
//                 error: message,
//             };
//         }
//         const job = await response.json();
//         return {
//             ok: true,
//             job,
//         };
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             return {
//                 ok: false,
//                 error: error.message,
//             };
//         }
//         return {
//             ok: false,
//             error: 'Failed to update job',
//         };
//     }
// }

export async function deleteJob(jobId: number) {
    try {
        const response = await fetch(
            `api/jobs/${jobId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        if (!response.ok) {
            const { message } = await response.json();
            return {
                ok: false,
                error: message,
            };
        }
        return {
            ok: true,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                ok: false,
                error: error.message,
            };
        }
        return {
            ok: false,
            error: 'Failed to delete job',
        };
    }
}

export async function startJob(jobId: number) {
    try {
        const response = await fetch(
            `api/jobs/start/${jobId}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        if (!response.ok) {
            const { message } = await response.json();
            return {
                ok: false,
                error: message,
            };
        }
        return {
            ok: true,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                ok: false,
                error: error.message,
            };
        }
        return {
            ok: false,
            error: 'Failed to start job',
        };
    }
}

export async function pauseJob(jobId: number) {
    try {
        const response = await fetch(
            `api/jobs/pause/${jobId}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        if (!response.ok) {
            const { message } = await response.json();
            return {
                ok: false,
                error: message,
            };
        }
        return {
            ok: true,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                ok: false,
                error: error.message,
            };
        }
        return {
            ok: false,
            error: 'Failed to pause job',
        };
    }
}

export async function runJobNow(jobId: number) {
    try {
        const response = await fetch(
            `api/jobs/run/${jobId}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        if (!response.ok) {
            const { message } = await response.json();
            return {
                ok: false,
                error: message,
            };
        }
        return {
            ok: true,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                ok: false,
                error: error.message,
            };
        }
        return {
            ok: false,
            error: 'Failed to run job',
        };
    }
}
