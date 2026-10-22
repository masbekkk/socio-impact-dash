import RoleController from './RoleController'
import PermissionController from './PermissionController'
import V1 from './V1'

const Api = {
    RoleController: Object.assign(RoleController, RoleController),
    PermissionController: Object.assign(PermissionController, PermissionController),
    V1: Object.assign(V1, V1),
}

export default Api