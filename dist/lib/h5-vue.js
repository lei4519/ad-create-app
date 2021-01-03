"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var inquirer_1 = __importDefault(require("inquirer"));
var chalk_1 = __importDefault(require("chalk"));
var create_1 = require("./create");
function default_1(answer) {
    return inquirer_1.default
        .prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: chalk_1.default.green('是否引入vuex ？'),
        },
    ])
        .then(function (res) {
        answer.vuex = res.confirm;
    })
        .then(function () {
        return inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: chalk_1.default.green('是否引入vue-router ？'),
            },
        ]);
    })
        .then(function (res) {
        answer.router = res.confirm;
    })
        .then(function () {
        create_1.copyTemplate(answer, 'h5-vue');
        create_1.compileFile(answer, 'package.json');
        create_1.compileFile(answer, 'src/main.ts');
        create_1.compileFile(answer, 'src/App.vue');
        !answer.vuex && fs_extra_1.default.removeSync(answer.projectPath + "/src/store");
        if (!answer.router) {
            fs_extra_1.default.removeSync(answer.projectPath + "/src/router");
            fs_extra_1.default.removeSync(answer.projectPath + "/src/views");
        }
        console.log(chalk_1.default.green('✅ 项目构建完成\n'));
        console.log(chalk_1.default.green('执行以下命令以启动项目:\n'));
        console.log(chalk_1.default.green("\t cd " + answer.projectName + "\n"));
        console.log(chalk_1.default.green("\t npm install\n"));
        console.log(chalk_1.default.green("\t npm run dev\n"));
    });
}
exports.default = default_1;
