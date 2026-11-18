import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\ProjectTerminPaymentController::update
* @see app/Http/Controllers/Api/V1/ProjectTerminPaymentController.php:16
* @route '/api/v1/projects/{project}/termins/{termin}'
*/
export const update = (args: { project: string | number | { uuid: string | number }, termin: string | number | { id: string | number } } | [project: string | number | { uuid: string | number }, termin: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/api/v1/projects/{project}/termins/{termin}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectTerminPaymentController::update
* @see app/Http/Controllers/Api/V1/ProjectTerminPaymentController.php:16
* @route '/api/v1/projects/{project}/termins/{termin}'
*/
update.url = (args: { project: string | number | { uuid: string | number }, termin: string | number | { id: string | number } } | [project: string | number | { uuid: string | number }, termin: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            termin: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.uuid
        : args.project,
        termin: typeof args.termin === 'object'
        ? args.termin.id
        : args.termin,
    }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{termin}', parsedArgs.termin.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectTerminPaymentController::update
* @see app/Http/Controllers/Api/V1/ProjectTerminPaymentController.php:16
* @route '/api/v1/projects/{project}/termins/{termin}'
*/
update.post = (args: { project: string | number | { uuid: string | number }, termin: string | number | { id: string | number } } | [project: string | number | { uuid: string | number }, termin: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectTerminPaymentController::update
* @see app/Http/Controllers/Api/V1/ProjectTerminPaymentController.php:16
* @route '/api/v1/projects/{project}/termins/{termin}'
*/
const updateForm = (args: { project: string | number | { uuid: string | number }, termin: string | number | { id: string | number } } | [project: string | number | { uuid: string | number }, termin: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectTerminPaymentController::update
* @see app/Http/Controllers/Api/V1/ProjectTerminPaymentController.php:16
* @route '/api/v1/projects/{project}/termins/{termin}'
*/
updateForm.post = (args: { project: string | number | { uuid: string | number }, termin: string | number | { id: string | number } } | [project: string | number | { uuid: string | number }, termin: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

update.form = updateForm

const ProjectTerminPaymentController = { update }

export default ProjectTerminPaymentController