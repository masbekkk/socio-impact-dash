import ProjectController from './ProjectController'
import ProjectApprovalController from './ProjectApprovalController'
import ProjectClosingController from './ProjectClosingController'
import ProjectMonitoringController from './ProjectMonitoringController'
import ProjectTerminPaymentController from './ProjectTerminPaymentController'
import ReimbursementController from './ReimbursementController'
import ReimbursementCommentController from './ReimbursementCommentController'
import LetterRequestController from './LetterRequestController'
import UserController from './UserController'
import DivisionController from './DivisionController'
import LetterCodeController from './LetterCodeController'
import LetterDivisionController from './LetterDivisionController'
import LeaveController from './LeaveController'
import NotificationController from './NotificationController'

const V1 = {
    ProjectController: Object.assign(ProjectController, ProjectController),
    ProjectApprovalController: Object.assign(ProjectApprovalController, ProjectApprovalController),
    ProjectClosingController: Object.assign(ProjectClosingController, ProjectClosingController),
    ProjectMonitoringController: Object.assign(ProjectMonitoringController, ProjectMonitoringController),
    ProjectTerminPaymentController: Object.assign(ProjectTerminPaymentController, ProjectTerminPaymentController),
    ReimbursementController: Object.assign(ReimbursementController, ReimbursementController),
    ReimbursementCommentController: Object.assign(ReimbursementCommentController, ReimbursementCommentController),
    LetterRequestController: Object.assign(LetterRequestController, LetterRequestController),
    UserController: Object.assign(UserController, UserController),
    DivisionController: Object.assign(DivisionController, DivisionController),
    LetterCodeController: Object.assign(LetterCodeController, LetterCodeController),
    LetterDivisionController: Object.assign(LetterDivisionController, LetterDivisionController),
    LeaveController: Object.assign(LeaveController, LeaveController),
    NotificationController: Object.assign(NotificationController, NotificationController),
}

export default V1