import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::index
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:15
* @route '/api/v1/letter-codes'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/letter-codes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::index
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:15
* @route '/api/v1/letter-codes'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::index
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:15
* @route '/api/v1/letter-codes'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::index
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:15
* @route '/api/v1/letter-codes'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::index
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:15
* @route '/api/v1/letter-codes'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::index
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:15
* @route '/api/v1/letter-codes'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::index
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:15
* @route '/api/v1/letter-codes'
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
* @see \App\Http\Controllers\Api\V1\LetterCodeController::store
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:27
* @route '/api/v1/letter-codes'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/letter-codes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::store
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:27
* @route '/api/v1/letter-codes'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::store
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:27
* @route '/api/v1/letter-codes'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::store
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:27
* @route '/api/v1/letter-codes'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::store
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:27
* @route '/api/v1/letter-codes'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::show
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:45
* @route '/api/v1/letter-codes/{letter_code}'
*/
export const show = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/letter-codes/{letter_code}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::show
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:45
* @route '/api/v1/letter-codes/{letter_code}'
*/
show.url = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter_code: args }
    }

    if (Array.isArray(args)) {
        args = {
            letter_code: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        letter_code: args.letter_code,
    }

    return show.definition.url
            .replace('{letter_code}', parsedArgs.letter_code.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::show
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:45
* @route '/api/v1/letter-codes/{letter_code}'
*/
show.get = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::show
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:45
* @route '/api/v1/letter-codes/{letter_code}'
*/
show.head = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::show
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:45
* @route '/api/v1/letter-codes/{letter_code}'
*/
const showForm = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::show
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:45
* @route '/api/v1/letter-codes/{letter_code}'
*/
showForm.get = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::show
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:45
* @route '/api/v1/letter-codes/{letter_code}'
*/
showForm.head = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\LetterCodeController::update
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:61
* @route '/api/v1/letter-codes/{letter_code}'
*/
export const update = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/letter-codes/{letter_code}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::update
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:61
* @route '/api/v1/letter-codes/{letter_code}'
*/
update.url = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter_code: args }
    }

    if (Array.isArray(args)) {
        args = {
            letter_code: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        letter_code: args.letter_code,
    }

    return update.definition.url
            .replace('{letter_code}', parsedArgs.letter_code.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::update
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:61
* @route '/api/v1/letter-codes/{letter_code}'
*/
update.put = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::update
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:61
* @route '/api/v1/letter-codes/{letter_code}'
*/
update.patch = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::update
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:61
* @route '/api/v1/letter-codes/{letter_code}'
*/
const updateForm = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::update
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:61
* @route '/api/v1/letter-codes/{letter_code}'
*/
updateForm.put = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::update
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:61
* @route '/api/v1/letter-codes/{letter_code}'
*/
updateForm.patch = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\LetterCodeController::destroy
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:85
* @route '/api/v1/letter-codes/{letter_code}'
*/
export const destroy = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/letter-codes/{letter_code}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::destroy
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:85
* @route '/api/v1/letter-codes/{letter_code}'
*/
destroy.url = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter_code: args }
    }

    if (Array.isArray(args)) {
        args = {
            letter_code: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        letter_code: args.letter_code,
    }

    return destroy.definition.url
            .replace('{letter_code}', parsedArgs.letter_code.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::destroy
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:85
* @route '/api/v1/letter-codes/{letter_code}'
*/
destroy.delete = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::destroy
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:85
* @route '/api/v1/letter-codes/{letter_code}'
*/
const destroyForm = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterCodeController::destroy
* @see app/Http/Controllers/Api/V1/LetterCodeController.php:85
* @route '/api/v1/letter-codes/{letter_code}'
*/
destroyForm.delete = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const LetterCodeController = { index, store, show, update, destroy }

export default LetterCodeController