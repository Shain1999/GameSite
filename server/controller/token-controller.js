const express = require("express");
const router = express.Router();

router.get('/token', (req, res) => {
    const token = req.cookies.token;
    res.json({ token: token ? token : null });
});
module.exports = router;