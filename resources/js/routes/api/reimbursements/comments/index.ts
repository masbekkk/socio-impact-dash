import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\ReimbursementCommentController::store
* @see app/Http/Controllers/Api/V1/ReimbursementCommentController.php:16
* @route '/api/v1/reimbursements/{reimbursement}/comments'
*/
export const store = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/reimbursements/{reimbursement}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementCommentController::store
* @see app/Http/Controllers/Api/V1/ReimbursementCommentController.php:16
* @route '/api/v1/reimbursements/{reimbursement}/comments'
*/
store.url = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementCommentController::store
* @see app/Http/Controllers/Api/V1/ReimbursementCommentController.php:16
* @route '/api/v1/reimbursements/{reimbursement}/comments'
*/
store.post = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementCommentController::store
* @see app/Http/Controllers/Api/V1/ReimbursementCommentController.php:16
* @route '/api/v1/reimbursements/{reimbursement}/comments'
*/
const storeForm = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementCommentController::store
* @see app/Http/Controllers/Api/V1/ReimbursementCommentController.php:16
* @route '/api/v1/reimbursements/{reimbursement}/comments'
*/
storeForm.post = (args: { reimbursement: string | number } | [reimbursement: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const comments = {
    store: Object.assign(store, store),
}

export default comments