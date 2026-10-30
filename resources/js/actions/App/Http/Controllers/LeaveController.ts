import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LeaveController::createTravel
* @see app/Http/Controllers/LeaveController.php:42
* @route '/leaves/create-travel'
*/
export const createTravel = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createTravel.url(options),
    method: 'get',
})

createTravel.definition = {
    methods: ["get","head"],
    url: '/leaves/create-travel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaveController::createTravel
* @see app/Http/Controllers/LeaveController.php:42
* @route '/leaves/create-travel'
*/
createTravel.url = (options?: RouteQueryOptions) => {
    return createTravel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveController::createTravel
* @see app/Http/Controllers/LeaveController.php:42
* @route '/leaves/create-travel'
*/
createTravel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createTravel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::createTravel
* @see app/Http/Controllers/LeaveController.php:42
* @route '/leaves/create-travel'
*/
createTravel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createTravel.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaveController::createTravel
* @see app/Http/Controllers/LeaveController.php:42
* @route '/leaves/create-travel'
*/
const createTravelForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createTravel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::createTravel
* @see app/Http/Controllers/LeaveController.php:42
* @route '/leaves/create-travel'
*/
createTravelForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createTravel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::createTravel
* @see app/Http/Controllers/LeaveController.php:42
* @route '/leaves/create-travel'
*/
createTravelForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createTravel.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

createTravel.form = createTravelForm

/**
* @see \App\Http\Controllers\LeaveController::approvals
* @see app/Http/Controllers/LeaveController.php:47
* @route '/leaves/approvals'
*/
export const approvals = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approvals.url(options),
    method: 'get',
})

approvals.definition = {
    methods: ["get","head"],
    url: '/leaves/approvals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaveController::approvals
* @see app/Http/Controllers/LeaveController.php:47
* @route '/leaves/approvals'
*/
approvals.url = (options?: RouteQueryOptions) => {
    return approvals.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveController::approvals
* @see app/Http/Controllers/LeaveController.php:47
* @route '/leaves/approvals'
*/
approvals.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approvals.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::approvals
* @see app/Http/Controllers/LeaveController.php:47
* @route '/leaves/approvals'
*/
approvals.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: approvals.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaveController::approvals
* @see app/Http/Controllers/LeaveController.php:47
* @route '/leaves/approvals'
*/
const approvalsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: approvals.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::approvals
* @see app/Http/Controllers/LeaveController.php:47
* @route '/leaves/approvals'
*/
approvalsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: approvals.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::approvals
* @see app/Http/Controllers/LeaveController.php:47
* @route '/leaves/approvals'
*/
approvalsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: approvals.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

approvals.form = approvalsForm

/**
* @see \App\Http\Controllers\LeaveController::index
* @see app/Http/Controllers/LeaveController.php:19
* @route '/leaves'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/leaves',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaveController::index
* @see app/Http/Controllers/LeaveController.php:19
* @route '/leaves'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveController::index
* @see app/Http/Controllers/LeaveController.php:19
* @route '/leaves'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::index
* @see app/Http/Controllers/LeaveController.php:19
* @route '/leaves'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaveController::index
* @see app/Http/Controllers/LeaveController.php:19
* @route '/leaves'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::index
* @see app/Http/Controllers/LeaveController.php:19
* @route '/leaves'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::index
* @see app/Http/Controllers/LeaveController.php:19
* @route '/leaves'
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
* @see \App\Http\Controllers\LeaveController::create
* @see app/Http/Controllers/LeaveController.php:34
* @route '/leaves/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/leaves/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaveController::create
* @see app/Http/Controllers/LeaveController.php:34
* @route '/leaves/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveController::create
* @see app/Http/Controllers/LeaveController.php:34
* @route '/leaves/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::create
* @see app/Http/Controllers/LeaveController.php:34
* @route '/leaves/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaveController::create
* @see app/Http/Controllers/LeaveController.php:34
* @route '/leaves/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::create
* @see app/Http/Controllers/LeaveController.php:34
* @route '/leaves/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::create
* @see app/Http/Controllers/LeaveController.php:34
* @route '/leaves/create'
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
* @see \App\Http\Controllers\LeaveController::store
* @see app/Http/Controllers/LeaveController.php:55
* @route '/leaves'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/leaves',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaveController::store
* @see app/Http/Controllers/LeaveController.php:55
* @route '/leaves'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveController::store
* @see app/Http/Controllers/LeaveController.php:55
* @route '/leaves'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveController::store
* @see app/Http/Controllers/LeaveController.php:55
* @route '/leaves'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveController::store
* @see app/Http/Controllers/LeaveController.php:55
* @route '/leaves'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\LeaveController::show
* @see app/Http/Controllers/LeaveController.php:63
* @route '/leaves/{leaf}'
*/
export const show = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/leaves/{leaf}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaveController::show
* @see app/Http/Controllers/LeaveController.php:63
* @route '/leaves/{leaf}'
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
* @see \App\Http\Controllers\LeaveController::show
* @see app/Http/Controllers/LeaveController.php:63
* @route '/leaves/{leaf}'
*/
show.get = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::show
* @see app/Http/Controllers/LeaveController.php:63
* @route '/leaves/{leaf}'
*/
show.head = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaveController::show
* @see app/Http/Controllers/LeaveController.php:63
* @route '/leaves/{leaf}'
*/
const showForm = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::show
* @see app/Http/Controllers/LeaveController.php:63
* @route '/leaves/{leaf}'
*/
showForm.get = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::show
* @see app/Http/Controllers/LeaveController.php:63
* @route '/leaves/{leaf}'
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
* @see \App\Http\Controllers\LeaveController::edit
* @see app/Http/Controllers/LeaveController.php:93
* @route '/leaves/{leaf}/edit'
*/
export const edit = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/leaves/{leaf}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaveController::edit
* @see app/Http/Controllers/LeaveController.php:93
* @route '/leaves/{leaf}/edit'
*/
edit.url = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{leaf}', parsedArgs.leaf.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveController::edit
* @see app/Http/Controllers/LeaveController.php:93
* @route '/leaves/{leaf}/edit'
*/
edit.get = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::edit
* @see app/Http/Controllers/LeaveController.php:93
* @route '/leaves/{leaf}/edit'
*/
edit.head = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LeaveController::edit
* @see app/Http/Controllers/LeaveController.php:93
* @route '/leaves/{leaf}/edit'
*/
const editForm = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::edit
* @see app/Http/Controllers/LeaveController.php:93
* @route '/leaves/{leaf}/edit'
*/
editForm.get = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LeaveController::edit
* @see app/Http/Controllers/LeaveController.php:93
* @route '/leaves/{leaf}/edit'
*/
editForm.head = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LeaveController::update
* @see app/Http/Controllers/LeaveController.php:101
* @route '/leaves/{leaf}'
*/
export const update = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/leaves/{leaf}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\LeaveController::update
* @see app/Http/Controllers/LeaveController.php:101
* @route '/leaves/{leaf}'
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
* @see \App\Http\Controllers\LeaveController::update
* @see app/Http/Controllers/LeaveController.php:101
* @route '/leaves/{leaf}'
*/
update.put = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\LeaveController::update
* @see app/Http/Controllers/LeaveController.php:101
* @route '/leaves/{leaf}'
*/
update.patch = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\LeaveController::update
* @see app/Http/Controllers/LeaveController.php:101
* @route '/leaves/{leaf}'
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
* @see \App\Http\Controllers\LeaveController::update
* @see app/Http/Controllers/LeaveController.php:101
* @route '/leaves/{leaf}'
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
* @see \App\Http\Controllers\LeaveController::update
* @see app/Http/Controllers/LeaveController.php:101
* @route '/leaves/{leaf}'
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
* @see \App\Http\Controllers\LeaveController::destroy
* @see app/Http/Controllers/LeaveController.php:109
* @route '/leaves/{leaf}'
*/
export const destroy = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/leaves/{leaf}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LeaveController::destroy
* @see app/Http/Controllers/LeaveController.php:109
* @route '/leaves/{leaf}'
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
* @see \App\Http\Controllers\LeaveController::destroy
* @see app/Http/Controllers/LeaveController.php:109
* @route '/leaves/{leaf}'
*/
destroy.delete = (args: { leaf: string | number } | [leaf: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\LeaveController::destroy
* @see app/Http/Controllers/LeaveController.php:109
* @route '/leaves/{leaf}'
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
* @see \App\Http\Controllers\LeaveController::destroy
* @see app/Http/Controllers/LeaveController.php:109
* @route '/leaves/{leaf}'
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

/**
* @see \App\Http\Controllers\LeaveController::approve
* @see app/Http/Controllers/LeaveController.php:161
* @route '/leaves/{leave}/approve'
*/
export const approve = (args: { leave: string | number } | [leave: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/leaves/{leave}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaveController::approve
* @see app/Http/Controllers/LeaveController.php:161
* @route '/leaves/{leave}/approve'
*/
approve.url = (args: { leave: string | number } | [leave: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leave: args }
    }

    if (Array.isArray(args)) {
        args = {
            leave: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leave: args.leave,
    }

    return approve.definition.url
            .replace('{leave}', parsedArgs.leave.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveController::approve
* @see app/Http/Controllers/LeaveController.php:161
* @route '/leaves/{leave}/approve'
*/
approve.post = (args: { leave: string | number } | [leave: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveController::approve
* @see app/Http/Controllers/LeaveController.php:161
* @route '/leaves/{leave}/approve'
*/
const approveForm = (args: { leave: string | number } | [leave: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveController::approve
* @see app/Http/Controllers/LeaveController.php:161
* @route '/leaves/{leave}/approve'
*/
approveForm.post = (args: { leave: string | number } | [leave: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\LeaveController::reject
* @see app/Http/Controllers/LeaveController.php:170
* @route '/leaves/{leave}/reject'
*/
export const reject = (args: { leave: string | number } | [leave: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/leaves/{leave}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaveController::reject
* @see app/Http/Controllers/LeaveController.php:170
* @route '/leaves/{leave}/reject'
*/
reject.url = (args: { leave: string | number } | [leave: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leave: args }
    }

    if (Array.isArray(args)) {
        args = {
            leave: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        leave: args.leave,
    }

    return reject.definition.url
            .replace('{leave}', parsedArgs.leave.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveController::reject
* @see app/Http/Controllers/LeaveController.php:170
* @route '/leaves/{leave}/reject'
*/
reject.post = (args: { leave: string | number } | [leave: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveController::reject
* @see app/Http/Controllers/LeaveController.php:170
* @route '/leaves/{leave}/reject'
*/
const rejectForm = (args: { leave: string | number } | [leave: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveController::reject
* @see app/Http/Controllers/LeaveController.php:170
* @route '/leaves/{leave}/reject'
*/
rejectForm.post = (args: { leave: string | number } | [leave: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

/**
* @see \App\Http\Controllers\LeaveController::bulkApprove
* @see app/Http/Controllers/LeaveController.php:114
* @route '/leaves/bulk-approve'
*/
export const bulkApprove = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkApprove.url(options),
    method: 'post',
})

bulkApprove.definition = {
    methods: ["post"],
    url: '/leaves/bulk-approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaveController::bulkApprove
* @see app/Http/Controllers/LeaveController.php:114
* @route '/leaves/bulk-approve'
*/
bulkApprove.url = (options?: RouteQueryOptions) => {
    return bulkApprove.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveController::bulkApprove
* @see app/Http/Controllers/LeaveController.php:114
* @route '/leaves/bulk-approve'
*/
bulkApprove.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkApprove.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveController::bulkApprove
* @see app/Http/Controllers/LeaveController.php:114
* @route '/leaves/bulk-approve'
*/
const bulkApproveForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkApprove.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveController::bulkApprove
* @see app/Http/Controllers/LeaveController.php:114
* @route '/leaves/bulk-approve'
*/
bulkApproveForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkApprove.url(options),
    method: 'post',
})

bulkApprove.form = bulkApproveForm

/**
* @see \App\Http\Controllers\LeaveController::bulkReject
* @see app/Http/Controllers/LeaveController.php:129
* @route '/leaves/bulk-reject'
*/
export const bulkReject = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkReject.url(options),
    method: 'post',
})

bulkReject.definition = {
    methods: ["post"],
    url: '/leaves/bulk-reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaveController::bulkReject
* @see app/Http/Controllers/LeaveController.php:129
* @route '/leaves/bulk-reject'
*/
bulkReject.url = (options?: RouteQueryOptions) => {
    return bulkReject.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveController::bulkReject
* @see app/Http/Controllers/LeaveController.php:129
* @route '/leaves/bulk-reject'
*/
bulkReject.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkReject.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveController::bulkReject
* @see app/Http/Controllers/LeaveController.php:129
* @route '/leaves/bulk-reject'
*/
const bulkRejectForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkReject.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveController::bulkReject
* @see app/Http/Controllers/LeaveController.php:129
* @route '/leaves/bulk-reject'
*/
bulkRejectForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkReject.url(options),
    method: 'post',
})

bulkReject.form = bulkRejectForm

/**
* @see \App\Http\Controllers\LeaveController::bulkRevision
* @see app/Http/Controllers/LeaveController.php:145
* @route '/leaves/bulk-revision'
*/
export const bulkRevision = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkRevision.url(options),
    method: 'post',
})

bulkRevision.definition = {
    methods: ["post"],
    url: '/leaves/bulk-revision',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaveController::bulkRevision
* @see app/Http/Controllers/LeaveController.php:145
* @route '/leaves/bulk-revision'
*/
bulkRevision.url = (options?: RouteQueryOptions) => {
    return bulkRevision.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveController::bulkRevision
* @see app/Http/Controllers/LeaveController.php:145
* @route '/leaves/bulk-revision'
*/
bulkRevision.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkRevision.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveController::bulkRevision
* @see app/Http/Controllers/LeaveController.php:145
* @route '/leaves/bulk-revision'
*/
const bulkRevisionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkRevision.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LeaveController::bulkRevision
* @see app/Http/Controllers/LeaveController.php:145
* @route '/leaves/bulk-revision'
*/
bulkRevisionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkRevision.url(options),
    method: 'post',
})

bulkRevision.form = bulkRevisionForm

const LeaveController = { createTravel, approvals, index, create, store, show, edit, update, destroy, approve, reject, bulkApprove, bulkReject, bulkRevision }

export default LeaveController