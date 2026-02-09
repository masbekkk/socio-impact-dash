import React from 'react'
import AppShell from '@/layouts/AppShell'
import PageHeader from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import { Head } from '@inertiajs/react'

export default function CalendarIndex() {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kalender', href: '/calendar' },
    ];
    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Kalender" />
            <div className="p-6 md:p-10">
                <PageHeader title="Kalender" description="Lihat jadwal dan agenda" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-muted-foreground">Kalender belum tersedia.</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppSidebarLayout>
    )
}
