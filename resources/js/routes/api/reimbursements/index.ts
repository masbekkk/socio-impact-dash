import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import budgets from './budgets'
import code from './code'
import comments from './comments'
/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::index
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:29
* @route '/api/v1/reimbursements'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/reimbursements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::index
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:29
* @route '/api/v1/reimbursements'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::index
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:29
* @route '/api/v1/reimbursements'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::index
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:29
* @route '/api/v1/reimbursements'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::index
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:29
* @route '/api/v1/reimbursements'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::index
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:29
* @route '/api/v1/reimbursements'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::index
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:29
* @route '/api/v1/reimbursements'
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
* @see \App\Http\Controllers\Api\V1\ReimbursementController::store
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:83
* @route '/api/v1/reimbursements'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/reimbursements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::store
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:83
* @route '/api/v1/reimbursements'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::store
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:83
* @route '/api/v1/reimbursements'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::store
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:83
* @route '/api/v1/reimbursements'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::store
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:83
* @route '/api/v1/reimbursements'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::destroy
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:407
* @route '/api/v1/reimbursements/{reimbursement}'
*/
export const destroy = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/reimbursements/{reimbursement}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::destroy
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:407
* @route '/api/v1/reimbursements/{reimbursement}'
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
* @see \App\Http\Controllers\Api\V1\ReimbursementController::destroy
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:407
* @route '/api/v1/reimbursements/{reimbursement}'
*/
destroy.delete = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::destroy
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:407
* @route '/api/v1/reimbursements/{reimbursement}'
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
* @see \App\Http\Controllers\Api\V1\ReimbursementController::destroy
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:407
* @route '/api/v1/reimbursements/{reimbursement}'
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
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/api/v1/reimbursements/export-excel'
*/
export const exportExcel = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcel.url(options),
    method: 'get',
})

exportExcel.definition = {
    methods: ["get","head"],
    url: '/api/v1/reimbursements/export-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/api/v1/reimbursements/export-excel'
*/
exportExcel.url = (options?: RouteQueryOptions) => {
    return exportExcel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/api/v1/reimbursements/export-excel'
*/
exportExcel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/api/v1/reimbursements/export-excel'
*/
exportExcel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportExcel.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/api/v1/reimbursements/export-excel'
*/
const exportExcelForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/api/v1/reimbursements/export-excel'
*/
exportExcelForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/api/v1/reimbursements/export-excel'
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
* @see \App\Http\Controllers\Api\V1\ReimbursementController::show
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:102
* @route '/api/v1/reimbursements/{reimbursement}'
*/
export const show = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/reimbursements/{reimbursement}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::show
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:102
* @route '/api/v1/reimbursements/{reimbursement}'
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
* @see \App\Http\Controllers\Api\V1\ReimbursementController::show
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:102
* @route '/api/v1/reimbursements/{reimbursement}'
*/
show.get = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::show
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:102
* @route '/api/v1/reimbursements/{reimbursement}'
*/
show.head = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::show
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:102
* @route '/api/v1/reimbursements/{reimbursement}'
*/
const showForm = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::show
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:102
* @route '/api/v1/reimbursements/{reimbursement}'
*/
showForm.get = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::show
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:102
* @route '/api/v1/reimbursements/{reimbursement}'
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
* @see \App\Http\Controllers\Api\V1\ReimbursementController::status
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:148
* @route '/api/v1/reimbursements/{reimbursement}/status'
*/
export const status = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: status.url(args, options),
    method: 'post',
})

status.definition = {
    methods: ["post"],
    url: '/api/v1/reimbursements/{reimbursement}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::status
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:148
* @route '/api/v1/reimbursements/{reimbursement}/status'
*/
status.url = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return status.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::status
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:148
* @route '/api/v1/reimbursements/{reimbursement}/status'
*/
status.post = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: status.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::status
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:148
* @route '/api/v1/reimbursements/{reimbursement}/status'
*/
const statusForm = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: status.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::status
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:148
* @route '/api/v1/reimbursements/{reimbursement}/status'
*/
statusForm.post = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: status.url(args, options),
    method: 'post',
})

status.form = statusForm

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::resubmit
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:239
* @route '/api/v1/reimbursements/{reimbursement}/resubmit'
*/
export const resubmit = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resubmit.url(args, options),
    method: 'post',
})

resubmit.definition = {
    methods: ["post"],
    url: '/api/v1/reimbursements/{reimbursement}/resubmit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::resubmit
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:239
* @route '/api/v1/reimbursements/{reimbursement}/resubmit'
*/
resubmit.url = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return resubmit.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::resubmit
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:239
* @route '/api/v1/reimbursements/{reimbursement}/resubmit'
*/
resubmit.post = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resubmit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::resubmit
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:239
* @route '/api/v1/reimbursements/{reimbursement}/resubmit'
*/
const resubmitForm = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resubmit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::resubmit
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:239
* @route '/api/v1/reimbursements/{reimbursement}/resubmit'
*/
resubmitForm.post = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resubmit.url(args, options),
    method: 'post',
})

resubmit.form = resubmitForm

const reimbursements = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
    exportExcel: Object.assign(exportExcel, exportExcel),
    show: Object.assign(show, show),
    status: Object.assign(status, status),
    budgets: Object.assign(budgets, budgets),
    code: Object.assign(code, code),
    resubmit: Object.assign(resubmit, resubmit),
    comments: Object.assign(comments, comments),
}

export default reimbursements