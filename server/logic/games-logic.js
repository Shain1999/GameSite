const gamesDal = require("../dal/games-dal");
const ServerError = require("../errors/server-error");
const ErrorType = require("../errors/error-types")

// this function returns all games with all data
async function getGames() {
    try {
        let gamesArray = await gamesDal.getGames();
        return gamesArray;
    } catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, error);

    }
}
// this function returns an array that show how many times a specific category id appeared in the games the user chose
async function getCategoryIDAppearanceByGames(gamesObj) {
    try {
        let categoriesIdsArray = await gamesDal.getCategoryIDAppearanceByGames(gamesObj);
        return categoriesIdsArray;
    } catch (error) {
        throw new Error(error)

    }

}
// this function gets 5 game ids and returns an array with suitable games for the user based on the 5 games
async function discoverGamesByGames(gamesObj) {
    try {
        let categoriesAppearanceArray = await getCategoryIDAppearanceByGames(gamesObj);
        let sortedCategoriesArray = getTopMatchedCategoriesId(categoriesAppearanceArray);
        let gamesArray = await discoverGamesByCategory(sortedCategoriesArray);
        return gamesArray;
    } catch (error) {
        throw new Error(error)

    }
}
// this function gets 5 category ids and returns an array with suitable games for the user based on the 5 categories

async function discoverGamesByCategory(categoriesObj) {
    try {
        let gameIdsArray = await getTopMatchedGamesIDByCategory(categoriesObj);
        let gamesArray = await getMultipleGamesDataByIds(gameIdsArray);
        return gamesArray;
    } catch (error) {
        throw new Error(error)

    }
}
// this function gets 5 categories id and returns the games which the categories given appeard the most
async function getTopMatchedGamesIDByCategory(categoriesObj) {
    try {
        let gamesAppearanceArray = await gamesDal.getGamesAppearanceByCategory(categoriesObj);
        let gameIdsArray = getTopMatchedGamesId(gamesAppearanceArray);
        return gameIdsArray

    } catch (error) {
        throw new Error(error)
    }

}
// this function gets an array of game ids and returns all the data for each game
async function getMultipleGamesDataByIds(gameIdsArray) {
    try {
        let gamesArray = await gamesDal.getMultipleGamesDataByIds(gameIdsArray);
        return gamesArray;
    } catch (error) {
        throw new Error(error);
    }
}
// this function return the data for top 5 liked games
async function getTop5LikedGames() {
    try {
        let top5GamesID = await gamesDal.getTop5LikedGamesID();
        let gamesArray = await getMultipleGamesDataByIds(top5GamesID);
        return gamesArray;

    } catch (error) {
        throw new Error(error);

    }
}

// this function gets an object that holds gameid and how many times the given categories appeard in it
// the function returns an array with the games that the categories appeared the most  
function getTopMatchedGamesId(appearanceObj) {
    let gameIdsArray = new Array();
    let highestAppearance = appearanceObj[0].appearance;
    for (let i = 0; i < 5; i++) {
        if (highestAppearance == appearanceObj[i].appearance) {
            gameIdsArray.push(appearanceObj[i].gameID)
        }
    }
    return gameIdsArray
}
// this function gets an object that holds categoryID and how many times the given games appeard in it
// this function returns an object with the most appeared category ids
function getTopMatchedCategoriesId(appearanceObj) {
    let categoriesIdsObj = {}
    let count = 0;
    while (count < Object.keys(appearanceObj).length && count < 5) {
        categoriesIdsObj[`catId${count + 1}`] = appearanceObj[count].categoryID
        count++;
    }
    if (Object.keys(appearanceObj).length < 5) {
        for (let i = count; i < 5; i++) {
            categoriesIdsObj[`catId${i + 1}`] = appearanceObj[count].categoryID
        }
    }
    return categoriesIdsObj
}
function countGameAppearance(gamesAppearanceArray) {
    let count = {}
    gamesAppearanceArray.forEach(element => {
        count[element.game_id] = (count[element.game_id] || 0) + 1;
    });
    return count;
}

module.exports = { getGames, getTopMatchedGamesIDByCategory, getMultipleGamesDataByIds, discoverGamesByCategory, discoverGamesByGames, getTop5LikedGames }