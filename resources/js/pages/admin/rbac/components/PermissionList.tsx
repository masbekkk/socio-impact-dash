import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Trash2 } from 'lucide-react';

export default function PermissionList() {
    const [permissions, setPermissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/rbac/permissions');
            const result = await response.json();
            setPermissions(result.data || []);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName) return;
        setIsCreating(true);
        try {
            await fetch('/api/rbac/permissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                },
                body: JSON.stringify({ name: newName })
            });
            setNewName('');
            fetchPermissions();
        } catch (error) {
            console.error('Error creating permission:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this permission?')) return;
        try {
            await fetch(`/api/rbac/permissions/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                }
            });
            fetchPermissions();
        } catch (error) {
            console.error('Error deleting permission:', error);
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
            <form onSubmit={handleCreate} className="flex gap-2">
                <Input
                    placeholder="New permission name..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="max-w-xs"
                />
                <Button type="submit" disabled={isCreating}>
                    <Plus className="mr-2 h-4 w-4" />
                    {isCreating ? 'Creating...' : 'Create Permission'}
                </Button>
            </form>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Permission Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {permissions.map((permission) => (
                            <TableRow key={permission.id}>
                                <TableCell className="font-medium">{permission.name}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(permission.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {permissions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                                    No permissions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
