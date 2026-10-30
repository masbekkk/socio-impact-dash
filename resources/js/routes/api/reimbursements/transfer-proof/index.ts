import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::replace
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:263
* @route '/api/v1/reimbursements/{reimbursement}/transfer-proof'
*/
export const replace = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: replace.url(args, options),
    method: 'post',
})

replace.definition = {
    methods: ["post"],
    url: '/api/v1/reimbursements/{reimbursement}/transfer-proof',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::replace
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:263
* @route '/api/v1/reimbursements/{reimbursement}/transfer-proof'
*/
replace.url = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return replace.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::replace
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:263
* @route '/api/v1/reimbursements/{reimbursement}/transfer-proof'
*/
replace.post = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: replace.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::replace
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:263
* @route '/api/v1/reimbursements/{reimbursement}/transfer-proof'
*/
const replaceForm = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: replace.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::replace
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:263
* @route '/api/v1/reimbursements/{reimbursement}/transfer-proof'
*/
replaceForm.post = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: replace.url(args, options),
    method: 'post',
})

replace.form = replaceForm

const transferProof = {
    replace: Object.assign(replace, replace),
}

export default transferProof