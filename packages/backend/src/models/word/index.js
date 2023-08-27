"use strict";
exports.__esModule = true;
exports.WORD_MODEL_NAME = void 0;
var mongoose_1 = require("mongoose");
var Schema = mongoose_1["default"].Schema;
exports.WORD_MODEL_NAME = 'Word';
var wordSchema = new Schema({
    value: {
        type: String,
        required: true
    },
    translation: {
        type: String,
        required: true
    },
    transcription: {
        type: String
    }
});
var WordModel = mongoose_1["default"].model(exports.WORD_MODEL_NAME, wordSchema);
exports["default"] = WordModel;
