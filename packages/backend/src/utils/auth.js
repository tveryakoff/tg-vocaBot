"use strict";
exports.__esModule = true;
exports.getUserTgIdHashFromToken = exports.isUserTokenValid = exports.generateAuthJwtToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var auth_1 = require("../constants/auth");
var generateAuthJwtToken = function (user, botApiKey) {
    return jsonwebtoken_1["default"].sign({ tgIdHash: user.tgIdHash, botApiKey: botApiKey }, auth_1.JWT_SECRET, { expiresIn: '3h' });
};
exports.generateAuthJwtToken = generateAuthJwtToken;
var isUserTokenValid = function (jwtToken, user) {
    try {
        var decoded = jsonwebtoken_1["default"].verify(jwtToken, auth_1.JWT_SECRET);
        return decoded.tgIdHash === user.tgIdHash && decoded.botApiKey === process.env.API_KEY_BOT;
    }
    catch (error) {
        return false;
    }
};
exports.isUserTokenValid = isUserTokenValid;
var getUserTgIdHashFromToken = function (jwtToken) {
    try {
        var decoded = jsonwebtoken_1["default"].verify(jwtToken, auth_1.JWT_SECRET);
        return decoded.tgIdHash;
    }
    catch (error) {
        return null;
    }
};
exports.getUserTgIdHashFromToken = getUserTgIdHashFromToken;
