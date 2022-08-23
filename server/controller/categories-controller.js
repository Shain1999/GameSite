const express = require("express");
const router = express.Router();
const categoriesLogic = require("../logic/categories-logic");

router.get("/", async (request, response, next) => {
    try {
        let categories = await categoriesLogic.getAllCategories();
        response.json(categories);
    }
    catch (e) {
        return next(e)
    }
});
module.exports = router;