import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LetterRequestController::index
* @see app/Http/Controllers/LetterRequestController.php:18
* @route '/letter-requests'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/letter-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterRequestController::index
* @see app/Http/Controllers/LetterRequestController.php:18
* @route '/letter-requests'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterRequestController::index
* @see app/Http/Controllers/LetterRequestController.php:18
* @route '/letter-requests'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterRequestController::index
* @see app/Http/Controllers/LetterRequestController.php:18
* @route '/letter-requests'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LetterRequestController::index
* @see app/Http/Controllers/LetterRequestController.php:18
* @route '/letter-requests'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterRequestController::index
* @see app/Http/Controllers/LetterRequestController.php:18
* @route '/letter-requests'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterRequestController::index
* @see app/Http/Controllers/LetterRequestController.php:18
* @route '/letter-requests'
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
* @see \App\Http\Controllers\LetterRequestController::create
* @see app/Http/Controllers/LetterRequestController.php:28
* @route '/letter-requests/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/letter-requests/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterRequestController::create
* @see app/Http/Controllers/LetterRequestController.php:28
* @route '/letter-requests/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterRequestController::create
* @see app/Http/Controllers/LetterRequestController.php:28
* @route '/letter-requests/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterRequestController::create
* @see app/Http/Controllers/LetterRequestController.php:28
* @route '/letter-requests/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LetterRequestController::create
* @see app/Http/Controllers/LetterRequestController.php:28
* @route '/letter-requests/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterRequestController::create
* @see app/Http/Controllers/LetterRequestController.php:28
* @route '/letter-requests/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterRequestController::create
* @see app/Http/Controllers/LetterRequestController.php:28
* @route '/letter-requests/create'
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
* @see \App\Http\Controllers\LetterRequestController::store
* @see app/Http/Controllers/LetterRequestController.php:43
* @route '/letter-requests'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/letter-requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LetterRequestController::store
* @see app/Http/Controllers/LetterRequestController.php:43
* @route '/letter-requests'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterRequestController::store
* @see app/Http/Controllers/LetterRequestController.php:43
* @route '/letter-requests'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LetterRequestController::store
* @see app/Http/Controllers/LetterRequestController.php:43
* @route '/letter-requests'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LetterRequestController::store
* @see app/Http/Controllers/LetterRequestController.php:43
* @route '/letter-requests'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\LetterRequestController::edit
* @see app/Http/Controllers/LetterRequestController.php:35
* @route '/letter-requests/{letter_request}/edit'
*/
export const edit = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/letter-requests/{letter_request}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterRequestController::edit
* @see app/Http/Controllers/LetterRequestController.php:35
* @route '/letter-requests/{letter_request}/edit'
*/
edit.url = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter_request: args }
    }

    if (Array.isArray(args)) {
        args = {
            letter_request: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        letter_request: args.letter_request,
    }

    return edit.definition.url
            .replace('{letter_request}', parsedArgs.letter_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterRequestController::edit
* @see app/Http/Controllers/LetterRequestController.php:35
* @route '/letter-requests/{letter_request}/edit'
*/
edit.get = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterRequestController::edit
* @see app/Http/Controllers/LetterRequestController.php:35
* @route '/letter-requests/{letter_request}/edit'
*/
edit.head = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LetterRequestController::edit
* @see app/Http/Controllers/LetterRequestController.php:35
* @route '/letter-requests/{letter_request}/edit'
*/
const editForm = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterRequestController::edit
* @see app/Http/Controllers/LetterRequestController.php:35
* @route '/letter-requests/{letter_request}/edit'
*/
editForm.get = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LetterRequestController::edit
* @see app/Http/Controllers/LetterRequestController.php:35
* @route '/letter-requests/{letter_request}/edit'
*/
editForm.head = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\LetterRequestController::assignNumber
* @see app/Http/Controllers/LetterRequestController.php:62
* @route '/letter-requests/{letter_request}/assign'
*/
export const assignNumber = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignNumber.url(args, options),
    method: 'post',
})

assignNumber.definition = {
    methods: ["post"],
    url: '/letter-requests/{letter_request}/assign',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LetterRequestController::assignNumber
* @see app/Http/Controllers/LetterRequestController.php:62
* @route '/letter-requests/{letter_request}/assign'
*/
assignNumber.url = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter_request: args }
    }

    if (Array.isArray(args)) {
        args = {
            letter_request: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        letter_request: args.letter_request,
    }

    return assignNumber.definition.url
            .replace('{letter_request}', parsedArgs.letter_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterRequestController::assignNumber
* @see app/Http/Controllers/LetterRequestController.php:62
* @route '/letter-requests/{letter_request}/assign'
*/
assignNumber.post = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignNumber.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LetterRequestController::assignNumber
* @see app/Http/Controllers/LetterRequestController.php:62
* @route '/letter-requests/{letter_request}/assign'
*/
const assignNumberForm = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: assignNumber.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LetterRequestController::assignNumber
* @see app/Http/Controllers/LetterRequestController.php:62
* @route '/letter-requests/{letter_request}/assign'
*/
assignNumberForm.post = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: assignNumber.url(args, options),
    method: 'post',
})

assignNumber.form = assignNumberForm

/**
* @see \App\Http\Controllers\LetterRequestController::reject
* @see app/Http/Controllers/LetterRequestController.php:79
* @route '/letter-requests/{letter_request}/reject'
*/
export const reject = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/letter-requests/{letter_request}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LetterRequestController::reject
* @see app/Http/Controllers/LetterRequestController.php:79
* @route '/letter-requests/{letter_request}/reject'
*/
reject.url = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter_request: args }
    }

    if (Array.isArray(args)) {
        args = {
            letter_request: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        letter_request: args.letter_request,
    }

    return reject.definition.url
            .replace('{letter_request}', parsedArgs.letter_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterRequestController::reject
* @see app/Http/Controllers/LetterRequestController.php:79
* @route '/letter-requests/{letter_request}/reject'
*/
reject.post = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LetterRequestController::reject
* @see app/Http/Controllers/LetterRequestController.php:79
* @route '/letter-requests/{letter_request}/reject'
*/
const rejectForm = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LetterRequestController::reject
* @see app/Http/Controllers/LetterRequestController.php:79
* @route '/letter-requests/{letter_request}/reject'
*/
rejectForm.post = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

const LetterRequestController = { index, create, store, edit, assignNumber, reject }

export default LetterRequestController