"use strict";
exports.__esModule = true;
exports.dictionarySchema = exports.DICTIONARY_MODEL_NAME = void 0;
var mongoose_1 = require("mongoose");
var word_1 = require("../word");
var Schema = mongoose_1["default"].Schema;
exports.DICTIONARY_MODEL_NAME = 'Dictionary';
exports.dictionarySchema = new Schema({
    name: { type: String },
    targetLanguage: { type: String },
    translationLanguage: { type: String },
    words: [
        {
            type: Schema.Types.ObjectId,
            ref: word_1.WORD_MODEL_NAME
        },
    ]
});
var DictionaryModel = mongoose_1["default"].model(exports.DICTIONARY_MODEL_NAME, exports.dictionarySchema);
exports["default"] = DictionaryModel;
