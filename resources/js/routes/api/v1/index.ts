import calendar from './calendar'
import notifications from './notifications'

const v1 = {
    calendar: Object.assign(calendar, calendar),
    notifications: Object.assign(notifications, notifications),
}

export default v1