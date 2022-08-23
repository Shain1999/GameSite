const ServerError = require("../errors/server-error");
const connection = require("./dbconfig");

async function getGames() {
    let sql = `select g.img,g.id,g.name,f2p,l.name as landscape ,m.name as mode,GROUP_CONCAT(p.name SEPARATOR ', ') as platforms,GROUP_CONCAT(c.name SEPARATOR ', ') as categories 
    from games g 
    join landscapes l on g.landscape_id = l.id 
    join modes m on g.mode_id = m.id 
    join games_platforms gp on g.id = gp.game_id 
    join platforms p on p.id = gp.platform_id 
    join games_categories gc on g.id = gc.game_id 
    join categories c on c.id = gc.category_id 
    GROUP BY g.id;`;
    try {
        let gamesArray = await connection.execute(sql);
        return gamesArray;

    } catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, error);
    }
    // select g.id,g.name,f2p,l.name as landscape ,m.name as mode,GROUP_CONCAT(p.name SEPARATOR ', ') as platforms,GROUP_CONCAT(c.name SEPARATOR ', ') as categories 
    // from games g 
    // join landscapes l on g.landscape_id = l.id 
    // join modes m on g.mode_id = m.id 
    // join games_platforms gp on g.id = gp.game_id 
    // join platforms p on p.id = gp.platform_id 
    // join games_categories gc on g.id = gc.game_id 
    // join categories c on c.id = gc.category_id 
    // GROUP BY g.id;
}
async function getMultipleGamesDataByIds(gameIdsArray) {
    let sql = `select g.img,g.id,g.name,f2p,l.name as landscape ,m.name as mode,GROUP_CONCAT(DISTINCT p.name SEPARATOR ', ') as platforms,GROUP_CONCAT(DISTINCT c.name SEPARATOR ', ') as categories 
    from games g 
    join landscapes l on g.landscape_id = l.id 
    join modes m on g.mode_id = m.id 
    join games_platforms gp on g.id = gp.game_id 
    join platforms p on p.id = gp.platform_id 
    join games_categories gc on g.id = gc.game_id 
    join categories c on c.id = gc.category_id 
    where g.id =? `
    if (gameIdsArray.length > 1) {
        for (let i = 0; i < gameIdsArray.length - 1; i++) {
            sql += `or g.id=? `
        }
    }
    sql += `GROUP BY g.id;`
    let parameters = gameIdsArray;
    try {
        let gamesArray = await connection.executeWithParameters(sql, parameters);
        return gamesArray;
    } catch (error) {
        throw new Error(error);

    }
}
async function getCategoryIDAppearanceByGames(gamesObj) {
    let sql = `select category_id as categoryID ,count(game_id) as appearance from games_categories 
    where game_id=? or game_id=? or game_id=? or game_id=? or game_id=?
    group by category_id having count(category_id) > 0 order by (appearance) DESC`
    let parameters = [gamesObj.gameId1, gamesObj.gameId2, gamesObj.gameId3, gamesObj.gameId4, gamesObj.gameId5]
    try {
        let categoriesAppearanceArray = await connection.executeWithParameters(sql, parameters);
        return categoriesAppearanceArray
    } catch (error) {
        throw new Error(error);

    }

}
async function getTop5LikedGamesID() {
    let sql = `select game_id from liked_games group by game_id having count(user_id)>0 order by count(user_id) DESC limit 5`
    try {
        let top5GamesID = await connection.execute(sql);
        return top5GamesID;
    } catch (error) {
        throw new Error(error);

    }
}
async function getGamesAppearanceByCategory(categoriesObj) {
    let sql = `select game_id as gameID ,count(game_id) as appearance from games_categories 
    where category_id=? or category_id=? or category_id=? or category_id=? or category_id=? 
    group by game_id having count(game_id) > 0 order by (appearance) DESC`
    let parameters = [categoriesObj.catId1, categoriesObj.catId2, categoriesObj.catId3, categoriesObj.catId4, categoriesObj.catId5]
    try {
        let gamesAppearanceArray = await connection.executeWithParameters(sql, parameters);
        return gamesAppearanceArray
    } catch (error) {
        throw new Error(error);

    }

}
module.exports = { getGames, getGamesAppearanceByCategory, getMultipleGamesDataByIds, getCategoryIDAppearanceByGames,getTop5LikedGamesID }