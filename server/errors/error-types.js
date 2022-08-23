let ErrorType = {
    GENERAL_ERROR: { id: 1, httpCode: 600, message: 'Something went badly wrong', isShowStackTrace: true },
    USER_NAME_ALREADY_EXIST: { id: 2, httpCode: 601, message: 'UserName already exist', isShowStackTrace: false },
    UNAUTHORIZED: { id: 3, httpCode: 401, message: 'login failed invalid user name or password', isShowStackTrace: false },
}
module.exports = ErrorType;