import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\RoleController::index
* @see app/Http/Controllers/Api/RoleController.php:16
* @route '/api/rbac/roles'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/rbac/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RoleController::index
* @see app/Http/Controllers/Api/RoleController.php:16
* @route '/api/rbac/roles'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RoleController::index
* @see app/Http/Controllers/Api/RoleController.php:16
* @route '/api/rbac/roles'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\RoleController::index
* @see app/Http/Controllers/Api/RoleController.php:16
* @route '/api/rbac/roles'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\RoleController::index
* @see app/Http/Controllers/Api/RoleController.php:16
* @route '/api/rbac/roles'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\RoleController::index
* @see app/Http/Controllers/Api/RoleController.php:16
* @route '/api/rbac/roles'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\RoleController::index
* @see app/Http/Controllers/Api/RoleController.php:16
* @route '/api/rbac/roles'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Api\RoleController::store
* @see app/Http/Controllers/Api/RoleController.php:27
* @route '/api/rbac/roles'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/rbac/roles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\RoleController::store
* @see app/Http/Controllers/Api/RoleController.php:27
* @route '/api/rbac/roles'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RoleController::store
* @see app/Http/Controllers/Api/RoleController.php:27
* @route '/api/rbac/roles'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\RoleController::store
* @see app/Http/Controllers/Api/RoleController.php:27
* @route '/api/rbac/roles'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\RoleController::store
* @see app/Http/Controllers/Api/RoleController.php:27
* @route '/api/rbac/roles'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\RoleController::show
* @see app/Http/Controllers/Api/RoleController.php:45
* @route '/api/rbac/roles/{role}'
*/
export const show = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/rbac/roles/{role}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RoleController::show
* @see app/Http/Controllers/Api/RoleController.php:45
* @route '/api/rbac/roles/{role}'
*/
show.url = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { role: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return show.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RoleController::show
* @see app/Http/Controllers/Api/RoleController.php:45
* @route '/api/rbac/roles/{role}'
*/
show.get = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\RoleController::show
* @see app/Http/Controllers/Api/RoleController.php:45
* @route '/api/rbac/roles/{role}'
*/
show.head = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\RoleController::show
* @see app/Http/Controllers/Api/RoleController.php:45
* @route '/api/rbac/roles/{role}'
*/
const showForm = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\RoleController::show
* @see app/Http/Controllers/Api/RoleController.php:45
* @route '/api/rbac/roles/{role}'
*/
showForm.get = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\RoleController::show
* @see app/Http/Controllers/Api/RoleController.php:45
* @route '/api/rbac/roles/{role}'
*/
showForm.head = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Api\RoleController::update
* @see app/Http/Controllers/Api/RoleController.php:54
* @route '/api/rbac/roles/{role}'
*/
export const update = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/rbac/roles/{role}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\RoleController::update
* @see app/Http/Controllers/Api/RoleController.php:54
* @route '/api/rbac/roles/{role}'
*/
update.url = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { role: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return update.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RoleController::update
* @see app/Http/Controllers/Api/RoleController.php:54
* @route '/api/rbac/roles/{role}'
*/
update.put = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\RoleController::update
* @see app/Http/Controllers/Api/RoleController.php:54
* @route '/api/rbac/roles/{role}'
*/
const updateForm = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\RoleController::update
* @see app/Http/Controllers/Api/RoleController.php:54
* @route '/api/rbac/roles/{role}'
*/
updateForm.put = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Api\RoleController::destroy
* @see app/Http/Controllers/Api/RoleController.php:69
* @route '/api/rbac/roles/{role}'
*/
export const destroy = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/rbac/roles/{role}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\RoleController::destroy
* @see app/Http/Controllers/Api/RoleController.php:69
* @route '/api/rbac/roles/{role}'
*/
destroy.url = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { role: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return destroy.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RoleController::destroy
* @see app/Http/Controllers/Api/RoleController.php:69
* @route '/api/rbac/roles/{role}'
*/
destroy.delete = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\RoleController::destroy
* @see app/Http/Controllers/Api/RoleController.php:69
* @route '/api/rbac/roles/{role}'
*/
const destroyForm = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\RoleController::destroy
* @see app/Http/Controllers/Api/RoleController.php:69
* @route '/api/rbac/roles/{role}'
*/
destroyForm.delete = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\Api\RoleController::syncPermissions
* @see app/Http/Controllers/Api/RoleController.php:80
* @route '/api/rbac/roles/{role}/permissions'
*/
export const syncPermissions = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncPermissions.url(args, options),
    method: 'post',
})

syncPermissions.definition = {
    methods: ["post"],
    url: '/api/rbac/roles/{role}/permissions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\RoleController::syncPermissions
* @see app/Http/Controllers/Api/RoleController.php:80
* @route '/api/rbac/roles/{role}/permissions'
*/
syncPermissions.url = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { role: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return syncPermissions.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RoleController::syncPermissions
* @see app/Http/Controllers/Api/RoleController.php:80
* @route '/api/rbac/roles/{role}/permissions'
*/
syncPermissions.post = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncPermissions.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\RoleController::syncPermissions
* @see app/Http/Controllers/Api/RoleController.php:80
* @route '/api/rbac/roles/{role}/permissions'
*/
const syncPermissionsForm = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncPermissions.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\RoleController::syncPermissions
* @see app/Http/Controllers/Api/RoleController.php:80
* @route '/api/rbac/roles/{role}/permissions'
*/
syncPermissionsForm.post = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncPermissions.url(args, options),
    method: 'post',
})

syncPermissions.form = syncPermissionsForm

const RoleController = { index, store, show, update, destroy, syncPermissions }

export default RoleController