import SessionController from './SessionController'
import Api from './Api'
import DashboardController from './DashboardController'
import CalendarController from './CalendarController'
import PresenceController from './PresenceController'
import ProjectController from './ProjectController'
import ReimbursementController from './ReimbursementController'
import LetterRequestController from './LetterRequestController'
import LeaveController from './LeaveController'
import Admin from './Admin'
import UserController from './UserController'
import UserProfileController from './UserProfileController'
import UserPasswordController from './UserPasswordController'
import UserTwoFactorAuthenticationController from './UserTwoFactorAuthenticationController'
import UserEmailResetNotification from './UserEmailResetNotification'
import UserEmailVerificationNotificationController from './UserEmailVerificationNotificationController'
import UserEmailVerification from './UserEmailVerification'

const Controllers = {
    SessionController: Object.assign(SessionController, SessionController),
    Api: Object.assign(Api, Api),
    DashboardController: Object.assign(DashboardController, DashboardController),
    CalendarController: Object.assign(CalendarController, CalendarController),
    PresenceController: Object.assign(PresenceController, PresenceController),
    ProjectController: Object.assign(ProjectController, ProjectController),
    ReimbursementController: Object.assign(ReimbursementController, ReimbursementController),
    LetterRequestController: Object.assign(LetterRequestController, LetterRequestController),
    LeaveController: Object.assign(LeaveController, LeaveController),
    Admin: Object.assign(Admin, Admin),
    UserController: Object.assign(UserController, UserController),
    UserProfileController: Object.assign(UserProfileController, UserProfileController),
    UserPasswordController: Object.assign(UserPasswordController, UserPasswordController),
    UserTwoFactorAuthenticationController: Object.assign(UserTwoFactorAuthenticationController, UserTwoFactorAuthenticationController),
    UserEmailResetNotification: Object.assign(UserEmailResetNotification, UserEmailResetNotification),
    UserEmailVerificationNotificationController: Object.assign(UserEmailVerificationNotificationController, UserEmailVerificationNotificationController),
    UserEmailVerification: Object.assign(UserEmailVerification, UserEmailVerification),
}

export default Controllers