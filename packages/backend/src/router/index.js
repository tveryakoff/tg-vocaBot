"use strict";
exports.__esModule = true;
var user_1 = require("../controllers/user");
var auth_1 = require("../controllers/auth");
var express_1 = require("express");
var router = express_1["default"].Router();
router.use('/user', user_1["default"]);
router.use('/auth', auth_1["default"]);
exports["default"] = router;
