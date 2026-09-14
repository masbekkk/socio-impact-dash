import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::heads
* @see app/Http/Controllers/Api/V1/UserKpiController.php:42
* @route '/api/v1/user-kpis/heads'
*/
export const heads = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: heads.url(options),
    method: 'get',
})

heads.definition = {
    methods: ["get","head"],
    url: '/api/v1/user-kpis/heads',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::heads
* @see app/Http/Controllers/Api/V1/UserKpiController.php:42
* @route '/api/v1/user-kpis/heads'
*/
heads.url = (options?: RouteQueryOptions) => {
    return heads.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::heads
* @see app/Http/Controllers/Api/V1/UserKpiController.php:42
* @route '/api/v1/user-kpis/heads'
*/
heads.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: heads.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::heads
* @see app/Http/Controllers/Api/V1/UserKpiController.php:42
* @route '/api/v1/user-kpis/heads'
*/
heads.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: heads.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::heads
* @see app/Http/Controllers/Api/V1/UserKpiController.php:42
* @route '/api/v1/user-kpis/heads'
*/
const headsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: heads.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::heads
* @see app/Http/Controllers/Api/V1/UserKpiController.php:42
* @route '/api/v1/user-kpis/heads'
*/
headsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: heads.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::heads
* @see app/Http/Controllers/Api/V1/UserKpiController.php:42
* @route '/api/v1/user-kpis/heads'
*/
headsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: heads.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

heads.form = headsForm

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::index
* @see app/Http/Controllers/Api/V1/UserKpiController.php:16
* @route '/api/v1/user-kpis'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/user-kpis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::index
* @see app/Http/Controllers/Api/V1/UserKpiController.php:16
* @route '/api/v1/user-kpis'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::index
* @see app/Http/Controllers/Api/V1/UserKpiController.php:16
* @route '/api/v1/user-kpis'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::index
* @see app/Http/Controllers/Api/V1/UserKpiController.php:16
* @route '/api/v1/user-kpis'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::index
* @see app/Http/Controllers/Api/V1/UserKpiController.php:16
* @route '/api/v1/user-kpis'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::index
* @see app/Http/Controllers/Api/V1/UserKpiController.php:16
* @route '/api/v1/user-kpis'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::index
* @see app/Http/Controllers/Api/V1/UserKpiController.php:16
* @route '/api/v1/user-kpis'
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
* @see \App\Http\Controllers\Api\V1\UserKpiController::store
* @see app/Http/Controllers/Api/V1/UserKpiController.php:55
* @route '/api/v1/user-kpis'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/user-kpis',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::store
* @see app/Http/Controllers/Api/V1/UserKpiController.php:55
* @route '/api/v1/user-kpis'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::store
* @see app/Http/Controllers/Api/V1/UserKpiController.php:55
* @route '/api/v1/user-kpis'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::store
* @see app/Http/Controllers/Api/V1/UserKpiController.php:55
* @route '/api/v1/user-kpis'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::store
* @see app/Http/Controllers/Api/V1/UserKpiController.php:55
* @route '/api/v1/user-kpis'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::show
* @see app/Http/Controllers/Api/V1/UserKpiController.php:0
* @route '/api/v1/user-kpis/{user_kpi}'
*/
export const show = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/user-kpis/{user_kpi}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::show
* @see app/Http/Controllers/Api/V1/UserKpiController.php:0
* @route '/api/v1/user-kpis/{user_kpi}'
*/
show.url = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user_kpi: args }
    }

    if (Array.isArray(args)) {
        args = {
            user_kpi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user_kpi: args.user_kpi,
    }

    return show.definition.url
            .replace('{user_kpi}', parsedArgs.user_kpi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::show
* @see app/Http/Controllers/Api/V1/UserKpiController.php:0
* @route '/api/v1/user-kpis/{user_kpi}'
*/
show.get = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::show
* @see app/Http/Controllers/Api/V1/UserKpiController.php:0
* @route '/api/v1/user-kpis/{user_kpi}'
*/
show.head = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::show
* @see app/Http/Controllers/Api/V1/UserKpiController.php:0
* @route '/api/v1/user-kpis/{user_kpi}'
*/
const showForm = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::show
* @see app/Http/Controllers/Api/V1/UserKpiController.php:0
* @route '/api/v1/user-kpis/{user_kpi}'
*/
showForm.get = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::show
* @see app/Http/Controllers/Api/V1/UserKpiController.php:0
* @route '/api/v1/user-kpis/{user_kpi}'
*/
showForm.head = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\UserKpiController::update
* @see app/Http/Controllers/Api/V1/UserKpiController.php:98
* @route '/api/v1/user-kpis/{user_kpi}'
*/
export const update = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/user-kpis/{user_kpi}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::update
* @see app/Http/Controllers/Api/V1/UserKpiController.php:98
* @route '/api/v1/user-kpis/{user_kpi}'
*/
update.url = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user_kpi: args }
    }

    if (Array.isArray(args)) {
        args = {
            user_kpi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user_kpi: args.user_kpi,
    }

    return update.definition.url
            .replace('{user_kpi}', parsedArgs.user_kpi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::update
* @see app/Http/Controllers/Api/V1/UserKpiController.php:98
* @route '/api/v1/user-kpis/{user_kpi}'
*/
update.put = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::update
* @see app/Http/Controllers/Api/V1/UserKpiController.php:98
* @route '/api/v1/user-kpis/{user_kpi}'
*/
update.patch = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::update
* @see app/Http/Controllers/Api/V1/UserKpiController.php:98
* @route '/api/v1/user-kpis/{user_kpi}'
*/
const updateForm = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::update
* @see app/Http/Controllers/Api/V1/UserKpiController.php:98
* @route '/api/v1/user-kpis/{user_kpi}'
*/
updateForm.put = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::update
* @see app/Http/Controllers/Api/V1/UserKpiController.php:98
* @route '/api/v1/user-kpis/{user_kpi}'
*/
updateForm.patch = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::destroy
* @see app/Http/Controllers/Api/V1/UserKpiController.php:141
* @route '/api/v1/user-kpis/{user_kpi}'
*/
export const destroy = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/user-kpis/{user_kpi}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::destroy
* @see app/Http/Controllers/Api/V1/UserKpiController.php:141
* @route '/api/v1/user-kpis/{user_kpi}'
*/
destroy.url = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user_kpi: args }
    }

    if (Array.isArray(args)) {
        args = {
            user_kpi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user_kpi: args.user_kpi,
    }

    return destroy.definition.url
            .replace('{user_kpi}', parsedArgs.user_kpi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::destroy
* @see app/Http/Controllers/Api/V1/UserKpiController.php:141
* @route '/api/v1/user-kpis/{user_kpi}'
*/
destroy.delete = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::destroy
* @see app/Http/Controllers/Api/V1/UserKpiController.php:141
* @route '/api/v1/user-kpis/{user_kpi}'
*/
const destroyForm = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\UserKpiController::destroy
* @see app/Http/Controllers/Api/V1/UserKpiController.php:141
* @route '/api/v1/user-kpis/{user_kpi}'
*/
destroyForm.delete = (args: { user_kpi: string | number } | [user_kpi: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const UserKpiController = { heads, index, store, show, update, destroy }

export default UserKpiController