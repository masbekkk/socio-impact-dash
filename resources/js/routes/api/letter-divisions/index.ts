import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::index
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:15
* @route '/api/v1/letter-divisions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/letter-divisions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::index
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:15
* @route '/api/v1/letter-divisions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::index
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:15
* @route '/api/v1/letter-divisions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::index
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:15
* @route '/api/v1/letter-divisions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::index
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:15
* @route '/api/v1/letter-divisions'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::index
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:15
* @route '/api/v1/letter-divisions'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::index
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:15
* @route '/api/v1/letter-divisions'
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
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::store
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:27
* @route '/api/v1/letter-divisions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/letter-divisions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::store
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:27
* @route '/api/v1/letter-divisions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::store
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:27
* @route '/api/v1/letter-divisions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::store
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:27
* @route '/api/v1/letter-divisions'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::store
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:27
* @route '/api/v1/letter-divisions'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::show
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:45
* @route '/api/v1/letter-divisions/{letter_division}'
*/
export const show = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/letter-divisions/{letter_division}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::show
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:45
* @route '/api/v1/letter-divisions/{letter_division}'
*/
show.url = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter_division: args }
    }

    if (Array.isArray(args)) {
        args = {
            letter_division: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        letter_division: args.letter_division,
    }

    return show.definition.url
            .replace('{letter_division}', parsedArgs.letter_division.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::show
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:45
* @route '/api/v1/letter-divisions/{letter_division}'
*/
show.get = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::show
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:45
* @route '/api/v1/letter-divisions/{letter_division}'
*/
show.head = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::show
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:45
* @route '/api/v1/letter-divisions/{letter_division}'
*/
const showForm = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::show
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:45
* @route '/api/v1/letter-divisions/{letter_division}'
*/
showForm.get = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::show
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:45
* @route '/api/v1/letter-divisions/{letter_division}'
*/
showForm.head = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::update
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:61
* @route '/api/v1/letter-divisions/{letter_division}'
*/
export const update = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/letter-divisions/{letter_division}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::update
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:61
* @route '/api/v1/letter-divisions/{letter_division}'
*/
update.url = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter_division: args }
    }

    if (Array.isArray(args)) {
        args = {
            letter_division: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        letter_division: args.letter_division,
    }

    return update.definition.url
            .replace('{letter_division}', parsedArgs.letter_division.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::update
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:61
* @route '/api/v1/letter-divisions/{letter_division}'
*/
update.put = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::update
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:61
* @route '/api/v1/letter-divisions/{letter_division}'
*/
update.patch = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::update
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:61
* @route '/api/v1/letter-divisions/{letter_division}'
*/
const updateForm = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::update
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:61
* @route '/api/v1/letter-divisions/{letter_division}'
*/
updateForm.put = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::update
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:61
* @route '/api/v1/letter-divisions/{letter_division}'
*/
updateForm.patch = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::destroy
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:85
* @route '/api/v1/letter-divisions/{letter_division}'
*/
export const destroy = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/letter-divisions/{letter_division}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::destroy
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:85
* @route '/api/v1/letter-divisions/{letter_division}'
*/
destroy.url = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter_division: args }
    }

    if (Array.isArray(args)) {
        args = {
            letter_division: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        letter_division: args.letter_division,
    }

    return destroy.definition.url
            .replace('{letter_division}', parsedArgs.letter_division.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::destroy
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:85
* @route '/api/v1/letter-divisions/{letter_division}'
*/
destroy.delete = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::destroy
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:85
* @route '/api/v1/letter-divisions/{letter_division}'
*/
const destroyForm = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterDivisionController::destroy
* @see app/Http/Controllers/Api/V1/LetterDivisionController.php:85
* @route '/api/v1/letter-divisions/{letter_division}'
*/
destroyForm.delete = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const letterDivisions = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default letterDivisions