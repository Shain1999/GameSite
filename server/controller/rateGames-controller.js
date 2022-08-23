const express = require("express");
const router = express.Router();
const rateGamesLogic = require("../logic/rateGames-logic");
const querystring = require("querystring");

router.post("/", async (request, response, next) => {
    // extract user id from token 
    // add user id to obj
    let rateObj = request.body;

    try {
        await rateGamesLogic.rateGame(rateObj);
        response.json();
    }
    catch (e) {
        return next(e)
    }
});