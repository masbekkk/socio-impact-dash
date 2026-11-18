import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::index
* @see app/Http/Controllers/Admin/LetterDivisionController.php:13
* @route '/admin/letter-divisions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/letter-divisions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::index
* @see app/Http/Controllers/Admin/LetterDivisionController.php:13
* @route '/admin/letter-divisions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::index
* @see app/Http/Controllers/Admin/LetterDivisionController.php:13
* @route '/admin/letter-divisions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::index
* @see app/Http/Controllers/Admin/LetterDivisionController.php:13
* @route '/admin/letter-divisions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::index
* @see app/Http/Controllers/Admin/LetterDivisionController.php:13
* @route '/admin/letter-divisions'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::index
* @see app/Http/Controllers/Admin/LetterDivisionController.php:13
* @route '/admin/letter-divisions'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::index
* @see app/Http/Controllers/Admin/LetterDivisionController.php:13
* @route '/admin/letter-divisions'
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
* @see \App\Http\Controllers\Admin\LetterDivisionController::create
* @see app/Http/Controllers/Admin/LetterDivisionController.php:18
* @route '/admin/letter-divisions/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/letter-divisions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::create
* @see app/Http/Controllers/Admin/LetterDivisionController.php:18
* @route '/admin/letter-divisions/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::create
* @see app/Http/Controllers/Admin/LetterDivisionController.php:18
* @route '/admin/letter-divisions/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::create
* @see app/Http/Controllers/Admin/LetterDivisionController.php:18
* @route '/admin/letter-divisions/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::create
* @see app/Http/Controllers/Admin/LetterDivisionController.php:18
* @route '/admin/letter-divisions/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::create
* @see app/Http/Controllers/Admin/LetterDivisionController.php:18
* @route '/admin/letter-divisions/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::create
* @see app/Http/Controllers/Admin/LetterDivisionController.php:18
* @route '/admin/letter-divisions/create'
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
* @see \App\Http\Controllers\Admin\LetterDivisionController::show
* @see app/Http/Controllers/Admin/LetterDivisionController.php:0
* @route '/admin/letter-divisions/{letter_division}'
*/
export const show = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/letter-divisions/{letter_division}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::show
* @see app/Http/Controllers/Admin/LetterDivisionController.php:0
* @route '/admin/letter-divisions/{letter_division}'
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
* @see \App\Http\Controllers\Admin\LetterDivisionController::show
* @see app/Http/Controllers/Admin/LetterDivisionController.php:0
* @route '/admin/letter-divisions/{letter_division}'
*/
show.get = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::show
* @see app/Http/Controllers/Admin/LetterDivisionController.php:0
* @route '/admin/letter-divisions/{letter_division}'
*/
show.head = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::show
* @see app/Http/Controllers/Admin/LetterDivisionController.php:0
* @route '/admin/letter-divisions/{letter_division}'
*/
const showForm = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::show
* @see app/Http/Controllers/Admin/LetterDivisionController.php:0
* @route '/admin/letter-divisions/{letter_division}'
*/
showForm.get = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::show
* @see app/Http/Controllers/Admin/LetterDivisionController.php:0
* @route '/admin/letter-divisions/{letter_division}'
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
* @see \App\Http\Controllers\Admin\LetterDivisionController::edit
* @see app/Http/Controllers/Admin/LetterDivisionController.php:23
* @route '/admin/letter-divisions/{letter_division}/edit'
*/
export const edit = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/letter-divisions/{letter_division}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::edit
* @see app/Http/Controllers/Admin/LetterDivisionController.php:23
* @route '/admin/letter-divisions/{letter_division}/edit'
*/
edit.url = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{letter_division}', parsedArgs.letter_division.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::edit
* @see app/Http/Controllers/Admin/LetterDivisionController.php:23
* @route '/admin/letter-divisions/{letter_division}/edit'
*/
edit.get = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::edit
* @see app/Http/Controllers/Admin/LetterDivisionController.php:23
* @route '/admin/letter-divisions/{letter_division}/edit'
*/
edit.head = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::edit
* @see app/Http/Controllers/Admin/LetterDivisionController.php:23
* @route '/admin/letter-divisions/{letter_division}/edit'
*/
const editForm = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::edit
* @see app/Http/Controllers/Admin/LetterDivisionController.php:23
* @route '/admin/letter-divisions/{letter_division}/edit'
*/
editForm.get = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LetterDivisionController::edit
* @see app/Http/Controllers/Admin/LetterDivisionController.php:23
* @route '/admin/letter-divisions/{letter_division}/edit'
*/
editForm.head = (args: { letter_division: string | number } | [letter_division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

const LetterDivisionController = { index, create, show, edit }

export default LetterDivisionController