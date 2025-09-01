import { useEffect, useState } from 'react';
import { getJobs, Job } from '@/api/jobs';
import DashboardLayout from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-provider';
import { useRouter } from 'next/router';
import JobTable from '@/components/job-table';
import CreateJobDialog from '@/components/create-job-dialog';

export default function Home() {
    const { status } = useAuth();
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    function onActionDone() {
        setLoading(true);
        getJobs().then((result) => {
            if (result.ok) {
                setJobs(result.jobs);
                setError(null);
            } else {
                setError(result.error || '잡 목록을 불러오지 못했습니다.');
            }
            setLoading(false);
        });
    }

    useEffect(() => {
        if (status === 'LOGGED_OUT') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (status !== 'LOGGED_IN') return;
        setLoading(true);
        getJobs().then((result) => {
            if (result.ok) {
                setJobs(result.jobs);
                setError(null);
            } else {
                setError(result.error || '잡 목록을 불러오지 못했습니다.');
            }
            setLoading(false);
        });
    }, [status]);

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Job List</h1>
                <CreateJobDialog onCreated={onActionDone} />
            </div>
            <JobTable jobs={jobs} loading={loading} error={error} onActionDone={onActionDone} />
        </DashboardLayout>
    );
}
