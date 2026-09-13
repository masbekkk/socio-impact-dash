import UserController from './UserController'
import DivisionController from './DivisionController'
import UserKpiController from './UserKpiController'
import LetterCodeController from './LetterCodeController'
import LetterDivisionController from './LetterDivisionController'
import ImpersonationController from './ImpersonationController'

const Admin = {
    UserController: Object.assign(UserController, UserController),
    DivisionController: Object.assign(DivisionController, DivisionController),
    UserKpiController: Object.assign(UserKpiController, UserKpiController),
    LetterCodeController: Object.assign(LetterCodeController, LetterCodeController),
    LetterDivisionController: Object.assign(LetterDivisionController, LetterDivisionController),
    ImpersonationController: Object.assign(ImpersonationController, ImpersonationController),
}

export default Admin