import { FindLogsDto, getLogs, Log, LogStatus } from '@/api/logs';
import { getJobs, Job } from '@/api/jobs';
import DashboardLayout from '@/components/dashboard-layout';
import LogTable from '@/components/log-table';
import { useAuth } from '@/lib/auth-provider';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Logs() {
    const { status } = useAuth();
    const router = useRouter();
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState<LogStatus | 'all'>('all');
    const [jobFilter, setJobFilter] = useState<number>(0);
    const [fromDate, setFromDate] = useState<string | undefined>(undefined);
    const [toDate, setToDate] = useState<string | undefined>(undefined);
    const [jobOptions, setJobOptions] = useState<
        { id: number; name: string }[]
    >([]);

    useEffect(() => {
        if (status === 'LOGGED_OUT') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (status !== 'LOGGED_IN') return;
        getJobs().then((result) => {
            if (result.ok) {
                setJobOptions(
                    result.jobs.map((j: Job) => ({ id: j.id, name: j.name }))
                );
            }
        });
    }, [status]);

    useEffect(() => {
        if (status !== 'LOGGED_IN') return;
        setLoading(true);
        const logFilter: Partial<FindLogsDto> = {};
        if (statusFilter !== 'all') {
            logFilter.status = statusFilter;
        }
        if (jobFilter !== 0) {
            logFilter.jobId = jobFilter;
        }
        if (fromDate) {
            logFilter.from = new Date(fromDate).toISOString();
        }
        if (toDate) {
            logFilter.to = new Date(toDate).toISOString();
        }

        getLogs({
            page,
            limit,
            ...logFilter,
        })
            .then((result) => {
                setLogs(result.items);
                setTotal(result.total);
                setError(null);
            })
            .catch((err) => {
                setError(err.message || '로그 목록을 불러오지 못했습니다.');
            })
            .finally(() => setLoading(false));
    }, [status, page, limit, statusFilter, jobFilter, fromDate, toDate]);

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold mb-4">Logs</h1>
            <LogTable
                logs={logs}
                loading={loading}
                error={error}
                page={page}
                total={total}
                limit={limit}
                onPageChange={setPage}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                jobOptions={jobOptions}
                jobFilter={jobFilter}
                onJobFilterChange={setJobFilter}
                fromDate={fromDate}
                toDate={toDate}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
            />
        </DashboardLayout>
    );
}
