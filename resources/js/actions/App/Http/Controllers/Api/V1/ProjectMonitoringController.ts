import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\ProjectMonitoringController::store
* @see app/Http/Controllers/Api/V1/ProjectMonitoringController.php:16
* @route '/api/v1/projects/{project}/monitorings'
*/
export const store = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/projects/{project}/monitorings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectMonitoringController::store
* @see app/Http/Controllers/Api/V1/ProjectMonitoringController.php:16
* @route '/api/v1/projects/{project}/monitorings'
*/
store.url = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectMonitoringController::store
* @see app/Http/Controllers/Api/V1/ProjectMonitoringController.php:16
* @route '/api/v1/projects/{project}/monitorings'
*/
store.post = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectMonitoringController::store
* @see app/Http/Controllers/Api/V1/ProjectMonitoringController.php:16
* @route '/api/v1/projects/{project}/monitorings'
*/
const storeForm = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectMonitoringController::store
* @see app/Http/Controllers/Api/V1/ProjectMonitoringController.php:16
* @route '/api/v1/projects/{project}/monitorings'
*/
storeForm.post = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\ProjectMonitoringController::destroy
* @see app/Http/Controllers/Api/V1/ProjectMonitoringController.php:37
* @route '/api/v1/projects/{project}/monitorings/{monitoring}'
*/
export const destroy = (args: { project: string | number | { uuid: string | number }, monitoring: string | number | { id: string | number } } | [project: string | number | { uuid: string | number }, monitoring: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/projects/{project}/monitorings/{monitoring}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectMonitoringController::destroy
* @see app/Http/Controllers/Api/V1/ProjectMonitoringController.php:37
* @route '/api/v1/projects/{project}/monitorings/{monitoring}'
*/
destroy.url = (args: { project: string | number | { uuid: string | number }, monitoring: string | number | { id: string | number } } | [project: string | number | { uuid: string | number }, monitoring: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            monitoring: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.uuid
        : args.project,
        monitoring: typeof args.monitoring === 'object'
        ? args.monitoring.id
        : args.monitoring,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{monitoring}', parsedArgs.monitoring.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectMonitoringController::destroy
* @see app/Http/Controllers/Api/V1/ProjectMonitoringController.php:37
* @route '/api/v1/projects/{project}/monitorings/{monitoring}'
*/
destroy.delete = (args: { project: string | number | { uuid: string | number }, monitoring: string | number | { id: string | number } } | [project: string | number | { uuid: string | number }, monitoring: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectMonitoringController::destroy
* @see app/Http/Controllers/Api/V1/ProjectMonitoringController.php:37
* @route '/api/v1/projects/{project}/monitorings/{monitoring}'
*/
const destroyForm = (args: { project: string | number | { uuid: string | number }, monitoring: string | number | { id: string | number } } | [project: string | number | { uuid: string | number }, monitoring: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectMonitoringController::destroy
* @see app/Http/Controllers/Api/V1/ProjectMonitoringController.php:37
* @route '/api/v1/projects/{project}/monitorings/{monitoring}'
*/
destroyForm.delete = (args: { project: string | number | { uuid: string | number }, monitoring: string | number | { id: string | number } } | [project: string | number | { uuid: string | number }, monitoring: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const ProjectMonitoringController = { store, destroy }

export default ProjectMonitoringController