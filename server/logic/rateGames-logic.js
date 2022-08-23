const rateGamesDal = require("../dal/rateGames-dal");
const ServerError = require("../errors/server-error");

async function rateGame(rateObj) {
    // validate rate obj
    try {
        await rateGamesDal.rateGame(rateObj);
    } catch (error) {
        throw ServerError(error)
    }
}

module.exports = { rateGame }