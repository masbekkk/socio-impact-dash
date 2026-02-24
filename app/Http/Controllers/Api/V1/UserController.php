<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Formatters\JsonResponseFormatter;
use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Http\Resources\V1\User\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;

final class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::with('roles');

        if ($request->filled('role')) {
            $query->role($request->get('role'));
        }

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate($request->integer('per_page', 10));

        return JsonResponseFormatter::success(
            UserResource::collection($users)->response()->getData(true),
            'Users retrieved successfully'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $data = $request->validated();

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);

        $user->assignRole($data['role']);

        $user->load('roles');

        return JsonResponseFormatter::success(
            new UserResource($user),
            'User created successfully',
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): JsonResponse
    {
        $user->load('roles');

        return JsonResponseFormatter::success(
            new UserResource($user),
            'User retrieved successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();

        if (isset($data['password']) && ! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        $role = $data['role'];

        unset($data['role']);

        $user->update($data);

        if (isset($role)) {
            $user->syncRoles([$role]);
        }

        $user->load('roles');

        return JsonResponseFormatter::success(
            new UserResource($user),
            'User updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): JsonResponse
    {
        if ($user->id === auth()->id()) {
            return JsonResponseFormatter::error(null, 'Cannot delete your own account.', 400);
        }

        $user->delete();

        return JsonResponseFormatter::success(
            null,
            'User deleted successfully'
        );
    }
}
