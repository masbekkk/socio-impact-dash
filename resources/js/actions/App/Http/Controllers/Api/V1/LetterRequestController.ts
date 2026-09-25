import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::index
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:21
* @route '/api/v1/letter-requests'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/letter-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::index
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:21
* @route '/api/v1/letter-requests'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::index
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:21
* @route '/api/v1/letter-requests'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::index
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:21
* @route '/api/v1/letter-requests'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::index
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:21
* @route '/api/v1/letter-requests'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::index
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:21
* @route '/api/v1/letter-requests'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::index
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:21
* @route '/api/v1/letter-requests'
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
* @see \App\Http\Controllers\Api\V1\LetterRequestController::store
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:91
* @route '/api/v1/letter-requests'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/letter-requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::store
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:91
* @route '/api/v1/letter-requests'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::store
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:91
* @route '/api/v1/letter-requests'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::store
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:91
* @route '/api/v1/letter-requests'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::store
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:91
* @route '/api/v1/letter-requests'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::show
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:69
* @route '/api/v1/letter-requests/{letter_request}'
*/
export const show = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/letter-requests/{letter_request}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::show
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:69
* @route '/api/v1/letter-requests/{letter_request}'
*/
show.url = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{letter_request}', parsedArgs.letter_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::show
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:69
* @route '/api/v1/letter-requests/{letter_request}'
*/
show.get = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::show
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:69
* @route '/api/v1/letter-requests/{letter_request}'
*/
show.head = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::show
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:69
* @route '/api/v1/letter-requests/{letter_request}'
*/
const showForm = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::show
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:69
* @route '/api/v1/letter-requests/{letter_request}'
*/
showForm.get = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::show
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:69
* @route '/api/v1/letter-requests/{letter_request}'
*/
showForm.head = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\LetterRequestController::update
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:140
* @route '/api/v1/letter-requests/{letter_request}'
*/
export const update = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/letter-requests/{letter_request}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::update
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:140
* @route '/api/v1/letter-requests/{letter_request}'
*/
update.url = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{letter_request}', parsedArgs.letter_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::update
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:140
* @route '/api/v1/letter-requests/{letter_request}'
*/
update.put = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::update
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:140
* @route '/api/v1/letter-requests/{letter_request}'
*/
update.patch = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::update
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:140
* @route '/api/v1/letter-requests/{letter_request}'
*/
const updateForm = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::update
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:140
* @route '/api/v1/letter-requests/{letter_request}'
*/
updateForm.put = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::update
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:140
* @route '/api/v1/letter-requests/{letter_request}'
*/
updateForm.patch = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\LetterRequestController::destroy
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:324
* @route '/api/v1/letter-requests/{letter_request}'
*/
export const destroy = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/letter-requests/{letter_request}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::destroy
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:324
* @route '/api/v1/letter-requests/{letter_request}'
*/
destroy.url = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{letter_request}', parsedArgs.letter_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::destroy
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:324
* @route '/api/v1/letter-requests/{letter_request}'
*/
destroy.delete = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::destroy
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:324
* @route '/api/v1/letter-requests/{letter_request}'
*/
const destroyForm = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::destroy
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:324
* @route '/api/v1/letter-requests/{letter_request}'
*/
destroyForm.delete = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::assignNumber
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:342
* @route '/api/v1/letter-requests/{letter_request}/assign'
*/
export const assignNumber = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignNumber.url(args, options),
    method: 'post',
})

assignNumber.definition = {
    methods: ["post"],
    url: '/api/v1/letter-requests/{letter_request}/assign',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::assignNumber
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:342
* @route '/api/v1/letter-requests/{letter_request}/assign'
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
* @see \App\Http\Controllers\Api\V1\LetterRequestController::assignNumber
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:342
* @route '/api/v1/letter-requests/{letter_request}/assign'
*/
assignNumber.post = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignNumber.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::assignNumber
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:342
* @route '/api/v1/letter-requests/{letter_request}/assign'
*/
const assignNumberForm = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: assignNumber.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::assignNumber
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:342
* @route '/api/v1/letter-requests/{letter_request}/assign'
*/
assignNumberForm.post = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: assignNumber.url(args, options),
    method: 'post',
})

assignNumber.form = assignNumberForm

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::reject
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:364
* @route '/api/v1/letter-requests/{letter_request}/reject'
*/
export const reject = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/api/v1/letter-requests/{letter_request}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::reject
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:364
* @route '/api/v1/letter-requests/{letter_request}/reject'
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
* @see \App\Http\Controllers\Api\V1\LetterRequestController::reject
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:364
* @route '/api/v1/letter-requests/{letter_request}/reject'
*/
reject.post = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::reject
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:364
* @route '/api/v1/letter-requests/{letter_request}/reject'
*/
const rejectForm = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::reject
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:364
* @route '/api/v1/letter-requests/{letter_request}/reject'
*/
rejectForm.post = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::updateStatus
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:381
* @route '/api/v1/letter-requests/{letter_request}/status'
*/
export const updateStatus = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

updateStatus.definition = {
    methods: ["patch"],
    url: '/api/v1/letter-requests/{letter_request}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::updateStatus
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:381
* @route '/api/v1/letter-requests/{letter_request}/status'
*/
updateStatus.url = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateStatus.definition.url
            .replace('{letter_request}', parsedArgs.letter_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::updateStatus
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:381
* @route '/api/v1/letter-requests/{letter_request}/status'
*/
updateStatus.patch = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::updateStatus
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:381
* @route '/api/v1/letter-requests/{letter_request}/status'
*/
const updateStatusForm = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStatus.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\LetterRequestController::updateStatus
* @see app/Http/Controllers/Api/V1/LetterRequestController.php:381
* @route '/api/v1/letter-requests/{letter_request}/status'
*/
updateStatusForm.patch = (args: { letter_request: string | number } | [letter_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStatus.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateStatus.form = updateStatusForm

const LetterRequestController = { index, store, show, update, destroy, assignNumber, reject, updateStatus }

export default LetterRequestController