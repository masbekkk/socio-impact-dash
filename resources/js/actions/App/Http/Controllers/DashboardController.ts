import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::leaderboard
* @see app/Http/Controllers/DashboardController.php:155
* @route '/api/v1/dashboard/leaderboard'
*/
export const leaderboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaderboard.url(options),
    method: 'get',
})

leaderboard.definition = {
    methods: ["get","head"],
    url: '/api/v1/dashboard/leaderboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::leaderboard
* @see app/Http/Controllers/DashboardController.php:155
* @route '/api/v1/dashboard/leaderboard'
*/
leaderboard.url = (options?: RouteQueryOptions) => {
    return leaderboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::leaderboard
* @see app/Http/Controllers/DashboardController.php:155
* @route '/api/v1/dashboard/leaderboard'
*/
leaderboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaderboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::leaderboard
* @see app/Http/Controllers/DashboardController.php:155
* @route '/api/v1/dashboard/leaderboard'
*/
leaderboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: leaderboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::leaderboard
* @see app/Http/Controllers/DashboardController.php:155
* @route '/api/v1/dashboard/leaderboard'
*/
const leaderboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaderboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::leaderboard
* @see app/Http/Controllers/DashboardController.php:155
* @route '/api/v1/dashboard/leaderboard'
*/
leaderboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaderboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::leaderboard
* @see app/Http/Controllers/DashboardController.php:155
* @route '/api/v1/dashboard/leaderboard'
*/
leaderboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: leaderboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

leaderboard.form = leaderboardForm

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:22
* @route '/dashboard'
*/
const DashboardController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: DashboardController.url(options),
    method: 'get',
})

DashboardController.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:22
* @route '/dashboard'
*/
DashboardController.url = (options?: RouteQueryOptions) => {
    return DashboardController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:22
* @route '/dashboard'
*/
DashboardController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: DashboardController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:22
* @route '/dashboard'
*/
DashboardController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: DashboardController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:22
* @route '/dashboard'
*/
const DashboardControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: DashboardController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:22
* @route '/dashboard'
*/
DashboardControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: DashboardController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:22
* @route '/dashboard'
*/
DashboardControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: DashboardController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

DashboardController.form = DashboardControllerForm

DashboardController.leaderboard = leaderboard

export default DashboardController