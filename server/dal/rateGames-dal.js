const ServerError = require("../errors/server-error");
const connection = require("./dbconfig");

async function rateGame(rateObj) {

    let sql = `insert into sub_categories_scores(game_id,user_id,sub_category_id,score)` + `values(?,?,?,?)`
    let parameters = [rateObj.gameID, rateObj.userID, rateObj.subCategoryID, rateObj.score];
    try {
        connection.executeWithParameters(sql, parameters);
    } catch (error) {
        throw ServerError(error)
    }
}
module.exports = { rateGame }