import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\ProjectController::deal
* @see app/Http/Controllers/Api/V1/ProjectController.php:173
* @route '/api/v1/projects/{project}/deal'
*/
export const deal = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deal.url(args, options),
    method: 'post',
})

deal.definition = {
    methods: ["post"],
    url: '/api/v1/projects/{project}/deal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::deal
* @see app/Http/Controllers/Api/V1/ProjectController.php:173
* @route '/api/v1/projects/{project}/deal'
*/
deal.url = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions) => {
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

    return deal.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::deal
* @see app/Http/Controllers/Api/V1/ProjectController.php:173
* @route '/api/v1/projects/{project}/deal'
*/
deal.post = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deal.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::deal
* @see app/Http/Controllers/Api/V1/ProjectController.php:173
* @route '/api/v1/projects/{project}/deal'
*/
const dealForm = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deal.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::deal
* @see app/Http/Controllers/Api/V1/ProjectController.php:173
* @route '/api/v1/projects/{project}/deal'
*/
dealForm.post = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deal.url(args, options),
    method: 'post',
})

deal.form = dealForm

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::index
* @see app/Http/Controllers/Api/V1/ProjectController.php:24
* @route '/api/v1/projects'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/projects',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::index
* @see app/Http/Controllers/Api/V1/ProjectController.php:24
* @route '/api/v1/projects'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::index
* @see app/Http/Controllers/Api/V1/ProjectController.php:24
* @route '/api/v1/projects'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::index
* @see app/Http/Controllers/Api/V1/ProjectController.php:24
* @route '/api/v1/projects'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::index
* @see app/Http/Controllers/Api/V1/ProjectController.php:24
* @route '/api/v1/projects'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::index
* @see app/Http/Controllers/Api/V1/ProjectController.php:24
* @route '/api/v1/projects'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::index
* @see app/Http/Controllers/Api/V1/ProjectController.php:24
* @route '/api/v1/projects'
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
* @see \App\Http\Controllers\Api\V1\ProjectController::store
* @see app/Http/Controllers/Api/V1/ProjectController.php:124
* @route '/api/v1/projects'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/projects',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::store
* @see app/Http/Controllers/Api/V1/ProjectController.php:124
* @route '/api/v1/projects'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::store
* @see app/Http/Controllers/Api/V1/ProjectController.php:124
* @route '/api/v1/projects'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::store
* @see app/Http/Controllers/Api/V1/ProjectController.php:124
* @route '/api/v1/projects'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::store
* @see app/Http/Controllers/Api/V1/ProjectController.php:124
* @route '/api/v1/projects'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::show
* @see app/Http/Controllers/Api/V1/ProjectController.php:141
* @route '/api/v1/projects/{project}'
*/
export const show = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/projects/{project}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::show
* @see app/Http/Controllers/Api/V1/ProjectController.php:141
* @route '/api/v1/projects/{project}'
*/
show.url = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::show
* @see app/Http/Controllers/Api/V1/ProjectController.php:141
* @route '/api/v1/projects/{project}'
*/
show.get = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::show
* @see app/Http/Controllers/Api/V1/ProjectController.php:141
* @route '/api/v1/projects/{project}'
*/
show.head = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::show
* @see app/Http/Controllers/Api/V1/ProjectController.php:141
* @route '/api/v1/projects/{project}'
*/
const showForm = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::show
* @see app/Http/Controllers/Api/V1/ProjectController.php:141
* @route '/api/v1/projects/{project}'
*/
showForm.get = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::show
* @see app/Http/Controllers/Api/V1/ProjectController.php:141
* @route '/api/v1/projects/{project}'
*/
showForm.head = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\ProjectController::update
* @see app/Http/Controllers/Api/V1/ProjectController.php:151
* @route '/api/v1/projects/{project}'
*/
export const update = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/projects/{project}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::update
* @see app/Http/Controllers/Api/V1/ProjectController.php:151
* @route '/api/v1/projects/{project}'
*/
update.url = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::update
* @see app/Http/Controllers/Api/V1/ProjectController.php:151
* @route '/api/v1/projects/{project}'
*/
update.put = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::update
* @see app/Http/Controllers/Api/V1/ProjectController.php:151
* @route '/api/v1/projects/{project}'
*/
update.patch = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::update
* @see app/Http/Controllers/Api/V1/ProjectController.php:151
* @route '/api/v1/projects/{project}'
*/
const updateForm = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::update
* @see app/Http/Controllers/Api/V1/ProjectController.php:151
* @route '/api/v1/projects/{project}'
*/
updateForm.put = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::update
* @see app/Http/Controllers/Api/V1/ProjectController.php:151
* @route '/api/v1/projects/{project}'
*/
updateForm.patch = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::destroy
* @see app/Http/Controllers/Api/V1/ProjectController.php:163
* @route '/api/v1/projects/{project}'
*/
export const destroy = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/projects/{project}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::destroy
* @see app/Http/Controllers/Api/V1/ProjectController.php:163
* @route '/api/v1/projects/{project}'
*/
destroy.url = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::destroy
* @see app/Http/Controllers/Api/V1/ProjectController.php:163
* @route '/api/v1/projects/{project}'
*/
destroy.delete = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::destroy
* @see app/Http/Controllers/Api/V1/ProjectController.php:163
* @route '/api/v1/projects/{project}'
*/
const destroyForm = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::destroy
* @see app/Http/Controllers/Api/V1/ProjectController.php:163
* @route '/api/v1/projects/{project}'
*/
destroyForm.delete = (args: { project: string | number | { uuid: string | number } } | [project: string | number | { uuid: string | number } ] | string | number | { uuid: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const ProjectController = { deal, index, store, show, update, destroy }

export default ProjectController