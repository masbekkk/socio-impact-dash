import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface RolePermissionEditorProps {
    role: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function RolePermissionEditor({ role, isOpen, onClose }: RolePermissionEditorProps) {
    const [permissions, setPermissions] = useState<any[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [allRes, roleRes] = await Promise.all([
                    fetch('/api/rbac/permissions').then(res => res.json()),
                    fetch(`/api/rbac/roles/${role.id}`).then(res => res.json())
                ]);
                setPermissions(allRes.data || []);
                setSelectedPermissions((roleRes.data?.permissions || []).map((p: any) => p.name));
            } catch (error) {
                console.error('Error fetching permissions:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && role) {
            fetchData();
        }
    }, [isOpen, role]);

    const handleToggle = (permissionName: string) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionName)
                ? prev.filter(p => p !== permissionName)
                : [...prev, permissionName]
        );
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`/api/rbac/roles/${role.id}/permissions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                },
                body: JSON.stringify({ permissions: selectedPermissions })
            });

            if (response.ok) {
                onClose();
            } else {
                console.error('Failed to save permissions');
            }
        } catch (error) {
            console.error('Error saving permissions:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Permissions for {role.name}</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : (
                    <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
                        {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`permission-${permission.id}`}
                                    checked={selectedPermissions.includes(permission.name)}
                                    onCheckedChange={() => handleToggle(permission.name)}
                                />
                                <label
                                    htmlFor={`permission-${permission.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {permission.name}
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving || loading}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
