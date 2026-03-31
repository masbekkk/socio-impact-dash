import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::update
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:189
* @route '/api/v1/reimbursements/{reimbursement}/budgets'
*/
export const update = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/api/v1/reimbursements/{reimbursement}/budgets',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::update
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:189
* @route '/api/v1/reimbursements/{reimbursement}/budgets'
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
* @see \App\Http\Controllers\Api\V1\ReimbursementController::update
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:189
* @route '/api/v1/reimbursements/{reimbursement}/budgets'
*/
update.patch = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::update
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:189
* @route '/api/v1/reimbursements/{reimbursement}/budgets'
*/
const updateForm = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::update
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:189
* @route '/api/v1/reimbursements/{reimbursement}/budgets'
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

const budgets = {
    update: Object.assign(update, update),
}

export default budgets