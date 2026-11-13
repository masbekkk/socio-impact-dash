import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\DivisionController::index
* @see app/Http/Controllers/Api/V1/DivisionController.php:18
* @route '/api/v1/divisions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/divisions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::index
* @see app/Http/Controllers/Api/V1/DivisionController.php:18
* @route '/api/v1/divisions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::index
* @see app/Http/Controllers/Api/V1/DivisionController.php:18
* @route '/api/v1/divisions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::index
* @see app/Http/Controllers/Api/V1/DivisionController.php:18
* @route '/api/v1/divisions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::index
* @see app/Http/Controllers/Api/V1/DivisionController.php:18
* @route '/api/v1/divisions'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::index
* @see app/Http/Controllers/Api/V1/DivisionController.php:18
* @route '/api/v1/divisions'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::index
* @see app/Http/Controllers/Api/V1/DivisionController.php:18
* @route '/api/v1/divisions'
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
* @see \App\Http\Controllers\Api\V1\DivisionController::store
* @see app/Http/Controllers/Api/V1/DivisionController.php:41
* @route '/api/v1/divisions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/divisions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::store
* @see app/Http/Controllers/Api/V1/DivisionController.php:41
* @route '/api/v1/divisions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::store
* @see app/Http/Controllers/Api/V1/DivisionController.php:41
* @route '/api/v1/divisions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::store
* @see app/Http/Controllers/Api/V1/DivisionController.php:41
* @route '/api/v1/divisions'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::store
* @see app/Http/Controllers/Api/V1/DivisionController.php:41
* @route '/api/v1/divisions'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::show
* @see app/Http/Controllers/Api/V1/DivisionController.php:70
* @route '/api/v1/divisions/{division}'
*/
export const show = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/divisions/{division}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::show
* @see app/Http/Controllers/Api/V1/DivisionController.php:70
* @route '/api/v1/divisions/{division}'
*/
show.url = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { division: args }
    }

    if (Array.isArray(args)) {
        args = {
            division: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        division: args.division,
    }

    return show.definition.url
            .replace('{division}', parsedArgs.division.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::show
* @see app/Http/Controllers/Api/V1/DivisionController.php:70
* @route '/api/v1/divisions/{division}'
*/
show.get = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::show
* @see app/Http/Controllers/Api/V1/DivisionController.php:70
* @route '/api/v1/divisions/{division}'
*/
show.head = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::show
* @see app/Http/Controllers/Api/V1/DivisionController.php:70
* @route '/api/v1/divisions/{division}'
*/
const showForm = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::show
* @see app/Http/Controllers/Api/V1/DivisionController.php:70
* @route '/api/v1/divisions/{division}'
*/
showForm.get = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::show
* @see app/Http/Controllers/Api/V1/DivisionController.php:70
* @route '/api/v1/divisions/{division}'
*/
showForm.head = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\DivisionController::update
* @see app/Http/Controllers/Api/V1/DivisionController.php:89
* @route '/api/v1/divisions/{division}'
*/
export const update = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/divisions/{division}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::update
* @see app/Http/Controllers/Api/V1/DivisionController.php:89
* @route '/api/v1/divisions/{division}'
*/
update.url = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { division: args }
    }

    if (Array.isArray(args)) {
        args = {
            division: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        division: args.division,
    }

    return update.definition.url
            .replace('{division}', parsedArgs.division.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::update
* @see app/Http/Controllers/Api/V1/DivisionController.php:89
* @route '/api/v1/divisions/{division}'
*/
update.put = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::update
* @see app/Http/Controllers/Api/V1/DivisionController.php:89
* @route '/api/v1/divisions/{division}'
*/
update.patch = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::update
* @see app/Http/Controllers/Api/V1/DivisionController.php:89
* @route '/api/v1/divisions/{division}'
*/
const updateForm = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::update
* @see app/Http/Controllers/Api/V1/DivisionController.php:89
* @route '/api/v1/divisions/{division}'
*/
updateForm.put = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::update
* @see app/Http/Controllers/Api/V1/DivisionController.php:89
* @route '/api/v1/divisions/{division}'
*/
updateForm.patch = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\DivisionController::destroy
* @see app/Http/Controllers/Api/V1/DivisionController.php:120
* @route '/api/v1/divisions/{division}'
*/
export const destroy = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/divisions/{division}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::destroy
* @see app/Http/Controllers/Api/V1/DivisionController.php:120
* @route '/api/v1/divisions/{division}'
*/
destroy.url = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { division: args }
    }

    if (Array.isArray(args)) {
        args = {
            division: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        division: args.division,
    }

    return destroy.definition.url
            .replace('{division}', parsedArgs.division.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::destroy
* @see app/Http/Controllers/Api/V1/DivisionController.php:120
* @route '/api/v1/divisions/{division}'
*/
destroy.delete = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::destroy
* @see app/Http/Controllers/Api/V1/DivisionController.php:120
* @route '/api/v1/divisions/{division}'
*/
const destroyForm = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\DivisionController::destroy
* @see app/Http/Controllers/Api/V1/DivisionController.php:120
* @route '/api/v1/divisions/{division}'
*/
destroyForm.delete = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const divisions = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default divisions