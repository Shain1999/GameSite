const ServerError = require("../errors/server-error");
const connection = require("./dbconfig");

async function getAllCategories() {
    let sql = `select * from categories`
    try {
        let categoriesArray = await connection.execute(sql);
        return categoriesArray
    } catch (error) {
        throw ServerError(error)
    }
}
module.exports = { getAllCategories }