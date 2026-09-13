import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
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
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:491
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
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:491
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
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:491
* @route '/api/v1/reimbursements/{reimbursement}'
*/
destroy.delete = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::destroy
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:491
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
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:491
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
const exportExcele1c8031be9f76e6789a40096b8752234 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcele1c8031be9f76e6789a40096b8752234.url(options),
    method: 'get',
})

exportExcele1c8031be9f76e6789a40096b8752234.definition = {
    methods: ["get","head"],
    url: '/api/v1/reimbursements/export-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/api/v1/reimbursements/export-excel'
*/
exportExcele1c8031be9f76e6789a40096b8752234.url = (options?: RouteQueryOptions) => {
    return exportExcele1c8031be9f76e6789a40096b8752234.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/api/v1/reimbursements/export-excel'
*/
exportExcele1c8031be9f76e6789a40096b8752234.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcele1c8031be9f76e6789a40096b8752234.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/api/v1/reimbursements/export-excel'
*/
exportExcele1c8031be9f76e6789a40096b8752234.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportExcele1c8031be9f76e6789a40096b8752234.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/api/v1/reimbursements/export-excel'
*/
const exportExcele1c8031be9f76e6789a40096b8752234Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcele1c8031be9f76e6789a40096b8752234.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/api/v1/reimbursements/export-excel'
*/
exportExcele1c8031be9f76e6789a40096b8752234Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcele1c8031be9f76e6789a40096b8752234.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/api/v1/reimbursements/export-excel'
*/
exportExcele1c8031be9f76e6789a40096b8752234Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcele1c8031be9f76e6789a40096b8752234.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportExcele1c8031be9f76e6789a40096b8752234.form = exportExcele1c8031be9f76e6789a40096b8752234Form
/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/reimbursements/export-excel'
*/
const exportExcel6944eb4a9ae9c9e95c91252971156efa = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcel6944eb4a9ae9c9e95c91252971156efa.url(options),
    method: 'get',
})

exportExcel6944eb4a9ae9c9e95c91252971156efa.definition = {
    methods: ["get","head"],
    url: '/reimbursements/export-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/reimbursements/export-excel'
*/
exportExcel6944eb4a9ae9c9e95c91252971156efa.url = (options?: RouteQueryOptions) => {
    return exportExcel6944eb4a9ae9c9e95c91252971156efa.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/reimbursements/export-excel'
*/
exportExcel6944eb4a9ae9c9e95c91252971156efa.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcel6944eb4a9ae9c9e95c91252971156efa.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/reimbursements/export-excel'
*/
exportExcel6944eb4a9ae9c9e95c91252971156efa.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportExcel6944eb4a9ae9c9e95c91252971156efa.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/reimbursements/export-excel'
*/
const exportExcel6944eb4a9ae9c9e95c91252971156efaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcel6944eb4a9ae9c9e95c91252971156efa.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/reimbursements/export-excel'
*/
exportExcel6944eb4a9ae9c9e95c91252971156efaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcel6944eb4a9ae9c9e95c91252971156efa.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::exportExcel
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:63
* @route '/reimbursements/export-excel'
*/
exportExcel6944eb4a9ae9c9e95c91252971156efaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcel6944eb4a9ae9c9e95c91252971156efa.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportExcel6944eb4a9ae9c9e95c91252971156efa.form = exportExcel6944eb4a9ae9c9e95c91252971156efaForm

export const exportExcel = {
    '/api/v1/reimbursements/export-excel': exportExcele1c8031be9f76e6789a40096b8752234,
    '/reimbursements/export-excel': exportExcel6944eb4a9ae9c9e95c91252971156efa,
}

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
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateStatus
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:148
* @route '/api/v1/reimbursements/{reimbursement}/status'
*/
export const updateStatus = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.definition = {
    methods: ["post"],
    url: '/api/v1/reimbursements/{reimbursement}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateStatus
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:148
* @route '/api/v1/reimbursements/{reimbursement}/status'
*/
updateStatus.url = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateStatus.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateStatus
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:148
* @route '/api/v1/reimbursements/{reimbursement}/status'
*/
updateStatus.post = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateStatus
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:148
* @route '/api/v1/reimbursements/{reimbursement}/status'
*/
const updateStatusForm = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateStatus
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:148
* @route '/api/v1/reimbursements/{reimbursement}/status'
*/
updateStatusForm.post = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.form = updateStatusForm

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateBudgets
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:190
* @route '/api/v1/reimbursements/{reimbursement}/budgets'
*/
export const updateBudgets = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateBudgets.url(args, options),
    method: 'patch',
})

updateBudgets.definition = {
    methods: ["patch"],
    url: '/api/v1/reimbursements/{reimbursement}/budgets',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateBudgets
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:190
* @route '/api/v1/reimbursements/{reimbursement}/budgets'
*/
updateBudgets.url = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateBudgets.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateBudgets
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:190
* @route '/api/v1/reimbursements/{reimbursement}/budgets'
*/
updateBudgets.patch = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateBudgets.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateBudgets
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:190
* @route '/api/v1/reimbursements/{reimbursement}/budgets'
*/
const updateBudgetsForm = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateBudgets.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateBudgets
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:190
* @route '/api/v1/reimbursements/{reimbursement}/budgets'
*/
updateBudgetsForm.patch = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateBudgets.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateBudgets.form = updateBudgetsForm

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateCode
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:514
* @route '/api/v1/reimbursements/{reimbursement}/code'
*/
export const updateCode = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateCode.url(args, options),
    method: 'patch',
})

updateCode.definition = {
    methods: ["patch"],
    url: '/api/v1/reimbursements/{reimbursement}/code',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateCode
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:514
* @route '/api/v1/reimbursements/{reimbursement}/code'
*/
updateCode.url = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateCode.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateCode
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:514
* @route '/api/v1/reimbursements/{reimbursement}/code'
*/
updateCode.patch = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateCode.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateCode
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:514
* @route '/api/v1/reimbursements/{reimbursement}/code'
*/
const updateCodeForm = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateCode.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateCode
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:514
* @route '/api/v1/reimbursements/{reimbursement}/code'
*/
updateCodeForm.patch = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateCode.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateCode.form = updateCodeForm

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::resubmit
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:240
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
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:240
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
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:240
* @route '/api/v1/reimbursements/{reimbursement}/resubmit'
*/
resubmit.post = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resubmit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::resubmit
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:240
* @route '/api/v1/reimbursements/{reimbursement}/resubmit'
*/
const resubmitForm = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resubmit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::resubmit
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:240
* @route '/api/v1/reimbursements/{reimbursement}/resubmit'
*/
resubmitForm.post = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resubmit.url(args, options),
    method: 'post',
})

resubmit.form = resubmitForm

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateItemReceipt
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:543
* @route '/api/v1/reimbursements/{reimbursement}/items/{item}/receipt'
*/
export const updateItemReceipt = (args: { reimbursement: string | number, item: string | number } | [reimbursement: string | number, item: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateItemReceipt.url(args, options),
    method: 'post',
})

updateItemReceipt.definition = {
    methods: ["post"],
    url: '/api/v1/reimbursements/{reimbursement}/items/{item}/receipt',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateItemReceipt
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:543
* @route '/api/v1/reimbursements/{reimbursement}/items/{item}/receipt'
*/
updateItemReceipt.url = (args: { reimbursement: string | number, item: string | number } | [reimbursement: string | number, item: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            reimbursement: args[0],
            item: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        reimbursement: args.reimbursement,
        item: args.item,
    }

    return updateItemReceipt.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateItemReceipt
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:543
* @route '/api/v1/reimbursements/{reimbursement}/items/{item}/receipt'
*/
updateItemReceipt.post = (args: { reimbursement: string | number, item: string | number } | [reimbursement: string | number, item: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateItemReceipt.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateItemReceipt
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:543
* @route '/api/v1/reimbursements/{reimbursement}/items/{item}/receipt'
*/
const updateItemReceiptForm = (args: { reimbursement: string | number, item: string | number } | [reimbursement: string | number, item: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateItemReceipt.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::updateItemReceipt
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:543
* @route '/api/v1/reimbursements/{reimbursement}/items/{item}/receipt'
*/
updateItemReceiptForm.post = (args: { reimbursement: string | number, item: string | number } | [reimbursement: string | number, item: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateItemReceipt.url(args, options),
    method: 'post',
})

updateItemReceipt.form = updateItemReceiptForm

const ReimbursementController = { index, store, destroy, exportExcel, show, updateStatus, updateBudgets, updateCode, resubmit, updateItemReceipt }

export default ReimbursementController