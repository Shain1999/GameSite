const usersDal = require("../dal/users-dal");
const config = require('../config/config.json');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const ServerError = require("../errors/server-error");
const ErrorType = require('../errors/error-types')



// this function generate a token based on user data
async function login(userLoginData) {
    // encrypting password
    userLoginData.password = encryptPassword(userLoginData.password);
    let userData = await usersDal.login(userLoginData);
    // if user failed to connect
    if (!userData) {
        throw new ServerError(ErrorType.UNAUTHORIZED);
    }
    console.log(userData);
    // generating a new jwt token based on user data and secret
    const token = jwt.sign({ userId: userData.id, userType: userData.userType }, config.secret);
    let successfulLoginResponse = { token, firstName: userData.firstName, lastName: userData.lastName };
    return successfulLoginResponse;
}
// this function encrypt the password without a way to revert back
function encryptPassword(password) {
    const saltRight = "#@$%^!kajh";
    const saltLeft = "--mnlcfs;@!$ ";
    let passwordWithSalt = saltLeft + password + saltRight;
    return crypto.createHash("md5").update(passwordWithSalt).digest("hex");
}
// validating user data
function validateUserData(userData) {
    if (!userData.userName) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'invalid user name', e);
    }
    if (!userData.password) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'invalid password', e);
    }
    if (userData.password.length < 6) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'password to short', e);

    }
    if (userData.password.length > 12) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'password to long', e);
    }

}
async function addUser(userData) {

    validateUserData(userData);
    // checking if the user name already exist
    if (await usersDal.isUserNameExist(userData.userName)) {
        throw new ServerError(ErrorType.USER_NAME_ALREADY_EXIST);
    }
    // if the users didnt pass all props normalize data for db
    normalizeOptionalData(userData);
    // encrypting password and generating new id 
    userData.password = encryptPassword(userData.password);
    try {
        await usersDal.addUser(userData);
    } catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'cant add user', error);

    }

}
function normalizeOptionalData(userRegistrationData) {
    if (!userRegistrationData.firstName) {
        userRegistrationData.firstName = "";
    }

    if (!userRegistrationData.lastName) {
        userRegistrationData.lastName = "";
    }
}
module.exports = {
    login,
    addUser
}