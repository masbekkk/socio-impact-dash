import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PermissionController::index
* @see app/Http/Controllers/Api/PermissionController.php:16
* @route '/api/rbac/permissions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/rbac/permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PermissionController::index
* @see app/Http/Controllers/Api/PermissionController.php:16
* @route '/api/rbac/permissions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PermissionController::index
* @see app/Http/Controllers/Api/PermissionController.php:16
* @route '/api/rbac/permissions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\PermissionController::index
* @see app/Http/Controllers/Api/PermissionController.php:16
* @route '/api/rbac/permissions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\PermissionController::index
* @see app/Http/Controllers/Api/PermissionController.php:16
* @route '/api/rbac/permissions'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\PermissionController::index
* @see app/Http/Controllers/Api/PermissionController.php:16
* @route '/api/rbac/permissions'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\PermissionController::index
* @see app/Http/Controllers/Api/PermissionController.php:16
* @route '/api/rbac/permissions'
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
* @see \App\Http\Controllers\Api\PermissionController::store
* @see app/Http/Controllers/Api/PermissionController.php:27
* @route '/api/rbac/permissions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/rbac/permissions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PermissionController::store
* @see app/Http/Controllers/Api/PermissionController.php:27
* @route '/api/rbac/permissions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PermissionController::store
* @see app/Http/Controllers/Api/PermissionController.php:27
* @route '/api/rbac/permissions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\PermissionController::store
* @see app/Http/Controllers/Api/PermissionController.php:27
* @route '/api/rbac/permissions'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\PermissionController::store
* @see app/Http/Controllers/Api/PermissionController.php:27
* @route '/api/rbac/permissions'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\PermissionController::destroy
* @see app/Http/Controllers/Api/PermissionController.php:42
* @route '/api/rbac/permissions/{permission}'
*/
export const destroy = (args: { permission: string | number | { id: string | number } } | [permission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/rbac/permissions/{permission}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\PermissionController::destroy
* @see app/Http/Controllers/Api/PermissionController.php:42
* @route '/api/rbac/permissions/{permission}'
*/
destroy.url = (args: { permission: string | number | { id: string | number } } | [permission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { permission: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            permission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        permission: typeof args.permission === 'object'
        ? args.permission.id
        : args.permission,
    }

    return destroy.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PermissionController::destroy
* @see app/Http/Controllers/Api/PermissionController.php:42
* @route '/api/rbac/permissions/{permission}'
*/
destroy.delete = (args: { permission: string | number | { id: string | number } } | [permission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\PermissionController::destroy
* @see app/Http/Controllers/Api/PermissionController.php:42
* @route '/api/rbac/permissions/{permission}'
*/
const destroyForm = (args: { permission: string | number | { id: string | number } } | [permission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\PermissionController::destroy
* @see app/Http/Controllers/Api/PermissionController.php:42
* @route '/api/rbac/permissions/{permission}'
*/
destroyForm.delete = (args: { permission: string | number | { id: string | number } } | [permission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const PermissionController = { index, store, destroy }

export default PermissionController