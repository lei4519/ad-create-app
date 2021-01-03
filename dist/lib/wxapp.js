"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var handlebars_1 = __importDefault(require("handlebars"));
var inquirer_1 = __importDefault(require("inquirer"));
var chalk_1 = __importDefault(require("chalk"));
var create_1 = require("./create");
function default_1(answer) {
    return inquirer_1.default
        .prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: chalk_1.default.green('是第三方小程序吗？'),
        },
    ])
        .then(function (res) {
        answer.isOpen3rd = res.confirm;
        create_1.copyTemplate(answer, 'wxapp');
        editProjectName(answer);
        wxappCreated(answer);
    });
}
exports.default = default_1;
function wxappCreated(answer) {
    // 删除ext.json
    !answer.isOpen3rd && fs_extra_1.default.removeSync(answer.projectPath + "/ext.json");
    // 编译 app.config.js template/wxapp/config/app.config.js
    var content = fs_extra_1.default.readFileSync(answer.projectPath + "/config/app.config.js", 'utf-8');
    fs_extra_1.default.writeFileSync(answer.projectPath + "/config/app.config.js", handlebars_1.default.compile(content)(answer));
    console.log(chalk_1.default.green('✅ 项目构建完成\n'));
    console.log(chalk_1.default.green('执行以下命令以启动项目:\n'));
    console.log(chalk_1.default.green("\t cd " + answer.projectName + "\n"));
    console.log(chalk_1.default.green("\t npm install\n"));
    console.log(chalk_1.default.green("\t \u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177: \u5DE5\u5177 - \u6784\u5EFAnpm\n"));
}
function editProjectName(answer) {
    // package.json 项目名称
    var packageJson = fs_extra_1.default.readFileSync(answer.projectPath + "/package.json", 'utf-8');
    fs_extra_1.default.writeFileSync(answer.projectPath + "/package.json", handlebars_1.default.compile(packageJson)(answer));
    // project.config.json 项目名称
    var projectConfig = fs_extra_1.default.readFileSync(answer.projectPath + "/project.config.json", 'utf-8');
    fs_extra_1.default.writeFileSync(answer.projectPath + "/project.config.json", handlebars_1.default.compile(projectConfig)(answer));
}
