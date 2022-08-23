const express = require("express");
const cors = require('cors');
const errorHandler = require("./errors/error-handler");
const gamesController = require("./controller/games-controller");
const categoriesController = require("./controller/categories-controller");
const usersController = require("./controller/users-controller");
const tokenController = require("./controller/token-controller")
const cookieParser = require('cookie-parser');


const server = express();


server.use(cors({ origin: "http://localhost:3000", credentials: true }));
server.use(express.json());
server.use(cookieParser())
server.use("/users", usersController);
server.use("/token", tokenController)
server.use("/games", gamesController);
server.use("/categories", categoriesController);
server.use(errorHandler);

server.listen(3001, () => console.log("Listening on http://localhost:3001"));

module.exports = server;