import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PresenceController::index
* @see app/Http/Controllers/PresenceController.php:20
* @route '/presences'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/presences',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PresenceController::index
* @see app/Http/Controllers/PresenceController.php:20
* @route '/presences'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PresenceController::index
* @see app/Http/Controllers/PresenceController.php:20
* @route '/presences'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PresenceController::index
* @see app/Http/Controllers/PresenceController.php:20
* @route '/presences'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PresenceController::index
* @see app/Http/Controllers/PresenceController.php:20
* @route '/presences'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PresenceController::index
* @see app/Http/Controllers/PresenceController.php:20
* @route '/presences'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PresenceController::index
* @see app/Http/Controllers/PresenceController.php:20
* @route '/presences'
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
* @see \App\Http\Controllers\PresenceController::create
* @see app/Http/Controllers/PresenceController.php:48
* @route '/presences/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/presences/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PresenceController::create
* @see app/Http/Controllers/PresenceController.php:48
* @route '/presences/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PresenceController::create
* @see app/Http/Controllers/PresenceController.php:48
* @route '/presences/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PresenceController::create
* @see app/Http/Controllers/PresenceController.php:48
* @route '/presences/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PresenceController::create
* @see app/Http/Controllers/PresenceController.php:48
* @route '/presences/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PresenceController::create
* @see app/Http/Controllers/PresenceController.php:48
* @route '/presences/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PresenceController::create
* @see app/Http/Controllers/PresenceController.php:48
* @route '/presences/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\PresenceController::store
* @see app/Http/Controllers/PresenceController.php:60
* @route '/presences'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/presences',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PresenceController::store
* @see app/Http/Controllers/PresenceController.php:60
* @route '/presences'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PresenceController::store
* @see app/Http/Controllers/PresenceController.php:60
* @route '/presences'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PresenceController::store
* @see app/Http/Controllers/PresenceController.php:60
* @route '/presences'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PresenceController::store
* @see app/Http/Controllers/PresenceController.php:60
* @route '/presences'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PresenceController::show
* @see app/Http/Controllers/PresenceController.php:95
* @route '/presences/{presence}'
*/
export const show = (args: { presence: string | number | { id: string | number } } | [presence: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/presences/{presence}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PresenceController::show
* @see app/Http/Controllers/PresenceController.php:95
* @route '/presences/{presence}'
*/
show.url = (args: { presence: string | number | { id: string | number } } | [presence: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { presence: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { presence: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            presence: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        presence: typeof args.presence === 'object'
        ? args.presence.id
        : args.presence,
    }

    return show.definition.url
            .replace('{presence}', parsedArgs.presence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PresenceController::show
* @see app/Http/Controllers/PresenceController.php:95
* @route '/presences/{presence}'
*/
show.get = (args: { presence: string | number | { id: string | number } } | [presence: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PresenceController::show
* @see app/Http/Controllers/PresenceController.php:95
* @route '/presences/{presence}'
*/
show.head = (args: { presence: string | number | { id: string | number } } | [presence: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PresenceController::show
* @see app/Http/Controllers/PresenceController.php:95
* @route '/presences/{presence}'
*/
const showForm = (args: { presence: string | number | { id: string | number } } | [presence: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PresenceController::show
* @see app/Http/Controllers/PresenceController.php:95
* @route '/presences/{presence}'
*/
showForm.get = (args: { presence: string | number | { id: string | number } } | [presence: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PresenceController::show
* @see app/Http/Controllers/PresenceController.php:95
* @route '/presences/{presence}'
*/
showForm.head = (args: { presence: string | number | { id: string | number } } | [presence: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PresenceController::checkOut
* @see app/Http/Controllers/PresenceController.php:81
* @route '/presences/checkout'
*/
export const checkOut = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkOut.url(options),
    method: 'post',
})

checkOut.definition = {
    methods: ["post"],
    url: '/presences/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PresenceController::checkOut
* @see app/Http/Controllers/PresenceController.php:81
* @route '/presences/checkout'
*/
checkOut.url = (options?: RouteQueryOptions) => {
    return checkOut.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PresenceController::checkOut
* @see app/Http/Controllers/PresenceController.php:81
* @route '/presences/checkout'
*/
checkOut.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkOut.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PresenceController::checkOut
* @see app/Http/Controllers/PresenceController.php:81
* @route '/presences/checkout'
*/
const checkOutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: checkOut.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PresenceController::checkOut
* @see app/Http/Controllers/PresenceController.php:81
* @route '/presences/checkout'
*/
checkOutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: checkOut.url(options),
    method: 'post',
})

checkOut.form = checkOutForm

const PresenceController = { index, create, store, show, checkOut }

export default PresenceController