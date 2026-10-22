import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\ProjectClosingController::close
* @see app/Http/Controllers/Api/V1/ProjectClosingController.php:16
* @route '/api/v1/projects/{project}/close'
*/
export const close = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

close.definition = {
    methods: ["post"],
    url: '/api/v1/projects/{project}/close',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectClosingController::close
* @see app/Http/Controllers/Api/V1/ProjectClosingController.php:16
* @route '/api/v1/projects/{project}/close'
*/
close.url = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions) => {
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

    return close.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectClosingController::close
* @see app/Http/Controllers/Api/V1/ProjectClosingController.php:16
* @route '/api/v1/projects/{project}/close'
*/
close.post = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectClosingController::close
* @see app/Http/Controllers/Api/V1/ProjectClosingController.php:16
* @route '/api/v1/projects/{project}/close'
*/
const closeForm = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: close.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectClosingController::close
* @see app/Http/Controllers/Api/V1/ProjectClosingController.php:16
* @route '/api/v1/projects/{project}/close'
*/
closeForm.post = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: close.url(args, options),
    method: 'post',
})

close.form = closeForm

const ProjectClosingController = { close }

export default ProjectClosingController