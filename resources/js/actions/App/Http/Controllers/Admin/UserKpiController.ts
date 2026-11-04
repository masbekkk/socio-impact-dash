import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\UserKpiController::index
* @see app/Http/Controllers/Admin/UserKpiController.php:13
* @route '/admin/kpis'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/kpis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserKpiController::index
* @see app/Http/Controllers/Admin/UserKpiController.php:13
* @route '/admin/kpis'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserKpiController::index
* @see app/Http/Controllers/Admin/UserKpiController.php:13
* @route '/admin/kpis'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserKpiController::index
* @see app/Http/Controllers/Admin/UserKpiController.php:13
* @route '/admin/kpis'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\UserKpiController::index
* @see app/Http/Controllers/Admin/UserKpiController.php:13
* @route '/admin/kpis'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserKpiController::index
* @see app/Http/Controllers/Admin/UserKpiController.php:13
* @route '/admin/kpis'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserKpiController::index
* @see app/Http/Controllers/Admin/UserKpiController.php:13
* @route '/admin/kpis'
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

const UserKpiController = { index }

export default UserKpiController