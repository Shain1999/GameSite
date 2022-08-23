const categoriesDal = require("../dal/categories-dal");
const ServerError = require("../errors/server-error");
const ErrorType = require("../errors/error-types")

async function getAllCategories() {
    try {
        let categoriesArray = await categoriesDal.getAllCategories();
        return categoriesArray;
    } catch (error) {
        throw ServerError(error)
    }
}

module.exports = { getAllCategories }