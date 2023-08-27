"use strict";
exports.__esModule = true;
var express_1 = require("express");
var dotenv_1 = require("dotenv");
var db_1 = require("./db");
var router_1 = require("./router");
var auth_1 = require("./middlewares/auth");
dotenv_1["default"].config();
var app = (0, express_1["default"])();
app.use(express_1["default"].json());
app.use(auth_1["default"]);
app.use('/api', router_1["default"]);
(0, db_1["default"])().then(function () {
    app.listen(process.env.PORT, function () {
        console.log("\u26A1\uFE0F[server]: Server is running at http://localhost:".concat(process.env.PORT));
    });
});
