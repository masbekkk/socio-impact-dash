import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ReimbursementController::approvals
* @see app/Http/Controllers/ReimbursementController.php:249
* @route '/reimbursements/approvals'
*/
export const approvals = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approvals.url(options),
    method: 'get',
})

approvals.definition = {
    methods: ["get","head"],
    url: '/reimbursements/approvals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReimbursementController::approvals
* @see app/Http/Controllers/ReimbursementController.php:249
* @route '/reimbursements/approvals'
*/
approvals.url = (options?: RouteQueryOptions) => {
    return approvals.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::approvals
* @see app/Http/Controllers/ReimbursementController.php:249
* @route '/reimbursements/approvals'
*/
approvals.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approvals.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::approvals
* @see app/Http/Controllers/ReimbursementController.php:249
* @route '/reimbursements/approvals'
*/
approvals.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: approvals.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReimbursementController::approvals
* @see app/Http/Controllers/ReimbursementController.php:249
* @route '/reimbursements/approvals'
*/
const approvalsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: approvals.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::approvals
* @see app/Http/Controllers/ReimbursementController.php:249
* @route '/reimbursements/approvals'
*/
approvalsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: approvals.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::approvals
* @see app/Http/Controllers/ReimbursementController.php:249
* @route '/reimbursements/approvals'
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
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/reimbursements/export-excel'
*/
export const exportExcel = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcel.url(options),
    method: 'get',
})

exportExcel.definition = {
    methods: ["get","head"],
    url: '/reimbursements/export-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/reimbursements/export-excel'
*/
exportExcel.url = (options?: RouteQueryOptions) => {
    return exportExcel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/reimbursements/export-excel'
*/
exportExcel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/reimbursements/export-excel'
*/
exportExcel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportExcel.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/reimbursements/export-excel'
*/
const exportExcelForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/reimbursements/export-excel'
*/
exportExcelForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/reimbursements/export-excel'
*/
exportExcelForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcel.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportExcel.form = exportExcelForm

/**
* @see \App\Http\Controllers\ReimbursementController::index
* @see app/Http/Controllers/ReimbursementController.php:24
* @route '/reimbursements'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reimbursements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReimbursementController::index
* @see app/Http/Controllers/ReimbursementController.php:24
* @route '/reimbursements'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::index
* @see app/Http/Controllers/ReimbursementController.php:24
* @route '/reimbursements'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::index
* @see app/Http/Controllers/ReimbursementController.php:24
* @route '/reimbursements'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReimbursementController::index
* @see app/Http/Controllers/ReimbursementController.php:24
* @route '/reimbursements'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::index
* @see app/Http/Controllers/ReimbursementController.php:24
* @route '/reimbursements'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::index
* @see app/Http/Controllers/ReimbursementController.php:24
* @route '/reimbursements'
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
* @see \App\Http\Controllers\ReimbursementController::create
* @see app/Http/Controllers/ReimbursementController.php:257
* @route '/reimbursements/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/reimbursements/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReimbursementController::create
* @see app/Http/Controllers/ReimbursementController.php:257
* @route '/reimbursements/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::create
* @see app/Http/Controllers/ReimbursementController.php:257
* @route '/reimbursements/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::create
* @see app/Http/Controllers/ReimbursementController.php:257
* @route '/reimbursements/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReimbursementController::create
* @see app/Http/Controllers/ReimbursementController.php:257
* @route '/reimbursements/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::create
* @see app/Http/Controllers/ReimbursementController.php:257
* @route '/reimbursements/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::create
* @see app/Http/Controllers/ReimbursementController.php:257
* @route '/reimbursements/create'
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
* @see \App\Http\Controllers\ReimbursementController::store
* @see app/Http/Controllers/ReimbursementController.php:265
* @route '/reimbursements'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/reimbursements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReimbursementController::store
* @see app/Http/Controllers/ReimbursementController.php:265
* @route '/reimbursements'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::store
* @see app/Http/Controllers/ReimbursementController.php:265
* @route '/reimbursements'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::store
* @see app/Http/Controllers/ReimbursementController.php:265
* @route '/reimbursements'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::store
* @see app/Http/Controllers/ReimbursementController.php:265
* @route '/reimbursements'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ReimbursementController::show
* @see app/Http/Controllers/ReimbursementController.php:273
* @route '/reimbursements/{reimbursement}'
*/
export const show = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/reimbursements/{reimbursement}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReimbursementController::show
* @see app/Http/Controllers/ReimbursementController.php:273
* @route '/reimbursements/{reimbursement}'
*/
show.url = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reimbursement: args }
    }

    if (Array.isArray(args)) {
        args = {
            reimbursement: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        reimbursement: args.reimbursement,
    }

    return show.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::show
* @see app/Http/Controllers/ReimbursementController.php:273
* @route '/reimbursements/{reimbursement}'
*/
show.get = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::show
* @see app/Http/Controllers/ReimbursementController.php:273
* @route '/reimbursements/{reimbursement}'
*/
show.head = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReimbursementController::show
* @see app/Http/Controllers/ReimbursementController.php:273
* @route '/reimbursements/{reimbursement}'
*/
const showForm = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::show
* @see app/Http/Controllers/ReimbursementController.php:273
* @route '/reimbursements/{reimbursement}'
*/
showForm.get = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::show
* @see app/Http/Controllers/ReimbursementController.php:273
* @route '/reimbursements/{reimbursement}'
*/
showForm.head = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ReimbursementController::edit
* @see app/Http/Controllers/ReimbursementController.php:314
* @route '/reimbursements/{reimbursement}/edit'
*/
export const edit = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/reimbursements/{reimbursement}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReimbursementController::edit
* @see app/Http/Controllers/ReimbursementController.php:314
* @route '/reimbursements/{reimbursement}/edit'
*/
edit.url = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reimbursement: args }
    }

    if (Array.isArray(args)) {
        args = {
            reimbursement: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        reimbursement: args.reimbursement,
    }

    return edit.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::edit
* @see app/Http/Controllers/ReimbursementController.php:314
* @route '/reimbursements/{reimbursement}/edit'
*/
edit.get = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::edit
* @see app/Http/Controllers/ReimbursementController.php:314
* @route '/reimbursements/{reimbursement}/edit'
*/
edit.head = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReimbursementController::edit
* @see app/Http/Controllers/ReimbursementController.php:314
* @route '/reimbursements/{reimbursement}/edit'
*/
const editForm = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::edit
* @see app/Http/Controllers/ReimbursementController.php:314
* @route '/reimbursements/{reimbursement}/edit'
*/
editForm.get = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::edit
* @see app/Http/Controllers/ReimbursementController.php:314
* @route '/reimbursements/{reimbursement}/edit'
*/
editForm.head = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ReimbursementController::update
* @see app/Http/Controllers/ReimbursementController.php:498
* @route '/reimbursements/{reimbursement}'
*/
export const update = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/reimbursements/{reimbursement}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ReimbursementController::update
* @see app/Http/Controllers/ReimbursementController.php:498
* @route '/reimbursements/{reimbursement}'
*/
update.url = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reimbursement: args }
    }

    if (Array.isArray(args)) {
        args = {
            reimbursement: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        reimbursement: args.reimbursement,
    }

    return update.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::update
* @see app/Http/Controllers/ReimbursementController.php:498
* @route '/reimbursements/{reimbursement}'
*/
update.put = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ReimbursementController::update
* @see app/Http/Controllers/ReimbursementController.php:498
* @route '/reimbursements/{reimbursement}'
*/
update.patch = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ReimbursementController::update
* @see app/Http/Controllers/ReimbursementController.php:498
* @route '/reimbursements/{reimbursement}'
*/
const updateForm = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::update
* @see app/Http/Controllers/ReimbursementController.php:498
* @route '/reimbursements/{reimbursement}'
*/
updateForm.put = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::update
* @see app/Http/Controllers/ReimbursementController.php:498
* @route '/reimbursements/{reimbursement}'
*/
updateForm.patch = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ReimbursementController::destroy
* @see app/Http/Controllers/ReimbursementController.php:506
* @route '/reimbursements/{reimbursement}'
*/
export const destroy = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/reimbursements/{reimbursement}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ReimbursementController::destroy
* @see app/Http/Controllers/ReimbursementController.php:506
* @route '/reimbursements/{reimbursement}'
*/
destroy.url = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reimbursement: args }
    }

    if (Array.isArray(args)) {
        args = {
            reimbursement: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        reimbursement: args.reimbursement,
    }

    return destroy.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::destroy
* @see app/Http/Controllers/ReimbursementController.php:506
* @route '/reimbursements/{reimbursement}'
*/
destroy.delete = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ReimbursementController::destroy
* @see app/Http/Controllers/ReimbursementController.php:506
* @route '/reimbursements/{reimbursement}'
*/
const destroyForm = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::destroy
* @see app/Http/Controllers/ReimbursementController.php:506
* @route '/reimbursements/{reimbursement}'
*/
destroyForm.delete = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ReimbursementController::approve
* @see app/Http/Controllers/ReimbursementController.php:569
* @route '/reimbursements/{reimbursement}/approve'
*/
export const approve = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/reimbursements/{reimbursement}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReimbursementController::approve
* @see app/Http/Controllers/ReimbursementController.php:569
* @route '/reimbursements/{reimbursement}/approve'
*/
approve.url = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reimbursement: args }
    }

    if (Array.isArray(args)) {
        args = {
            reimbursement: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        reimbursement: args.reimbursement,
    }

    return approve.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::approve
* @see app/Http/Controllers/ReimbursementController.php:569
* @route '/reimbursements/{reimbursement}/approve'
*/
approve.post = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::approve
* @see app/Http/Controllers/ReimbursementController.php:569
* @route '/reimbursements/{reimbursement}/approve'
*/
const approveForm = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::approve
* @see app/Http/Controllers/ReimbursementController.php:569
* @route '/reimbursements/{reimbursement}/approve'
*/
approveForm.post = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\ReimbursementController::reject
* @see app/Http/Controllers/ReimbursementController.php:586
* @route '/reimbursements/{reimbursement}/reject'
*/
export const reject = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/reimbursements/{reimbursement}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReimbursementController::reject
* @see app/Http/Controllers/ReimbursementController.php:586
* @route '/reimbursements/{reimbursement}/reject'
*/
reject.url = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reimbursement: args }
    }

    if (Array.isArray(args)) {
        args = {
            reimbursement: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        reimbursement: args.reimbursement,
    }

    return reject.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::reject
* @see app/Http/Controllers/ReimbursementController.php:586
* @route '/reimbursements/{reimbursement}/reject'
*/
reject.post = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::reject
* @see app/Http/Controllers/ReimbursementController.php:586
* @route '/reimbursements/{reimbursement}/reject'
*/
const rejectForm = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::reject
* @see app/Http/Controllers/ReimbursementController.php:586
* @route '/reimbursements/{reimbursement}/reject'
*/
rejectForm.post = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

/**
* @see \App\Http\Controllers\ReimbursementController::bulkApprove
* @see app/Http/Controllers/ReimbursementController.php:511
* @route '/reimbursements/bulk-approve'
*/
export const bulkApprove = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkApprove.url(options),
    method: 'post',
})

bulkApprove.definition = {
    methods: ["post"],
    url: '/reimbursements/bulk-approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReimbursementController::bulkApprove
* @see app/Http/Controllers/ReimbursementController.php:511
* @route '/reimbursements/bulk-approve'
*/
bulkApprove.url = (options?: RouteQueryOptions) => {
    return bulkApprove.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::bulkApprove
* @see app/Http/Controllers/ReimbursementController.php:511
* @route '/reimbursements/bulk-approve'
*/
bulkApprove.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkApprove.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::bulkApprove
* @see app/Http/Controllers/ReimbursementController.php:511
* @route '/reimbursements/bulk-approve'
*/
const bulkApproveForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkApprove.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::bulkApprove
* @see app/Http/Controllers/ReimbursementController.php:511
* @route '/reimbursements/bulk-approve'
*/
bulkApproveForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkApprove.url(options),
    method: 'post',
})

bulkApprove.form = bulkApproveForm

/**
* @see \App\Http\Controllers\ReimbursementController::bulkReject
* @see app/Http/Controllers/ReimbursementController.php:539
* @route '/reimbursements/bulk-reject'
*/
export const bulkReject = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkReject.url(options),
    method: 'post',
})

bulkReject.definition = {
    methods: ["post"],
    url: '/reimbursements/bulk-reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReimbursementController::bulkReject
* @see app/Http/Controllers/ReimbursementController.php:539
* @route '/reimbursements/bulk-reject'
*/
bulkReject.url = (options?: RouteQueryOptions) => {
    return bulkReject.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::bulkReject
* @see app/Http/Controllers/ReimbursementController.php:539
* @route '/reimbursements/bulk-reject'
*/
bulkReject.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkReject.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::bulkReject
* @see app/Http/Controllers/ReimbursementController.php:539
* @route '/reimbursements/bulk-reject'
*/
const bulkRejectForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkReject.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::bulkReject
* @see app/Http/Controllers/ReimbursementController.php:539
* @route '/reimbursements/bulk-reject'
*/
bulkRejectForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkReject.url(options),
    method: 'post',
})

bulkReject.form = bulkRejectForm

/**
* @see \App\Http\Controllers\ReimbursementController::bulkRevision
* @see app/Http/Controllers/ReimbursementController.php:554
* @route '/reimbursements/bulk-revision'
*/
export const bulkRevision = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkRevision.url(options),
    method: 'post',
})

bulkRevision.definition = {
    methods: ["post"],
    url: '/reimbursements/bulk-revision',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReimbursementController::bulkRevision
* @see app/Http/Controllers/ReimbursementController.php:554
* @route '/reimbursements/bulk-revision'
*/
bulkRevision.url = (options?: RouteQueryOptions) => {
    return bulkRevision.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::bulkRevision
* @see app/Http/Controllers/ReimbursementController.php:554
* @route '/reimbursements/bulk-revision'
*/
bulkRevision.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkRevision.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::bulkRevision
* @see app/Http/Controllers/ReimbursementController.php:554
* @route '/reimbursements/bulk-revision'
*/
const bulkRevisionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkRevision.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::bulkRevision
* @see app/Http/Controllers/ReimbursementController.php:554
* @route '/reimbursements/bulk-revision'
*/
bulkRevisionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkRevision.url(options),
    method: 'post',
})

bulkRevision.form = bulkRevisionForm

/**
* @see \App\Http\Controllers\ReimbursementController::bulkRequestFund
* @see app/Http/Controllers/ReimbursementController.php:525
* @route '/reimbursements/bulk-request-fund'
*/
export const bulkRequestFund = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkRequestFund.url(options),
    method: 'post',
})

bulkRequestFund.definition = {
    methods: ["post"],
    url: '/reimbursements/bulk-request-fund',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReimbursementController::bulkRequestFund
* @see app/Http/Controllers/ReimbursementController.php:525
* @route '/reimbursements/bulk-request-fund'
*/
bulkRequestFund.url = (options?: RouteQueryOptions) => {
    return bulkRequestFund.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::bulkRequestFund
* @see app/Http/Controllers/ReimbursementController.php:525
* @route '/reimbursements/bulk-request-fund'
*/
bulkRequestFund.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkRequestFund.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::bulkRequestFund
* @see app/Http/Controllers/ReimbursementController.php:525
* @route '/reimbursements/bulk-request-fund'
*/
const bulkRequestFundForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkRequestFund.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReimbursementController::bulkRequestFund
* @see app/Http/Controllers/ReimbursementController.php:525
* @route '/reimbursements/bulk-request-fund'
*/
bulkRequestFundForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkRequestFund.url(options),
    method: 'post',
})

bulkRequestFund.form = bulkRequestFundForm

const reimbursements = {
    create: Object.assign(create, create),
    approvals: Object.assign(approvals, approvals),
    exportExcel: Object.assign(exportExcel, exportExcel),
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    approve: Object.assign(approve, approve),
    reject: Object.assign(reject, reject),
    bulkApprove: Object.assign(bulkApprove, bulkApprove),
    bulkReject: Object.assign(bulkReject, bulkReject),
    bulkRevision: Object.assign(bulkRevision, bulkRevision),
    bulkRequestFund: Object.assign(bulkRequestFund, bulkRequestFund),
}

export default reimbursements