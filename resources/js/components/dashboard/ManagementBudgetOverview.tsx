import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { ManagementBudgetOverview as BudgetOverview } from '@/types/dashboard';
import { Link } from '@inertiajs/react';

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

export function ManagementBudgetOverview({ data }: { data: BudgetOverview }) {
    const allocationPercentage =
        data.total_management_budget > 0
            ? (data.allocated_budget / data.total_management_budget) * 100
            : 0;
    const metrics = [
        {
            label: 'Total Management Budget',
            value: data.total_management_budget,
        },
        { label: 'Alokasi Non-Project', value: data.allocated_budget },
        { label: 'Tersedia untuk Alokasi', value: data.available_budget },
    ];

    return (
        <Card className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <CardHeader className="gap-3 border-b">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-lg">
                        Management Budget &amp; Non-Project
                    </CardTitle>
                    <Badge variant="secondary">Semua tahun</Badge>
                </div>
                <CardDescription>
                    Anggaran proyek internal berasal dari gabungan management
                    budget seluruh project. Ringkasan ini tidak mengikuti filter
                    tahun KPI.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <dl className="grid gap-5 sm:grid-cols-3">
                    {metrics.map((metric) => (
                        <div key={metric.label} className="min-w-0 space-y-1">
                            <dt className="text-sm text-muted-foreground">
                                {metric.label}
                            </dt>
                            <dd className="text-xl font-semibold break-words tabular-nums">
                                {currency.format(metric.value)}
                            </dd>
                        </div>
                    ))}
                </dl>

                <div className="space-y-2">
                    <div className="flex flex-wrap justify-between gap-2 text-sm">
                        <span className="font-medium">
                            Alokasi dari Management Budget
                        </span>
                        <span className="text-muted-foreground tabular-nums">
                            {allocationPercentage.toLocaleString('id-ID', {
                                maximumFractionDigits: 1,
                            })}
                            % dialokasikan
                        </span>
                    </div>
                    <div
                        role="img"
                        aria-label={`Alokasi Non-Project ${currency.format(data.allocated_budget)}, tersedia ${currency.format(data.available_budget)}`}
                        className="flex h-3 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950"
                    >
                        <div
                            className={`h-full ${data.overallocated_budget > 0 ? 'bg-destructive' : 'bg-emerald-600'}`}
                            style={{
                                width: `${data.overallocated_budget > 0 ? 100 : Math.min(100, allocationPercentage)}%`,
                            }}
                        />
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <span
                                aria-hidden="true"
                                className="size-2 rounded-full bg-emerald-600"
                            />
                            Alokasi Non-Project
                        </span>
                        <span className="flex items-center gap-2">
                            <span
                                aria-hidden="true"
                                className="size-2 rounded-full bg-emerald-100 ring-1 ring-emerald-600/30 dark:bg-emerald-950"
                            />
                            Tersedia untuk alokasi
                        </span>
                    </div>
                    {data.overallocated_budget > 0 && (
                        <p
                            role="status"
                            className="text-sm font-medium text-destructive"
                        >
                            Alokasi melebihi management budget sebesar{' '}
                            {currency.format(data.overallocated_budget)}.
                        </p>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-sm font-semibold">
                            Rincian Proyek Internal ({data.projects.length})
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Total terpakai:{' '}
                            <span className="font-medium text-foreground tabular-nums">
                                {currency.format(data.total_expenses)}
                            </span>
                        </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Alokasi mencadangkan seluruh nominal Non-Project.
                        Terpakai menghitung ATR yang belum masuk EER, EER, dan
                        allowance.
                    </p>
                    {data.projects.length === 0 ? (
                        <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                            Belum ada Non-Project yang menggunakan management
                            budget.
                        </p>
                    ) : (
                        <div className="max-h-96 overflow-y-auto rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead scope="col">
                                            Non-Project
                                        </TableHead>
                                        <TableHead
                                            scope="col"
                                            className="text-right"
                                        >
                                            Alokasi
                                        </TableHead>
                                        <TableHead
                                            scope="col"
                                            className="text-right whitespace-nowrap"
                                        >
                                            ATR Belum EER
                                        </TableHead>
                                        <TableHead
                                            scope="col"
                                            className="text-right"
                                        >
                                            EER
                                        </TableHead>
                                        <TableHead
                                            scope="col"
                                            className="text-right"
                                        >
                                            Allowance
                                        </TableHead>
                                        <TableHead
                                            scope="col"
                                            className="text-right whitespace-nowrap"
                                        >
                                            Sisa Alokasi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.projects.map((project) => (
                                        <TableRow key={project.uuid}>
                                            <TableCell className="min-w-48">
                                                <Link
                                                    href={route(
                                                        'projects.show',
                                                        project.uuid,
                                                    )}
                                                    className="font-medium hover:underline"
                                                >
                                                    {project.name}
                                                </Link>
                                                {project.code && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {project.code}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right whitespace-nowrap tabular-nums">
                                                {currency.format(
                                                    project.budget_total,
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right whitespace-nowrap tabular-nums">
                                                {currency.format(
                                                    project.pending_atr,
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right whitespace-nowrap tabular-nums">
                                                {currency.format(
                                                    project.used_eer,
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right whitespace-nowrap tabular-nums">
                                                {currency.format(
                                                    project.used_allowance,
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className={`text-right font-medium whitespace-nowrap tabular-nums ${project.remaining_budget < 0 ? 'text-destructive' : 'text-emerald-700 dark:text-emerald-400'}`}
                                            >
                                                {currency.format(
                                                    project.remaining_budget,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
