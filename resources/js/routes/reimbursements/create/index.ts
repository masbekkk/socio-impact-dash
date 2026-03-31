import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReimbursementController::atr
* @see app/Http/Controllers/ReimbursementController.php:58
* @route '/reimbursements/create/atr'
*/
export const atr = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: atr.url(options),
    method: 'get',
})

atr.definition = {
    methods: ["get","head"],
    url: '/reimbursements/create/atr',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReimbursementController::atr
* @see app/Http/Controllers/ReimbursementController.php:58
* @route '/reimbursements/create/atr'
*/
atr.url = (options?: RouteQueryOptions) => {
    return atr.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::atr
* @see app/Http/Controllers/ReimbursementController.php:58
* @route '/reimbursements/create/atr'
*/
atr.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: atr.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::atr
* @see app/Http/Controllers/ReimbursementController.php:58
* @route '/reimbursements/create/atr'
*/
atr.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: atr.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReimbursementController::atr
* @see app/Http/Controllers/ReimbursementController.php:58
* @route '/reimbursements/create/atr'
*/
const atrForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: atr.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::atr
* @see app/Http/Controllers/ReimbursementController.php:58
* @route '/reimbursements/create/atr'
*/
atrForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: atr.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::atr
* @see app/Http/Controllers/ReimbursementController.php:58
* @route '/reimbursements/create/atr'
*/
atrForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: atr.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

atr.form = atrForm

/**
* @see \App\Http\Controllers\ReimbursementController::eer
* @see app/Http/Controllers/ReimbursementController.php:119
* @route '/reimbursements/create/eer'
*/
export const eer = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eer.url(options),
    method: 'get',
})

eer.definition = {
    methods: ["get","head"],
    url: '/reimbursements/create/eer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReimbursementController::eer
* @see app/Http/Controllers/ReimbursementController.php:119
* @route '/reimbursements/create/eer'
*/
eer.url = (options?: RouteQueryOptions) => {
    return eer.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::eer
* @see app/Http/Controllers/ReimbursementController.php:119
* @route '/reimbursements/create/eer'
*/
eer.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eer.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::eer
* @see app/Http/Controllers/ReimbursementController.php:119
* @route '/reimbursements/create/eer'
*/
eer.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: eer.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReimbursementController::eer
* @see app/Http/Controllers/ReimbursementController.php:119
* @route '/reimbursements/create/eer'
*/
const eerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: eer.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::eer
* @see app/Http/Controllers/ReimbursementController.php:119
* @route '/reimbursements/create/eer'
*/
eerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: eer.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::eer
* @see app/Http/Controllers/ReimbursementController.php:119
* @route '/reimbursements/create/eer'
*/
eerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: eer.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

eer.form = eerForm

/**
* @see \App\Http\Controllers\ReimbursementController::allowance
* @see app/Http/Controllers/ReimbursementController.php:188
* @route '/reimbursements/create/allowance'
*/
export const allowance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: allowance.url(options),
    method: 'get',
})

allowance.definition = {
    methods: ["get","head"],
    url: '/reimbursements/create/allowance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReimbursementController::allowance
* @see app/Http/Controllers/ReimbursementController.php:188
* @route '/reimbursements/create/allowance'
*/
allowance.url = (options?: RouteQueryOptions) => {
    return allowance.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReimbursementController::allowance
* @see app/Http/Controllers/ReimbursementController.php:188
* @route '/reimbursements/create/allowance'
*/
allowance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: allowance.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::allowance
* @see app/Http/Controllers/ReimbursementController.php:188
* @route '/reimbursements/create/allowance'
*/
allowance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: allowance.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReimbursementController::allowance
* @see app/Http/Controllers/ReimbursementController.php:188
* @route '/reimbursements/create/allowance'
*/
const allowanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: allowance.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::allowance
* @see app/Http/Controllers/ReimbursementController.php:188
* @route '/reimbursements/create/allowance'
*/
allowanceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: allowance.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReimbursementController::allowance
* @see app/Http/Controllers/ReimbursementController.php:188
* @route '/reimbursements/create/allowance'
*/
allowanceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: allowance.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

allowance.form = allowanceForm
