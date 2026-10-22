import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DivisionController::index
* @see app/Http/Controllers/Admin/DivisionController.php:14
* @route '/admin/divisions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/divisions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DivisionController::index
* @see app/Http/Controllers/Admin/DivisionController.php:14
* @route '/admin/divisions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DivisionController::index
* @see app/Http/Controllers/Admin/DivisionController.php:14
* @route '/admin/divisions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::index
* @see app/Http/Controllers/Admin/DivisionController.php:14
* @route '/admin/divisions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::index
* @see app/Http/Controllers/Admin/DivisionController.php:14
* @route '/admin/divisions'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::index
* @see app/Http/Controllers/Admin/DivisionController.php:14
* @route '/admin/divisions'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::index
* @see app/Http/Controllers/Admin/DivisionController.php:14
* @route '/admin/divisions'
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
* @see \App\Http\Controllers\Admin\DivisionController::create
* @see app/Http/Controllers/Admin/DivisionController.php:22
* @route '/admin/divisions/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/divisions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DivisionController::create
* @see app/Http/Controllers/Admin/DivisionController.php:22
* @route '/admin/divisions/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DivisionController::create
* @see app/Http/Controllers/Admin/DivisionController.php:22
* @route '/admin/divisions/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::create
* @see app/Http/Controllers/Admin/DivisionController.php:22
* @route '/admin/divisions/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::create
* @see app/Http/Controllers/Admin/DivisionController.php:22
* @route '/admin/divisions/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::create
* @see app/Http/Controllers/Admin/DivisionController.php:22
* @route '/admin/divisions/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::create
* @see app/Http/Controllers/Admin/DivisionController.php:22
* @route '/admin/divisions/create'
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
* @see \App\Http\Controllers\Admin\DivisionController::store
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/divisions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DivisionController::store
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DivisionController::store
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::store
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::store
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\DivisionController::show
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
*/
export const show = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/divisions/{division}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DivisionController::show
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
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
* @see \App\Http\Controllers\Admin\DivisionController::show
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
*/
show.get = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::show
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
*/
show.head = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::show
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
*/
const showForm = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::show
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
*/
showForm.get = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::show
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
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
* @see \App\Http\Controllers\Admin\DivisionController::edit
* @see app/Http/Controllers/Admin/DivisionController.php:30
* @route '/admin/divisions/{division}/edit'
*/
export const edit = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/divisions/{division}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DivisionController::edit
* @see app/Http/Controllers/Admin/DivisionController.php:30
* @route '/admin/divisions/{division}/edit'
*/
edit.url = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{division}', parsedArgs.division.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DivisionController::edit
* @see app/Http/Controllers/Admin/DivisionController.php:30
* @route '/admin/divisions/{division}/edit'
*/
edit.get = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::edit
* @see app/Http/Controllers/Admin/DivisionController.php:30
* @route '/admin/divisions/{division}/edit'
*/
edit.head = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::edit
* @see app/Http/Controllers/Admin/DivisionController.php:30
* @route '/admin/divisions/{division}/edit'
*/
const editForm = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::edit
* @see app/Http/Controllers/Admin/DivisionController.php:30
* @route '/admin/divisions/{division}/edit'
*/
editForm.get = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::edit
* @see app/Http/Controllers/Admin/DivisionController.php:30
* @route '/admin/divisions/{division}/edit'
*/
editForm.head = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\DivisionController::update
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
*/
export const update = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/divisions/{division}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\DivisionController::update
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
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
* @see \App\Http\Controllers\Admin\DivisionController::update
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
*/
update.put = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::update
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
*/
update.patch = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::update
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
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
* @see \App\Http\Controllers\Admin\DivisionController::update
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
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
* @see \App\Http\Controllers\Admin\DivisionController::update
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
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
* @see \App\Http\Controllers\Admin\DivisionController::destroy
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
*/
export const destroy = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/divisions/{division}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DivisionController::destroy
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
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
* @see \App\Http\Controllers\Admin\DivisionController::destroy
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
*/
destroy.delete = (args: { division: string | number } | [division: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\DivisionController::destroy
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
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
* @see \App\Http\Controllers\Admin\DivisionController::destroy
* @see app/Http/Controllers/Admin/DivisionController.php:0
* @route '/admin/divisions/{division}'
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
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default divisions