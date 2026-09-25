import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\LetterCodeController::index
* @see app/Http/Controllers/Admin/LetterCodeController.php:13
* @route '/admin/letter-codes'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/letter-codes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::index
* @see app/Http/Controllers/Admin/LetterCodeController.php:13
* @route '/admin/letter-codes'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::index
* @see app/Http/Controllers/Admin/LetterCodeController.php:13
* @route '/admin/letter-codes'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::index
* @see app/Http/Controllers/Admin/LetterCodeController.php:13
* @route '/admin/letter-codes'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::index
* @see app/Http/Controllers/Admin/LetterCodeController.php:13
* @route '/admin/letter-codes'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::index
* @see app/Http/Controllers/Admin/LetterCodeController.php:13
* @route '/admin/letter-codes'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::index
* @see app/Http/Controllers/Admin/LetterCodeController.php:13
* @route '/admin/letter-codes'
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
* @see \App\Http\Controllers\Admin\LetterCodeController::create
* @see app/Http/Controllers/Admin/LetterCodeController.php:18
* @route '/admin/letter-codes/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/letter-codes/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::create
* @see app/Http/Controllers/Admin/LetterCodeController.php:18
* @route '/admin/letter-codes/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::create
* @see app/Http/Controllers/Admin/LetterCodeController.php:18
* @route '/admin/letter-codes/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::create
* @see app/Http/Controllers/Admin/LetterCodeController.php:18
* @route '/admin/letter-codes/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::create
* @see app/Http/Controllers/Admin/LetterCodeController.php:18
* @route '/admin/letter-codes/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::create
* @see app/Http/Controllers/Admin/LetterCodeController.php:18
* @route '/admin/letter-codes/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::create
* @see app/Http/Controllers/Admin/LetterCodeController.php:18
* @route '/admin/letter-codes/create'
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
* @see \App\Http\Controllers\Admin\LetterCodeController::show
* @see app/Http/Controllers/Admin/LetterCodeController.php:0
* @route '/admin/letter-codes/{letter_code}'
*/
export const show = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/letter-codes/{letter_code}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::show
* @see app/Http/Controllers/Admin/LetterCodeController.php:0
* @route '/admin/letter-codes/{letter_code}'
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
* @see \App\Http\Controllers\Admin\LetterCodeController::show
* @see app/Http/Controllers/Admin/LetterCodeController.php:0
* @route '/admin/letter-codes/{letter_code}'
*/
show.get = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::show
* @see app/Http/Controllers/Admin/LetterCodeController.php:0
* @route '/admin/letter-codes/{letter_code}'
*/
show.head = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::show
* @see app/Http/Controllers/Admin/LetterCodeController.php:0
* @route '/admin/letter-codes/{letter_code}'
*/
const showForm = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::show
* @see app/Http/Controllers/Admin/LetterCodeController.php:0
* @route '/admin/letter-codes/{letter_code}'
*/
showForm.get = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::show
* @see app/Http/Controllers/Admin/LetterCodeController.php:0
* @route '/admin/letter-codes/{letter_code}'
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
* @see \App\Http\Controllers\Admin\LetterCodeController::edit
* @see app/Http/Controllers/Admin/LetterCodeController.php:23
* @route '/admin/letter-codes/{letter_code}/edit'
*/
export const edit = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/letter-codes/{letter_code}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::edit
* @see app/Http/Controllers/Admin/LetterCodeController.php:23
* @route '/admin/letter-codes/{letter_code}/edit'
*/
edit.url = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{letter_code}', parsedArgs.letter_code.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::edit
* @see app/Http/Controllers/Admin/LetterCodeController.php:23
* @route '/admin/letter-codes/{letter_code}/edit'
*/
edit.get = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::edit
* @see app/Http/Controllers/Admin/LetterCodeController.php:23
* @route '/admin/letter-codes/{letter_code}/edit'
*/
edit.head = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::edit
* @see app/Http/Controllers/Admin/LetterCodeController.php:23
* @route '/admin/letter-codes/{letter_code}/edit'
*/
const editForm = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::edit
* @see app/Http/Controllers/Admin/LetterCodeController.php:23
* @route '/admin/letter-codes/{letter_code}/edit'
*/
editForm.get = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterCodeController::edit
* @see app/Http/Controllers/Admin/LetterCodeController.php:23
* @route '/admin/letter-codes/{letter_code}/edit'
*/
editForm.head = (args: { letter_code: string | number } | [letter_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

const letterCodes = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
}

export default letterCodes