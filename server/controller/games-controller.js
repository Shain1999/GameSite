const express = require("express");
const router = express.Router();
const gamesLogic = require("../logic/games-logic");
const querystring = require("querystring");



router.get("/", async (request, response, next) => {
    try {
        let games = await gamesLogic.getGames();
        response.json(games);
    }
    catch (e) {
        return next(e)
    }
});
router.get("/top5", async (request, response, next) => {
    try {
        let games = await gamesLogic.getTop5LikedGames();
        response.json(games);
    }
    catch (e) {
        return next(e)
    }
});
// http://localhost:3001/games/discoverByGames?gameId1=1&gameId2=3&gameId3=2&gameId4=4&gameId5=5
router.get("/discoverByCategories", async (request, response, next) => {
    let query = request.url.split('?');

    let categoriesObj = querystring.parse(query[1]);
    try {
        let games = await gamesLogic.discoverGamesByCategory(categoriesObj);
        response.json(games);
    }
    catch (e) {
        return next(e)
    }
});
router.get("/discoverByGames", async (request, response, next) => {
    let query = request.url.split('?');

    let gamesObj = querystring.parse(query[1]);
    try {
        let games = await gamesLogic.discoverGamesByGames(gamesObj);
        response.json(games);
    }
    catch (e) {
        return next(e)
    }
});
module.exports = router;