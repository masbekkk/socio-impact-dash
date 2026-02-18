import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, NavItem } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoleList from './components/RoleList';
import PermissionList from './components/PermissionList';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'RBAC Control',
        href: '/admin/rbac',
    },
];

export default function RBACIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="RBAC Control" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Role Based Access Control</h1>
                </div>

                <Tabs defaultValue="roles" className="w-full">
                    <TabsList>
                        <TabsTrigger value="roles">Roles</TabsTrigger>
                        <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="roles" className="mt-4">
                        <RoleList />
                    </TabsContent>
                    <TabsContent value="permissions" className="mt-4">
                        <PermissionList />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
