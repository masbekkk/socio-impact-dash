import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Input } from '@/components/ui/input';
import { FileText, Search } from 'lucide-react';

interface ProjectOption {
    uuid: string;
    code: string;
    initial_project: string | null;
    name: string;
}

export default function EmployeeProjectIndex({ projects }: { projects: ProjectOption[] }) {
    const [search, setSearch] = useState('');
    const filteredProjects = projects.filter((project) =>
        `${project.code} ${project.initial_project || ''} ${project.name}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Proyek', href: '/projects' }]}>
            <Head title="Laporan Proyek" />
            <div className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-8">
                <div>
                    <h1 className="text-2xl font-semibold">Laporan & Monitoring Proyek</h1>
                    <p className="text-sm text-muted-foreground">Pilih proyek untuk mengisi laporan atau melihat monitoring.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        aria-label="Cari proyek"
                        placeholder="Cari kode, inisial, atau nama proyek"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="space-y-2">
                    {filteredProjects.length === 0 ? (
                        <p className="rounded-lg border p-6 text-center text-sm text-muted-foreground">Tidak ada proyek aktif yang cocok.</p>
                    ) : filteredProjects.map((project) => (
                        <Link
                            key={project.uuid}
                            href={`/projects/${project.uuid}`}
                            className="flex items-center gap-3 rounded-lg border bg-white p-4 hover:border-primary hover:bg-muted/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            <FileText className="size-5 shrink-0 text-primary" />
                            <span className="min-w-0 text-sm font-medium">
                                {[project.code, project.initial_project, project.name].filter(Boolean).join(' - ')}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </AppSidebarLayout>
    );
}
