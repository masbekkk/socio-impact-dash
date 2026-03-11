<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Formatters\JsonResponseFormatter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Spatie\Permission\Models\Permission;
use Throwable;

final class PermissionController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $permissions = Permission::all();

            return JsonResponseFormatter::success($permissions);
        } catch (Throwable $th) {
            return JsonResponseFormatter::error('Failed to fetch permissions: '.$th->getMessage(), 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => ['required', 'string', 'unique:permissions,name'],
            ]);

            $permission = Permission::create(['name' => $request->name, 'guard_name' => 'web']);

            return JsonResponseFormatter::created($permission, 'Permission created successfully');
        } catch (Throwable $th) {
            return JsonResponseFormatter::error('Failed to create permission: '.$th->getMessage(), 500);
        }
    }

    public function destroy(Permission $permission): JsonResponse
    {
        try {
            $permission->delete();

            return JsonResponseFormatter::success(null, 'Permission deleted successfully');
        } catch (Throwable $th) {
            return JsonResponseFormatter::error('Failed to delete permission: '.$th->getMessage(), 500);
        }
    }
}
