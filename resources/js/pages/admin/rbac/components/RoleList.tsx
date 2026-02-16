import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import RolePermissionEditor from './RolePermissionEditor';
import { Loader2, Plus, Shield, Trash2 } from 'lucide-react';

export default function RoleList() {
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newRoleName, setNewRoleName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [selectedRole, setSelectedRole] = useState<any>(null);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/rbac/roles');
            const result = await response.json();
            setRoles(result.data || []);
        } catch (error) {
            console.error('Error fetching roles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRoleName) return;
        setIsCreating(true);
        try {
            await fetch('/api/rbac/roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                },
                body: JSON.stringify({ name: newRoleName })
            });
            setNewRoleName('');
            fetchRoles();
        } catch (error) {
            console.error('Error creating role:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteRole = async (id: number) => {
        if (!confirm('Are you sure you want to delete this role?')) return;
        try {
            await fetch(`/api/rbac/roles/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                }
            });
            fetchRoles();
        } catch (error) {
            console.error('Error deleting role:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <form onSubmit={handleCreateRole} className="flex gap-2">
                <Input
                    placeholder="New role name..."
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="max-w-xs"
                />
                <Button type="submit" disabled={isCreating}>
                    <Plus className="mr-2 h-4 w-4" />
                    {isCreating ? 'Creating...' : 'Create Role'}
                </Button>
            </form>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Role Name</TableHead>
                            <TableHead>Permissions</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-primary" />
                                        {role.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {(role.permissions || []).map((p: any) => (
                                            <Badge key={p.id} variant="secondary">
                                                {p.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => setSelectedRole(role)}>
                                        Edit Permissions
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {selectedRole && (
                <RolePermissionEditor
                    role={selectedRole}
                    isOpen={!!selectedRole}
                    onClose={() => {
                        setSelectedRole(null);
                        fetchRoles();
                    }}
                />
            )}
        </div>
    );
}
