import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\ProjectApprovalController::approve
* @see app/Http/Controllers/Api/V1/ProjectApprovalController.php:17
* @route '/api/v1/projects/{project}/approve'
*/
export const approve = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/api/v1/projects/{project}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectApprovalController::approve
* @see app/Http/Controllers/Api/V1/ProjectApprovalController.php:17
* @route '/api/v1/projects/{project}/approve'
*/
approve.url = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { project: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { project: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            project: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.uuid
        : args.project,
    }

    return approve.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectApprovalController::approve
* @see app/Http/Controllers/Api/V1/ProjectApprovalController.php:17
* @route '/api/v1/projects/{project}/approve'
*/
approve.post = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectApprovalController::approve
* @see app/Http/Controllers/Api/V1/ProjectApprovalController.php:17
* @route '/api/v1/projects/{project}/approve'
*/
const approveForm = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectApprovalController::approve
* @see app/Http/Controllers/Api/V1/ProjectApprovalController.php:17
* @route '/api/v1/projects/{project}/approve'
*/
approveForm.post = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\Api\V1\ProjectApprovalController::reject
* @see app/Http/Controllers/Api/V1/ProjectApprovalController.php:31
* @route '/api/v1/projects/{project}/reject'
*/
export const reject = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/api/v1/projects/{project}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectApprovalController::reject
* @see app/Http/Controllers/Api/V1/ProjectApprovalController.php:31
* @route '/api/v1/projects/{project}/reject'
*/
reject.url = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { project: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { project: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            project: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.uuid
        : args.project,
    }

    return reject.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectApprovalController::reject
* @see app/Http/Controllers/Api/V1/ProjectApprovalController.php:31
* @route '/api/v1/projects/{project}/reject'
*/
reject.post = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectApprovalController::reject
* @see app/Http/Controllers/Api/V1/ProjectApprovalController.php:31
* @route '/api/v1/projects/{project}/reject'
*/
const rejectForm = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectApprovalController::reject
* @see app/Http/Controllers/Api/V1/ProjectApprovalController.php:31
* @route '/api/v1/projects/{project}/reject'
*/
rejectForm.post = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

const ProjectApprovalController = { approve, reject }

export default ProjectApprovalController