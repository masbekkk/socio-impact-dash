import projects from './projects'
import reimbursements from './reimbursements'
import letterRequests from './letter-requests'
import users from './users'
import divisions from './divisions'
import letterCodes from './letter-codes'
import letterDivisions from './letter-divisions'
import leaves from './leaves'
import v1 from './v1'

const api = {
    projects: Object.assign(projects, projects),
    reimbursements: Object.assign(reimbursements, reimbursements),
    letterRequests: Object.assign(letterRequests, letterRequests),
    users: Object.assign(users, users),
    divisions: Object.assign(divisions, divisions),
    letterCodes: Object.assign(letterCodes, letterCodes),
    letterDivisions: Object.assign(letterDivisions, letterDivisions),
    leaves: Object.assign(leaves, leaves),
    v1: Object.assign(v1, v1),
}

export default api