const express = require("express");
const usersLogic = require("../logic/users-logic");
const router = express.Router();

router.post("/login", async (request, response, next) => {
    // Extracting the JSON from the packet's BODY
    let userLoginData = request.body;
    try {
        let successfulLoginResponse = await usersLogic.login(userLoginData);
        response.status(202).cookie("token", successfulLoginResponse, { sameSite: 'strict', path: '/', expires: new Date(new Date().getTime() + 20 * 1000), httpOnly: true })
        response.json(successfulLoginResponse);
    }
    catch (e) {
        return next(e)
    }
});
router.post("/", async (request, response, next) => {

    let userData = request.body;
    // defining new signed up user type
    userData.userType = "customer";
    try {
        await usersLogic.addUser(userData);
        response.json();
    } catch (e) {
        return next(e)
    }



})


module.exports = router;