import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table';
import {
    Loader2,
    PauseCircle,
    PlayCircle,
    Play,
    Pause,
    Trash2,
    RefreshCw,
} from 'lucide-react';
import { useMemo } from 'react';
import type { Job } from '@/api/jobs';
import { startJob, pauseJob, runJobNow, deleteJob } from '@/api/jobs';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface JobTableProps {
    jobs: Job[];
    loading: boolean;
    error: string | null;
    onActionDone?: () => void; // 데이터 갱신용 콜백
}

export default function JobTable({
    jobs,
    loading,
    error,
    onActionDone,
}: JobTableProps) {
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const columns = useMemo<ColumnDef<Job>[]>(
        () => [
            {
                id: 'actions',
                header: '액션',
                cell: ({ row }) => {
                    const job = row.original;
                    return (
                        <div className="flex gap-2">
                            {job.status === 'ACTIVE' ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            title="일시정지"
                                            className="text-yellow-600 hover:bg-yellow-50 rounded p-1 bg-transparent"
                                            disabled={actionLoading === job.id}
                                            onClick={async () => {
                                                setActionLoading(job.id);
                                                await pauseJob(job.id);
                                                setActionLoading(null);
                                                onActionDone?.();
                                            }}
                                        >
                                            <Pause size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>일시정지</p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            title="시작"
                                            className="text-green-600 hover:bg-green-50 rounded p-1 bg-transparent"
                                            disabled={actionLoading === job.id}
                                            onClick={async () => {
                                                setActionLoading(job.id);
                                                await startJob(job.id);
                                                setActionLoading(null);
                                                onActionDone?.();
                                            }}
                                        >
                                            <Play size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>시작</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        title="즉시 실행"
                                        className="text-blue-600 hover:bg-blue-50 rounded p-1 bg-transparent"
                                        disabled={actionLoading === job.id}
                                        onClick={async () => {
                                            setActionLoading(job.id);
                                            const result = await runJobNow(job.id);
                                            console.log(result);

                                            setActionLoading(null);
                                            onActionDone?.();
                                        }}
                                    >
                                        <RefreshCw size={16} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>즉시 실행</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        title="삭제"
                                        className="text-destructive hover:bg-red-50 rounded p-1 bg-transparent"
                                        disabled={actionLoading === job.id}
                                        onClick={async () => {
                                            if (
                                                confirm(
                                                    '정말 삭제하시겠습니까?'
                                                )
                                            ) {
                                                setActionLoading(job.id);
                                                await deleteJob(job.id);
                                                setActionLoading(null);
                                                onActionDone?.();
                                            }
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>삭제</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'id',
                header: 'ID',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'name',
                header: '이름',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'project',
                header: '프로젝트',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'description',
                header: '설명',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'url',
                header: 'URL',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'method',
                header: '메서드',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'body',
                header: 'Body',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'xSecret',
                header: 'X-Secret',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'status',
                header: '상태',
                cell: (info) => {
                    const value = info.getValue();
                    return value === 'ACTIVE' ? (
                        <span className="flex items-center gap-1 text-green-600">
                            <PlayCircle size={16} /> 활성
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-yellow-600">
                            <PauseCircle size={16} /> 일시정지
                        </span>
                    );
                },
            },
            {
                accessorKey: 'cron',
                header: 'Cron',
                cell: (info) => (
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                        {String(info.getValue() ?? '')}
                    </code>
                ),
            },
            {
                accessorKey: 'lastRunAt',
                header: '마지막 실행',
                cell: (info) => {
                    const value = info.getValue() as string | null;
                    return value ? new Date(value).toLocaleString() : '-';
                },
            },
        ],
        [actionLoading, onActionDone]
    );

    const table = useReactTable({
        data: jobs,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="animate-spin" /> 불러오는 중...
            </div>
        );
    }
    if (error) {
        return <div className="text-destructive">{error}</div>;
    }
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {table.getHeaderGroups()[0].headers.map((header) => (
                        <TableHead key={header.id}>
                            {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className="text-center"
                        >
                            데이터 없음
                        </TableCell>
                    </TableRow>
                ) : (
                    table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
