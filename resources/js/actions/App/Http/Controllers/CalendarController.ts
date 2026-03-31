import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CalendarController::index
* @see app/Http/Controllers/CalendarController.php:15
* @route '/api/v1/calendar'
*/
const index02d0067817fb4b358721e2cbb9483d42 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index02d0067817fb4b358721e2cbb9483d42.url(options),
    method: 'get',
})

index02d0067817fb4b358721e2cbb9483d42.definition = {
    methods: ["get","head"],
    url: '/api/v1/calendar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CalendarController::index
* @see app/Http/Controllers/CalendarController.php:15
* @route '/api/v1/calendar'
*/
index02d0067817fb4b358721e2cbb9483d42.url = (options?: RouteQueryOptions) => {
    return index02d0067817fb4b358721e2cbb9483d42.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarController::index
* @see app/Http/Controllers/CalendarController.php:15
* @route '/api/v1/calendar'
*/
index02d0067817fb4b358721e2cbb9483d42.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index02d0067817fb4b358721e2cbb9483d42.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::index
* @see app/Http/Controllers/CalendarController.php:15
* @route '/api/v1/calendar'
*/
index02d0067817fb4b358721e2cbb9483d42.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index02d0067817fb4b358721e2cbb9483d42.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CalendarController::index
* @see app/Http/Controllers/CalendarController.php:15
* @route '/api/v1/calendar'
*/
const index02d0067817fb4b358721e2cbb9483d42Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index02d0067817fb4b358721e2cbb9483d42.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::index
* @see app/Http/Controllers/CalendarController.php:15
* @route '/api/v1/calendar'
*/
index02d0067817fb4b358721e2cbb9483d42Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index02d0067817fb4b358721e2cbb9483d42.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::index
* @see app/Http/Controllers/CalendarController.php:15
* @route '/api/v1/calendar'
*/
index02d0067817fb4b358721e2cbb9483d42Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index02d0067817fb4b358721e2cbb9483d42.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index02d0067817fb4b358721e2cbb9483d42.form = index02d0067817fb4b358721e2cbb9483d42Form
/**
* @see \App\Http\Controllers\CalendarController::index
* @see app/Http/Controllers/CalendarController.php:15
* @route '/calendar'
*/
const indexb779617412a951269ff402230939ace7 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexb779617412a951269ff402230939ace7.url(options),
    method: 'get',
})

indexb779617412a951269ff402230939ace7.definition = {
    methods: ["get","head"],
    url: '/calendar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CalendarController::index
* @see app/Http/Controllers/CalendarController.php:15
* @route '/calendar'
*/
indexb779617412a951269ff402230939ace7.url = (options?: RouteQueryOptions) => {
    return indexb779617412a951269ff402230939ace7.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarController::index
* @see app/Http/Controllers/CalendarController.php:15
* @route '/calendar'
*/
indexb779617412a951269ff402230939ace7.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexb779617412a951269ff402230939ace7.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::index
* @see app/Http/Controllers/CalendarController.php:15
* @route '/calendar'
*/
indexb779617412a951269ff402230939ace7.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexb779617412a951269ff402230939ace7.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CalendarController::index
* @see app/Http/Controllers/CalendarController.php:15
* @route '/calendar'
*/
const indexb779617412a951269ff402230939ace7Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexb779617412a951269ff402230939ace7.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::index
* @see app/Http/Controllers/CalendarController.php:15
* @route '/calendar'
*/
indexb779617412a951269ff402230939ace7Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexb779617412a951269ff402230939ace7.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::index
* @see app/Http/Controllers/CalendarController.php:15
* @route '/calendar'
*/
indexb779617412a951269ff402230939ace7Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexb779617412a951269ff402230939ace7.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexb779617412a951269ff402230939ace7.form = indexb779617412a951269ff402230939ace7Form

export const index = {
    '/api/v1/calendar': index02d0067817fb4b358721e2cbb9483d42,
    '/calendar': indexb779617412a951269ff402230939ace7,
}

/**
* @see \App\Http\Controllers\CalendarController::store
* @see app/Http/Controllers/CalendarController.php:36
* @route '/api/v1/calendar'
*/
const store02d0067817fb4b358721e2cbb9483d42 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store02d0067817fb4b358721e2cbb9483d42.url(options),
    method: 'post',
})

store02d0067817fb4b358721e2cbb9483d42.definition = {
    methods: ["post"],
    url: '/api/v1/calendar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CalendarController::store
* @see app/Http/Controllers/CalendarController.php:36
* @route '/api/v1/calendar'
*/
store02d0067817fb4b358721e2cbb9483d42.url = (options?: RouteQueryOptions) => {
    return store02d0067817fb4b358721e2cbb9483d42.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarController::store
* @see app/Http/Controllers/CalendarController.php:36
* @route '/api/v1/calendar'
*/
store02d0067817fb4b358721e2cbb9483d42.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store02d0067817fb4b358721e2cbb9483d42.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CalendarController::store
* @see app/Http/Controllers/CalendarController.php:36
* @route '/api/v1/calendar'
*/
const store02d0067817fb4b358721e2cbb9483d42Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store02d0067817fb4b358721e2cbb9483d42.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CalendarController::store
* @see app/Http/Controllers/CalendarController.php:36
* @route '/api/v1/calendar'
*/
store02d0067817fb4b358721e2cbb9483d42Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store02d0067817fb4b358721e2cbb9483d42.url(options),
    method: 'post',
})

store02d0067817fb4b358721e2cbb9483d42.form = store02d0067817fb4b358721e2cbb9483d42Form
/**
* @see \App\Http\Controllers\CalendarController::store
* @see app/Http/Controllers/CalendarController.php:36
* @route '/calendar'
*/
const storeb779617412a951269ff402230939ace7 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeb779617412a951269ff402230939ace7.url(options),
    method: 'post',
})

storeb779617412a951269ff402230939ace7.definition = {
    methods: ["post"],
    url: '/calendar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CalendarController::store
* @see app/Http/Controllers/CalendarController.php:36
* @route '/calendar'
*/
storeb779617412a951269ff402230939ace7.url = (options?: RouteQueryOptions) => {
    return storeb779617412a951269ff402230939ace7.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarController::store
* @see app/Http/Controllers/CalendarController.php:36
* @route '/calendar'
*/
storeb779617412a951269ff402230939ace7.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeb779617412a951269ff402230939ace7.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CalendarController::store
* @see app/Http/Controllers/CalendarController.php:36
* @route '/calendar'
*/
const storeb779617412a951269ff402230939ace7Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeb779617412a951269ff402230939ace7.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CalendarController::store
* @see app/Http/Controllers/CalendarController.php:36
* @route '/calendar'
*/
storeb779617412a951269ff402230939ace7Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeb779617412a951269ff402230939ace7.url(options),
    method: 'post',
})

storeb779617412a951269ff402230939ace7.form = storeb779617412a951269ff402230939ace7Form

export const store = {
    '/api/v1/calendar': store02d0067817fb4b358721e2cbb9483d42,
    '/calendar': storeb779617412a951269ff402230939ace7,
}

/**
* @see \App\Http\Controllers\CalendarController::destroy
* @see app/Http/Controllers/CalendarController.php:61
* @route '/api/v1/calendar/{id}'
*/
const destroyc1c6df969060372c4b1ddb801ab16330 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyc1c6df969060372c4b1ddb801ab16330.url(args, options),
    method: 'delete',
})

destroyc1c6df969060372c4b1ddb801ab16330.definition = {
    methods: ["delete"],
    url: '/api/v1/calendar/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CalendarController::destroy
* @see app/Http/Controllers/CalendarController.php:61
* @route '/api/v1/calendar/{id}'
*/
destroyc1c6df969060372c4b1ddb801ab16330.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return destroyc1c6df969060372c4b1ddb801ab16330.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarController::destroy
* @see app/Http/Controllers/CalendarController.php:61
* @route '/api/v1/calendar/{id}'
*/
destroyc1c6df969060372c4b1ddb801ab16330.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyc1c6df969060372c4b1ddb801ab16330.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CalendarController::destroy
* @see app/Http/Controllers/CalendarController.php:61
* @route '/api/v1/calendar/{id}'
*/
const destroyc1c6df969060372c4b1ddb801ab16330Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyc1c6df969060372c4b1ddb801ab16330.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CalendarController::destroy
* @see app/Http/Controllers/CalendarController.php:61
* @route '/api/v1/calendar/{id}'
*/
destroyc1c6df969060372c4b1ddb801ab16330Form.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyc1c6df969060372c4b1ddb801ab16330.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyc1c6df969060372c4b1ddb801ab16330.form = destroyc1c6df969060372c4b1ddb801ab16330Form
/**
* @see \App\Http\Controllers\CalendarController::destroy
* @see app/Http/Controllers/CalendarController.php:61
* @route '/calendar/{id}'
*/
const destroy3e1656746725ce0511ab8ce241a81420 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy3e1656746725ce0511ab8ce241a81420.url(args, options),
    method: 'delete',
})

destroy3e1656746725ce0511ab8ce241a81420.definition = {
    methods: ["delete"],
    url: '/calendar/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CalendarController::destroy
* @see app/Http/Controllers/CalendarController.php:61
* @route '/calendar/{id}'
*/
destroy3e1656746725ce0511ab8ce241a81420.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return destroy3e1656746725ce0511ab8ce241a81420.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarController::destroy
* @see app/Http/Controllers/CalendarController.php:61
* @route '/calendar/{id}'
*/
destroy3e1656746725ce0511ab8ce241a81420.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy3e1656746725ce0511ab8ce241a81420.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CalendarController::destroy
* @see app/Http/Controllers/CalendarController.php:61
* @route '/calendar/{id}'
*/
const destroy3e1656746725ce0511ab8ce241a81420Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy3e1656746725ce0511ab8ce241a81420.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CalendarController::destroy
* @see app/Http/Controllers/CalendarController.php:61
* @route '/calendar/{id}'
*/
destroy3e1656746725ce0511ab8ce241a81420Form.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy3e1656746725ce0511ab8ce241a81420.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy3e1656746725ce0511ab8ce241a81420.form = destroy3e1656746725ce0511ab8ce241a81420Form

export const destroy = {
    '/api/v1/calendar/{id}': destroyc1c6df969060372c4b1ddb801ab16330,
    '/calendar/{id}': destroy3e1656746725ce0511ab8ce241a81420,
}

/**
* @see \App\Http\Controllers\CalendarController::show
* @see app/Http/Controllers/CalendarController.php:53
* @route '/calendar/day/{date}'
*/
export const show = (args: { date: string | number } | [date: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/calendar/day/{date}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CalendarController::show
* @see app/Http/Controllers/CalendarController.php:53
* @route '/calendar/day/{date}'
*/
show.url = (args: { date: string | number } | [date: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { date: args }
    }

    if (Array.isArray(args)) {
        args = {
            date: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        date: args.date,
    }

    return show.definition.url
            .replace('{date}', parsedArgs.date.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarController::show
* @see app/Http/Controllers/CalendarController.php:53
* @route '/calendar/day/{date}'
*/
show.get = (args: { date: string | number } | [date: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::show
* @see app/Http/Controllers/CalendarController.php:53
* @route '/calendar/day/{date}'
*/
show.head = (args: { date: string | number } | [date: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CalendarController::show
* @see app/Http/Controllers/CalendarController.php:53
* @route '/calendar/day/{date}'
*/
const showForm = (args: { date: string | number } | [date: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::show
* @see app/Http/Controllers/CalendarController.php:53
* @route '/calendar/day/{date}'
*/
showForm.get = (args: { date: string | number } | [date: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::show
* @see app/Http/Controllers/CalendarController.php:53
* @route '/calendar/day/{date}'
*/
showForm.head = (args: { date: string | number } | [date: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const CalendarController = { index, store, destroy, show }

export default CalendarController