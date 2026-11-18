import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\LeaveController::index
* @see app/Http/Controllers/Api/V1/LeaveController.php:30
* @route '/api/v1/leaves'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/leaves',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::index
* @see app/Http/Controllers/Api/V1/LeaveController.php:30
* @route '/api/v1/leaves'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::index
* @see app/Http/Controllers/Api/V1/LeaveController.php:30
* @route '/api/v1/leaves'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::index
* @see app/Http/Controllers/Api/V1/LeaveController.php:30
* @route '/api/v1/leaves'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::index
* @see app/Http/Controllers/Api/V1/LeaveController.php:30
* @route '/api/v1/leaves'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::index
* @see app/Http/Controllers/Api/V1/LeaveController.php:30
* @route '/api/v1/leaves'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::index
* @see app/Http/Controllers/Api/V1/LeaveController.php:30
* @route '/api/v1/leaves'
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
* @see \App\Http\Controllers\Api\V1\LeaveController::store
* @see app/Http/Controllers/Api/V1/LeaveController.php:48
* @route '/api/v1/leaves'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/leaves',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::store
* @see app/Http/Controllers/Api/V1/LeaveController.php:48
* @route '/api/v1/leaves'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::store
* @see app/Http/Controllers/Api/V1/LeaveController.php:48
* @route '/api/v1/leaves'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::store
* @see app/Http/Controllers/Api/V1/LeaveController.php:48
* @route '/api/v1/leaves'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::store
* @see app/Http/Controllers/Api/V1/LeaveController.php:48
* @route '/api/v1/leaves'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::show
* @see app/Http/Controllers/Api/V1/LeaveController.php:41
* @route '/api/v1/leaves/{leaf}'
*/
export const show = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/leaves/{leaf}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::show
* @see app/Http/Controllers/Api/V1/LeaveController.php:41
* @route '/api/v1/leaves/{leaf}'
*/
show.url = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leaf: args }
    }

    if (Array.isArray(args)) {
        args = {
            leaf: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leaf: args.leaf,
    }

    return show.definition.url
            .replace('{leaf}', parsedArgs.leaf.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::show
* @see app/Http/Controllers/Api/V1/LeaveController.php:41
* @route '/api/v1/leaves/{leaf}'
*/
show.get = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::show
* @see app/Http/Controllers/Api/V1/LeaveController.php:41
* @route '/api/v1/leaves/{leaf}'
*/
show.head = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::show
* @see app/Http/Controllers/Api/V1/LeaveController.php:41
* @route '/api/v1/leaves/{leaf}'
*/
const showForm = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::show
* @see app/Http/Controllers/Api/V1/LeaveController.php:41
* @route '/api/v1/leaves/{leaf}'
*/
showForm.get = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::show
* @see app/Http/Controllers/Api/V1/LeaveController.php:41
* @route '/api/v1/leaves/{leaf}'
*/
showForm.head = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\LeaveController::update
* @see app/Http/Controllers/Api/V1/LeaveController.php:155
* @route '/api/v1/leaves/{leaf}'
*/
export const update = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/leaves/{leaf}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::update
* @see app/Http/Controllers/Api/V1/LeaveController.php:155
* @route '/api/v1/leaves/{leaf}'
*/
update.url = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leaf: args }
    }

    if (Array.isArray(args)) {
        args = {
            leaf: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leaf: args.leaf,
    }

    return update.definition.url
            .replace('{leaf}', parsedArgs.leaf.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::update
* @see app/Http/Controllers/Api/V1/LeaveController.php:155
* @route '/api/v1/leaves/{leaf}'
*/
update.put = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::update
* @see app/Http/Controllers/Api/V1/LeaveController.php:155
* @route '/api/v1/leaves/{leaf}'
*/
update.patch = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::update
* @see app/Http/Controllers/Api/V1/LeaveController.php:155
* @route '/api/v1/leaves/{leaf}'
*/
const updateForm = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::update
* @see app/Http/Controllers/Api/V1/LeaveController.php:155
* @route '/api/v1/leaves/{leaf}'
*/
updateForm.put = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::update
* @see app/Http/Controllers/Api/V1/LeaveController.php:155
* @route '/api/v1/leaves/{leaf}'
*/
updateForm.patch = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\LeaveController::destroy
* @see app/Http/Controllers/Api/V1/LeaveController.php:215
* @route '/api/v1/leaves/{leaf}'
*/
export const destroy = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/leaves/{leaf}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::destroy
* @see app/Http/Controllers/Api/V1/LeaveController.php:215
* @route '/api/v1/leaves/{leaf}'
*/
destroy.url = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leaf: args }
    }

    if (Array.isArray(args)) {
        args = {
            leaf: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leaf: args.leaf,
    }

    return destroy.definition.url
            .replace('{leaf}', parsedArgs.leaf.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::destroy
* @see app/Http/Controllers/Api/V1/LeaveController.php:215
* @route '/api/v1/leaves/{leaf}'
*/
destroy.delete = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::destroy
* @see app/Http/Controllers/Api/V1/LeaveController.php:215
* @route '/api/v1/leaves/{leaf}'
*/
const destroyForm = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LeaveController::destroy
* @see app/Http/Controllers/Api/V1/LeaveController.php:215
* @route '/api/v1/leaves/{leaf}'
*/
destroyForm.delete = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const leaves = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default leaves