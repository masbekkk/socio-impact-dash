import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ImpersonationController::impersonate
* @see app/Http/Controllers/Admin/ImpersonationController.php:15
* @route '/admin/users/{user}/impersonate'
*/
export const impersonate = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: impersonate.url(args, options),
    method: 'post',
})

impersonate.definition = {
    methods: ["post"],
    url: '/admin/users/{user}/impersonate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ImpersonationController::impersonate
* @see app/Http/Controllers/Admin/ImpersonationController.php:15
* @route '/admin/users/{user}/impersonate'
*/
impersonate.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return impersonate.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ImpersonationController::impersonate
* @see app/Http/Controllers/Admin/ImpersonationController.php:15
* @route '/admin/users/{user}/impersonate'
*/
impersonate.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: impersonate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ImpersonationController::impersonate
* @see app/Http/Controllers/Admin/ImpersonationController.php:15
* @route '/admin/users/{user}/impersonate'
*/
const impersonateForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: impersonate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ImpersonationController::impersonate
* @see app/Http/Controllers/Admin/ImpersonationController.php:15
* @route '/admin/users/{user}/impersonate'
*/
impersonateForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: impersonate.url(args, options),
    method: 'post',
})

impersonate.form = impersonateForm

/**
* @see \App\Http\Controllers\Admin\ImpersonationController::stop
* @see app/Http/Controllers/Admin/ImpersonationController.php:22
* @route '/admin/stop-impersonating'
*/
export const stop = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stop.url(options),
    method: 'post',
})

stop.definition = {
    methods: ["post"],
    url: '/admin/stop-impersonating',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ImpersonationController::stop
* @see app/Http/Controllers/Admin/ImpersonationController.php:22
* @route '/admin/stop-impersonating'
*/
stop.url = (options?: RouteQueryOptions) => {
    return stop.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ImpersonationController::stop
* @see app/Http/Controllers/Admin/ImpersonationController.php:22
* @route '/admin/stop-impersonating'
*/
stop.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stop.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ImpersonationController::stop
* @see app/Http/Controllers/Admin/ImpersonationController.php:22
* @route '/admin/stop-impersonating'
*/
const stopForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: stop.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ImpersonationController::stop
* @see app/Http/Controllers/Admin/ImpersonationController.php:22
* @route '/admin/stop-impersonating'
*/
stopForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: stop.url(options),
    method: 'post',
})

stop.form = stopForm

const ImpersonationController = { impersonate, stop }

export default ImpersonationController