<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Formatters\JsonResponseFormatter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Spatie\Permission\Models\Role;
use Throwable;

class RoleController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $roles = Role::with('permissions')->get();

            return JsonResponseFormatter::success($roles);
        } catch (Throwable $th) {
            return JsonResponseFormatter::error('Failed to fetch roles: '.$th->getMessage(), 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|unique:roles,name',
            ]);

            $role = Role::create(['name' => $request->name]);

            return JsonResponseFormatter::created($role, 'Role created successfully');
        } catch (Throwable $th) {
            return JsonResponseFormatter::error('Failed to create role: '.$th->getMessage(), 500);
        }
    }

    public function show(Role $role): JsonResponse
    {
        try {
            return JsonResponseFormatter::success($role->load('permissions'));
        } catch (Throwable $th) {
            return JsonResponseFormatter::error('Failed to fetch role: '.$th->getMessage(), 500);
        }
    }

    public function update(Request $request, Role $role): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|unique:roles,name,'.$role->id,
            ]);

            $role->update(['name' => $request->name]);

            return JsonResponseFormatter::success($role, 'Role updated successfully');
        } catch (Throwable $th) {
            return JsonResponseFormatter::error('Failed to update role: '.$th->getMessage(), 500);
        }
    }

    public function destroy(Role $role): JsonResponse
    {
        try {
            $role->delete();

            return JsonResponseFormatter::success(null, 'Role deleted successfully');
        } catch (Throwable $th) {
            return JsonResponseFormatter::error('Failed to delete role: '.$th->getMessage(), 500);
        }
    }

    public function syncPermissions(Request $request, Role $role): JsonResponse
    {
        try {
            $request->validate([
                'permissions' => 'array',
                'permissions.*' => 'string|exists:permissions,name',
            ]);

            $role->syncPermissions($request->permissions);

            return JsonResponseFormatter::success($role->load('permissions'), 'Permissions synced successfully');
        } catch (Throwable $th) {
            return JsonResponseFormatter::error('Failed to sync permissions: '.$th->getMessage(), 500);
        }
    }
}
