const gamesDal = require("../dal/games-dal");
const ServerError = require("../errors/server-error");
const ErrorType = require("../errors/error-types")
const axios = require("axios")

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
// https://api.rawg.io/api/games?genres=2&ordering=-rating&key=3aeda485a2e04a33a244bfc728842085
// get a categories object from the client with 5 categories id
// returns an array with all the game ids that match given categories and its genres
// {gameId,genres}
async function getGamesIdFromApiByCategories(categoriesObj) {
    let apiCategoriesArray = await gamesDal.getApiCategoriesIdByCategoryId(categoriesObj);
    let filteredApiCategoriesArray = []
    let genresQueryString = ''
    for (let i = 0; i < apiCategoriesArray.length; i++) {
        console.log(apiCategoriesArray[i].api_id);
        genresQueryString += `${apiCategoriesArray[i].api_id},`;
        filteredApiCategoriesArray.push(apiCategoriesArray[i].api_id)
    }
    const editedGenresQueryString = genresQueryString.slice(0, -1);
    console.log(editedGenresQueryString);
    let apiGamesIdArray = [];
    let pageString = "";
    for (let j = 0; j < 7; j++) {
        if (j != 0) {
            pageString = `&page=${j + 1}`
        }
        await axios.get((`https://api.rawg.io/api/games?genres=${genresQueryString}&dates=2018-09-01,2022-09-30&ordering=-updated&key=668ab1781b0d48b28dfa852460c47e7b${pageString}`)).then((response) => {
            let gamesArray = response.data;
            for (game of gamesArray.results) {
                let genresCount = 0;
                for (genre of game.genres) {
                    if (filteredApiCategoriesArray.includes(genre.id)) {
                        genresCount++;
                    }
                }
                apiGamesIdArray.push([game.id, genresCount]);
            }
        }).catch((err) => {
            console.error(err)
            throw new Error(err.message)
        })
    }

    return apiGamesIdArray
}
// get an array filled with gameId and apearance
// return an array of arrays with [gameId,appearance];
async function getHighestAppearedGames(apiGamesIdArray) {

    let sortedGameIdArray = apiGamesIdArray.sort((a, b) => b[1] - a[1]);
    return sortedGameIdArray

}
// get a sorted array with game id and appearances
// returns the top matched games with most appearances
async function getApiTopMatchedGamesId(apiSortedGameIdArray) {
    let gameIdsArray = new Array();
    let highestAppearance = apiSortedGameIdArray[0][1];
    for (let i = 0; i < 5; i++) {
        if (highestAppearance == apiSortedGameIdArray[i][1]) {
            gameIdsArray.push(apiSortedGameIdArray[i][0])
        }
    }
    return gameIdsArray
}
// gets an array with games id 
// return all the data for given games from api
async function fetchGameDataFromApiById(apiTopMatchedGamesIdArray) {
    console.log(apiTopMatchedGamesIdArray);
    let apiGamesArray = [];
    for (let i = 0; i < apiTopMatchedGamesIdArray.length; i++) {
        await axios.get((`https://api.rawg.io/api/games/${apiTopMatchedGamesIdArray[i]}?key=668ab1781b0d48b28dfa852460c47e7b`)).then((response) => {
            let gameData = response.data;
            const genres = getOnlyNameFromPropsArray(gameData.genres);
            const developers = getOnlyNameFromPropsArray(gameData.developers);
            const subGenres = getOnlyNameFromPropsArray(gameData.tags);
            const platforms=getOnlyNameFromPlatformsArray(gameData.platforms)

            let gameObj = {
                id:gameData.id,
                name: gameData.name, description: gameData.description, released: gameData.released, bgImg: gameData.background_image, secondaryImg: gameData.background_image_additional, website: gameData.website,
                platforms,
                genres, developers, subGenres,
            }
            apiGamesArray.push(gameObj);
        }).catch((err) => {
            console.error(err)
            throw new Error(err.message)
        })
    }
    return apiGamesArray;

}
function getOnlyNameFromPropsArray(propsArray) {
    let arrayToSend = [];
    for (prop of propsArray) {
        arrayToSend.push(prop.name);
    }
    return arrayToSend;

}
function getOnlyNameFromPlatformsArray(platformsArray){
    let arrayToSend = [];
    for (platform of platformsArray) {
        arrayToSend.push(platform.platform.name);
    }
    return arrayToSend;
}
async function apiGetNameFromArray(propArray) {
    let propNameArray = []
    for (prop in propArray) {
        propNameArray.push(propArray[prop].name)
    }
    console.log(propNameArray);
    return propNameArray;
}
async function apiDiscoverByCategories(categoriesObj) {
    let apiGamesIdArray = await getGamesIdFromApiByCategories(categoriesObj);
    let apiSortedGameIdArray = await getHighestAppearedGames(apiGamesIdArray)
    let apiTopMatchedGamesIdArray = await getApiTopMatchedGamesId(apiSortedGameIdArray);
    let apiGamesArray = await fetchGameDataFromApiById(apiTopMatchedGamesIdArray);

    return apiGamesArray;
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

module.exports = { apiDiscoverByCategories, getGames, getTopMatchedGamesIDByCategory, getMultipleGamesDataByIds, discoverGamesByCategory, discoverGamesByGames, getTop5LikedGames, getGamesFromApiByCategories: getGamesIdFromApiByCategories }