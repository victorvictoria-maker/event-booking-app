import { Status } from '../interfaces/status.interface';
export  const UserApiResp = {
    NO_AUTHORIZATION_HEADER: {
        code: 'NAH0401', status: Status.UN_AUTHORIZED, message: 'Please specify authorization header'
    },
    NOT_AUTHORIZED: {
        code: 'NA00401', status: Status.UN_AUTHORIZED, message: 'You are not authorized'
    },
    USER_NOT_FOUND: {
        code: 'UNF0401', status: Status.UN_AUTHORIZED, message: 'User not found'
    },
    USER_DEACTIVATED: {
        code: 'UD00401', status: Status.UN_AUTHORIZED, message: 'Your account has been deactivated'
    },
    UNVERIFIED_EMAIL: {
        code: 'UE00403', status: Status.FORBIDDEN, message: 'Your email address is not verified'
    },
    UNCOMPELETE_ACCOUNT_SETUP: {
        code: 'UAS0403', status: Status.FORBIDDEN, message: 'Account setup is not completed'
    },
    UNCOMPELETE_PIN_SETUP: {
        code: 'UPS0403', status: Status.FORBIDDEN, message: 'Pin setup is not completed'
    },
    NO_PIN_TOKEN_HEADER: {
        code: 'NPTH401', status: Status.UN_AUTHORIZED, message: 'Please specify pin_token header'
    },
    EXPIRED_PIN_TOKEN: {
        code: 'EPT0401', status: Status.UN_AUTHORIZED, message: 'Your session has expired, Please login with your pin'
    },
}