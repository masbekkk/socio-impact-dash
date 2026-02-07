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
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, Settings, DollarSign, Calendar, CheckSquare, FileText } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

function getMenusByRole(): Record<string, NavItem[]> {
    return {
        pegawai: [
            {
                title: 'Dashboard',
                href: dashboard().url,
                icon: LayoutGrid,
            },
            {
                title: 'Proyek',
                href: '/projects',
                icon: Folder,
            },
            {
                title: 'Kalender',
                href: '/calendar',
                icon: Calendar,
            },
            {
                title: 'Reimbursement',
                href: '/reimbursements',
                icon: DollarSign,
            },
            {
                title: 'Cuti',
                href: '/leaves',
                icon: Calendar,
            },
            {
                title: 'Presensi',
                href: '/presences',
                icon: CheckSquare,
            },
        ],
        head: [
            {
                title: 'Dashboard',
                href: dashboard().url,
                icon: LayoutGrid,
            },
            {
                title: 'Proyek (Divisi)',
                href: '/projects',
                icon: Folder,
            },
            {
                title: 'Persetujuan',
                href: '/reimbursements/approvals',
                icon: CheckSquare,
            },
            {
                title: 'Persetujuan Cuti',
                href: '/leaves/approvals',
                icon: Calendar,
            },
        ],
        finance: [
            {
                title: 'Dashboard',
                href: dashboard().url,
                icon: LayoutGrid,
            },
            {
                title: 'Persetujuan Reimbursement',
                href: '/reimbursements/approvals',
                icon: DollarSign,
            },
            {
                title: 'Transfer',
                href: '/reimbursements',
                icon: FileText,
            },
        ],
        superadmin: [
            {
                title: 'Dashboard',
                href: dashboard().url,
                icon: LayoutGrid,
            },
            {
                title: 'Manajemen User',
                href: '/admin/users',
                icon: Users,
            },
            {
                title: 'Divisi',
                href: '/admin/divisions',
                icon: FileText,
            },
            {
                title: 'Semua Proyek',
                href: '/projects',
                icon: Folder,
            },
            {
                title: 'Pengaturan',
                href: dashboard().url,
                icon: Settings,
            },
        ],
    };
}

export function AppSidebar() {
    const { props } = usePage();
    const auth = (props.auth as any) || {};
    const userRole = auth?.user?.role || 'pegawai';
    const menusByRole = getMenusByRole();
    const mainNavItems = menusByRole[userRole] || menusByRole.pegawai;

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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

