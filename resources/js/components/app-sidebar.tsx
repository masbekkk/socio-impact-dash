import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, Settings, DollarSign, Calendar, CheckSquare, FileText } from 'lucide-react';
import AppLogo from './app-logo';
import { usePermission } from '@/hooks/use-permission';

const NAV_ITEMS: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Proyek',
        href: '/projects',
        icon: Folder,
        roles: ['head', 'direktur', 'superadmin', 'finance'],
    },
    {
        title: 'Keuangan',
        href: '/reimbursements',
        icon: DollarSign,
        roles: ['pegawai', 'finance', 'hr', 'superadmin', 'head', 'direktur'],
    },
    {
        title: 'Presensi',
        href: '/presences',
        icon: CheckSquare,
        roles: ['pegawai', 'hr', 'superadmin', 'head', 'direktur', 'finance'],
    },
    {
        title: 'Cuti',
        href: '/leaves',
        icon: Calendar,
        roles: ['pegawai', 'hr', 'superadmin', 'head', 'direktur', 'finance'],
    },
    {
        title: 'Kalender',
        href: '/calendar',
        icon: Calendar,
    },
    {
        title: 'Nomor Surat',
        href: '/letter-requests',
        icon: FileText,
    },
    // {
    //     title: 'Pengajuan Cuti',
    //     href: '/leaves/approvals',
    //     icon: Calendar,
    //     roles: ['head', 'hr', 'direktur', 'superadmin'],
    // },
    // {
    //     title: 'Transfer',
    //     href: '/reimbursements',
    //     icon: FileText,
    //     roles: ['finance', 'superadmin', 'direktur', 'head', 'hr'],
    // },
    {
        title: 'Divisi',
        href: '/admin/divisions',
        icon: FileText,
        roles: ['superadmin'],
    },
    {
        title: 'Manajemen User',
        href: '/admin/users',
        icon: Users,
        roles: ['superadmin', 'hr'],
    },
    {
        title: 'RBAC Control',
        href: '/admin/rbac',
        icon: Settings,
        roles: ['superadmin'],
    },
    {
        title: 'Pengaturan',
        href: '/settings/profile',
        icon: Settings,
        roles: ['superadmin'],
    },
];

export function AppSidebar() {
    const { hasRole, hasPermission } = usePermission();

    const mainNavItems = NAV_ITEMS.filter((item) => {
        if (!item.roles && !item.permissions) return true;

        const roleAllowed = item.roles ? hasRole(item.roles) : false;
        const permissionAllowed = item.permissions ? hasPermission(item.permissions) : false;

        return roleAllowed || permissionAllowed;
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
