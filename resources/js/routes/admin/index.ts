import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import users from './users'
/**
* @see routes/web.php:73
* @route '/admin/rbac'
*/
export const rbac = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rbac.url(options),
    method: 'get',
})

rbac.definition = {
    methods: ["get","head"],
    url: '/admin/rbac',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:73
* @route '/admin/rbac'
*/
rbac.url = (options?: RouteQueryOptions) => {
    return rbac.definition.url + queryParams(options)
}

/**
* @see routes/web.php:73
* @route '/admin/rbac'
*/
rbac.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rbac.url(options),
    method: 'get',
})

/**
* @see routes/web.php:73
* @route '/admin/rbac'
*/
rbac.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: rbac.url(options),
    method: 'head',
})

/**
* @see routes/web.php:73
* @route '/admin/rbac'
*/
const rbacForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: rbac.url(options),
    method: 'get',
})

/**
* @see routes/web.php:73
* @route '/admin/rbac'
*/
rbacForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: rbac.url(options),
    method: 'get',
})

/**
* @see routes/web.php:73
* @route '/admin/rbac'
*/
rbacForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: rbac.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

rbac.form = rbacForm

/**
* @see \App\Http\Controllers\Admin\ImpersonationController::stopImpersonating
* @see app/Http/Controllers/Admin/ImpersonationController.php:22
* @route '/admin/stop-impersonating'
*/
export const stopImpersonating = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stopImpersonating.url(options),
    method: 'post',
})

stopImpersonating.definition = {
    methods: ["post"],
    url: '/admin/stop-impersonating',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ImpersonationController::stopImpersonating
* @see app/Http/Controllers/Admin/ImpersonationController.php:22
* @route '/admin/stop-impersonating'
*/
stopImpersonating.url = (options?: RouteQueryOptions) => {
    return stopImpersonating.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ImpersonationController::stopImpersonating
* @see app/Http/Controllers/Admin/ImpersonationController.php:22
* @route '/admin/stop-impersonating'
*/
stopImpersonating.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stopImpersonating.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ImpersonationController::stopImpersonating
* @see app/Http/Controllers/Admin/ImpersonationController.php:22
* @route '/admin/stop-impersonating'
*/
const stopImpersonatingForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: stopImpersonating.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ImpersonationController::stopImpersonating
* @see app/Http/Controllers/Admin/ImpersonationController.php:22
* @route '/admin/stop-impersonating'
*/
stopImpersonatingForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: stopImpersonating.url(options),
    method: 'post',
})

stopImpersonating.form = stopImpersonatingForm

const admin = {
    rbac: Object.assign(rbac, rbac),
    users: Object.assign(users, users),
    stopImpersonating: Object.assign(stopImpersonating, stopImpersonating),
}

export default admin