"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDirExists = void 0;
var fs = require('fs');
exports.isDirExists = function (path) {
    try {
        fs.statSync(path);
        return true;
    }
    catch (e) {
        return false;
    }
};
