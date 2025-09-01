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
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useMemo } from 'react';
import type { Log } from '@/api/logs';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from '@/components/ui/pagination';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';
import { LogStatus } from '@/api/logs';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LogTableProps {
    logs: Log[];
    loading: boolean;
    error: string | null;
    page: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
    statusFilter: LogStatus | 'all';
    onStatusFilterChange: (status: LogStatus | 'all') => void;
    jobOptions: { id: number; name: string }[];
    jobFilter: number;
    onJobFilterChange: (jobId: number) => void;
    fromDate: string | undefined;
    toDate: string | undefined;
    onFromDateChange: (date: string | undefined) => void;
    onToDateChange: (date: string | undefined) => void;
}

export default function LogTable({
    logs,
    loading,
    error,
    page,
    total,
    limit,
    onPageChange,
    statusFilter,
    onStatusFilterChange,
    jobOptions,
    jobFilter,
    onJobFilterChange,
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange,
}: LogTableProps) {
    const columns = useMemo<ColumnDef<Log>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'jobId',
                header: 'Job',
                cell: (info) => info.row.original.jobId,
            },
            {
                accessorKey: 'status',
                header: '상태',
                cell: (info) => {
                    const value = info.getValue();
                    return value === 'SUCCESS' ? (
                        <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 size={16} /> 성공
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-destructive">
                            <XCircle size={16} /> 실패
                        </span>
                    );
                },
            },
            {
                accessorKey: 'httpStatus',
                header: 'HTTP',
                cell: (info) => info.getValue() ?? '-',
            },
            {
                accessorKey: 'message',
                header: '메시지',
                cell: (info) => info.getValue() ?? '-',
            },
            {
                accessorKey: 'createdAt',
                header: '생성일시',
                cell: (info) => {
                    const value = info.getValue() as string | null;
                    return value ? new Date(value).toLocaleString() : '-';
                },
            },
        ],
        []
    );

    const table = useReactTable({
        data: logs,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>
            <div className="flex flex-wrap gap-4 mb-4 items-end">
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        상태
                    </label>
                    <Select
                        value={statusFilter}
                        onValueChange={onStatusFilterChange}
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="전체" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">전체</SelectItem>
                            <SelectItem value={LogStatus.SUCCESS}>
                                성공
                            </SelectItem>
                            <SelectItem value={LogStatus.ERROR}>
                                실패
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        Job
                    </label>
                    <Select
                        value={jobFilter === 0 ? 'all' : String(jobFilter)}
                        onValueChange={(v) =>
                            onJobFilterChange(v === 'all' ? 0 : Number(v))
                        }
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="전체" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">전체</SelectItem>
                            {jobOptions.map((j) => (
                                <SelectItem key={j.id} value={String(j.id)}>
                                    {j.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        시작일
                    </label>
                    <div className="flex gap-2 items-center">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button type="button">
                                    {fromDate
                                        ? new Date(
                                              fromDate
                                          ).toLocaleDateString()
                                        : '날짜 선택'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Calendar
                                    mode="single"
                                    selected={
                                        fromDate
                                            ? new Date(fromDate)
                                            : undefined
                                    }
                                    onSelect={(date) => {
                                        if (!date)
                                            return onFromDateChange(undefined);
                                        const prev = fromDate
                                            ? new Date(fromDate)
                                            : new Date();
                                        date.setHours(
                                            prev.getHours(),
                                            prev.getMinutes()
                                        );
                                        onFromDateChange(date.toISOString());
                                    }}
                                    autoFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Input
                            type="time"
                            value={
                                fromDate
                                    ? new Date(fromDate)
                                          .toISOString()
                                          .slice(11, 16)
                                    : ''
                            }
                            onChange={(e) => {
                                if (!fromDate) return;
                                const d = new Date(fromDate);
                                const [h, m] = e.target.value.split(':');
                                d.setHours(Number(h), Number(m));
                                onFromDateChange(d.toISOString());
                            }}
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        종료일
                    </label>
                    <div className="flex gap-2 items-center">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button type="button">
                                    {toDate
                                        ? new Date(toDate).toLocaleDateString()
                                        : '날짜 선택'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Calendar
                                    mode="single"
                                    selected={
                                        toDate ? new Date(toDate) : undefined
                                    }
                                    onSelect={(date) => {
                                        if (!date)
                                            return onToDateChange(undefined);
                                        const prev = toDate
                                            ? new Date(toDate)
                                            : new Date();
                                        date.setHours(
                                            prev.getHours(),
                                            prev.getMinutes()
                                        );
                                        onToDateChange(date.toISOString());
                                    }}
                                    autoFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Input
                            type="time"
                            value={
                                toDate
                                    ? new Date(toDate)
                                          .toISOString()
                                          .slice(11, 16)
                                    : ''
                            }
                            onChange={(e) => {
                                if (!toDate) return;
                                const d = new Date(toDate);
                                const [h, m] = e.target.value.split(':');
                                d.setHours(Number(h), Number(m));
                                onToDateChange(d.toISOString());
                            }}
                        />
                    </div>
                </div>
                <div className="ml-auto">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            onStatusFilterChange('all');
                            onJobFilterChange(0);
                            onFromDateChange(undefined);
                            onToDateChange(undefined);
                        }}
                    >
                        필터 리셋
                    </Button>
                </div>
            </div>
            {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="animate-spin" /> 불러오는 중...
                </div>
            ) : error ? (
                <div className="text-destructive">{error}</div>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {table
                                    .getHeaderGroups()[0]
                                    .headers.map((header) => (
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
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => onPageChange(page - 1)}
                                    aria-disabled={page <= 1}
                                />
                            </PaginationItem>
                            {Array.from(
                                { length: Math.ceil(total / limit) },
                                (_, i) => i + 1
                            ).map((p) => (
                                <PaginationItem key={p}>
                                    <PaginationLink
                                        isActive={p === page}
                                        onClick={() => onPageChange(p)}
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => onPageChange(page + 1)}
                                    aria-disabled={
                                        page >= Math.ceil(total / limit)
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}
        </div>
    );
}
