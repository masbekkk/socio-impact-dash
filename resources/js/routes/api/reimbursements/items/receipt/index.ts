import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::update
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:543
* @route '/api/v1/reimbursements/{reimbursement}/items/{item}/receipt'
*/
export const update = (args: { reimbursement: string | number, item: string | number } | [reimbursement: string | number, item: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/api/v1/reimbursements/{reimbursement}/items/{item}/receipt',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::update
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:543
* @route '/api/v1/reimbursements/{reimbursement}/items/{item}/receipt'
*/
update.url = (args: { reimbursement: string | number, item: string | number } | [reimbursement: string | number, item: string | number ], options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::update
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:543
* @route '/api/v1/reimbursements/{reimbursement}/items/{item}/receipt'
*/
update.post = (args: { reimbursement: string | number, item: string | number } | [reimbursement: string | number, item: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::update
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:543
* @route '/api/v1/reimbursements/{reimbursement}/items/{item}/receipt'
*/
const updateForm = (args: { reimbursement: string | number, item: string | number } | [reimbursement: string | number, item: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ReimbursementController::update
* @see app/Http/Controllers/Api/V1/ReimbursementController.php:543
* @route '/api/v1/reimbursements/{reimbursement}/items/{item}/receipt'
*/
updateForm.post = (args: { reimbursement: string | number, item: string | number } | [reimbursement: string | number, item: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

update.form = updateForm

const receipt = {
    update: Object.assign(update, update),
}

export default receipt