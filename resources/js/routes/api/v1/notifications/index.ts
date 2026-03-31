import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\NotificationController::index
* @see app/Http/Controllers/Api/V1/NotificationController.php:16
* @route '/api/v1/notifications'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::index
* @see app/Http/Controllers/Api/V1/NotificationController.php:16
* @route '/api/v1/notifications'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::index
* @see app/Http/Controllers/Api/V1/NotificationController.php:16
* @route '/api/v1/notifications'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::index
* @see app/Http/Controllers/Api/V1/NotificationController.php:16
* @route '/api/v1/notifications'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::index
* @see app/Http/Controllers/Api/V1/NotificationController.php:16
* @route '/api/v1/notifications'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::index
* @see app/Http/Controllers/Api/V1/NotificationController.php:16
* @route '/api/v1/notifications'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::index
* @see app/Http/Controllers/Api/V1/NotificationController.php:16
* @route '/api/v1/notifications'
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
* @see \App\Http\Controllers\Api\V1\NotificationController::unreadCount
* @see app/Http/Controllers/Api/V1/NotificationController.php:51
* @route '/api/v1/notifications/unread-count'
*/
export const unreadCount = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unreadCount.url(options),
    method: 'get',
})

unreadCount.definition = {
    methods: ["get","head"],
    url: '/api/v1/notifications/unread-count',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::unreadCount
* @see app/Http/Controllers/Api/V1/NotificationController.php:51
* @route '/api/v1/notifications/unread-count'
*/
unreadCount.url = (options?: RouteQueryOptions) => {
    return unreadCount.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::unreadCount
* @see app/Http/Controllers/Api/V1/NotificationController.php:51
* @route '/api/v1/notifications/unread-count'
*/
unreadCount.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unreadCount.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::unreadCount
* @see app/Http/Controllers/Api/V1/NotificationController.php:51
* @route '/api/v1/notifications/unread-count'
*/
unreadCount.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: unreadCount.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::unreadCount
* @see app/Http/Controllers/Api/V1/NotificationController.php:51
* @route '/api/v1/notifications/unread-count'
*/
const unreadCountForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: unreadCount.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::unreadCount
* @see app/Http/Controllers/Api/V1/NotificationController.php:51
* @route '/api/v1/notifications/unread-count'
*/
unreadCountForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: unreadCount.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::unreadCount
* @see app/Http/Controllers/Api/V1/NotificationController.php:51
* @route '/api/v1/notifications/unread-count'
*/
unreadCountForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: unreadCount.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

unreadCount.form = unreadCountForm

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::read
* @see app/Http/Controllers/Api/V1/NotificationController.php:63
* @route '/api/v1/notifications/{id}/read'
*/
export const read = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: read.url(args, options),
    method: 'post',
})

read.definition = {
    methods: ["post"],
    url: '/api/v1/notifications/{id}/read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::read
* @see app/Http/Controllers/Api/V1/NotificationController.php:63
* @route '/api/v1/notifications/{id}/read'
*/
read.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return read.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::read
* @see app/Http/Controllers/Api/V1/NotificationController.php:63
* @route '/api/v1/notifications/{id}/read'
*/
read.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: read.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::read
* @see app/Http/Controllers/Api/V1/NotificationController.php:63
* @route '/api/v1/notifications/{id}/read'
*/
const readForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: read.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::read
* @see app/Http/Controllers/Api/V1/NotificationController.php:63
* @route '/api/v1/notifications/{id}/read'
*/
readForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: read.url(args, options),
    method: 'post',
})

read.form = readForm

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::readAll
* @see app/Http/Controllers/Api/V1/NotificationController.php:80
* @route '/api/v1/notifications/read-all'
*/
export const readAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: readAll.url(options),
    method: 'post',
})

readAll.definition = {
    methods: ["post"],
    url: '/api/v1/notifications/read-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::readAll
* @see app/Http/Controllers/Api/V1/NotificationController.php:80
* @route '/api/v1/notifications/read-all'
*/
readAll.url = (options?: RouteQueryOptions) => {
    return readAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::readAll
* @see app/Http/Controllers/Api/V1/NotificationController.php:80
* @route '/api/v1/notifications/read-all'
*/
readAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: readAll.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::readAll
* @see app/Http/Controllers/Api/V1/NotificationController.php:80
* @route '/api/v1/notifications/read-all'
*/
const readAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: readAll.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\NotificationController::readAll
* @see app/Http/Controllers/Api/V1/NotificationController.php:80
* @route '/api/v1/notifications/read-all'
*/
readAllForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: readAll.url(options),
    method: 'post',
})

readAll.form = readAllForm

const notifications = {
    index: Object.assign(index, index),
    unreadCount: Object.assign(unreadCount, unreadCount),
    read: Object.assign(read, read),
    readAll: Object.assign(readAll, readAll),
}

export default notifications