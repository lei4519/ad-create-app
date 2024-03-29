"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileFile = exports.copyTemplate = void 0;
var config_1 = require("../config");
var utils_1 = require("../utils");
var path_1 = __importDefault(require("path"));
var inquirer_1 = __importDefault(require("inquirer"));
var chalk_1 = __importDefault(require("chalk"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var handlebars_1 = __importDefault(require("handlebars"));
function create(projectName) {
    return __awaiter(this, void 0, void 0, function () {
        function checkProjectName() {
            if (!projectName) {
                return inquirer_1.default
                    .prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: chalk_1.default.green('请输入项目名称'),
                        validate: function (name) {
                            if (!name.trim()) {
                                return chalk_1.default.red('目录名称不合法, 请重新输入');
                            }
                            return true;
                        },
                    },
                ])
                    .then(function (res) {
                    answer.projectName = res.name;
                });
            }
            return Promise.resolve();
        }
        function checkDir() {
            var projectPath = (answer.projectPath = path_1.default.resolve(answer.projectName));
            if (utils_1.isDirExists(projectPath)) {
                return inquirer_1.default
                    .prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: chalk_1.default.green('当前路径下已存在同名目录，请重新输入目录名称'),
                        validate: function (name) {
                            if (!name.trim()) {
                                return chalk_1.default.red('目录名称不合法, 请重新输入');
                            }
                            if (utils_1.isDirExists(path_1.default.resolve(name))) {
                                return chalk_1.default.red('当前路径下已存在同名目录，请重新输入目录名称');
                            }
                            else {
                                return true;
                            }
                        },
                    },
                ])
                    .then(function (res) {
                    answer.projectName = res.name;
                    answer.projectPath = path_1.default.resolve(res.name);
                });
            }
        }
        function chooseTemplate() {
            return inquirer_1.default
                .prompt([
                {
                    type: 'list',
                    name: 'name',
                    message: chalk_1.default.green('请选择模板'),
                    choices: config_1.config.map(function (_) { return _.name; }),
                },
            ])
                .then(function (res) {
                answer.templateName = res.name;
                var repo = config_1.config.find(function (item) { return item.name === res.name; }).repo;
                return require("./" + repo).default(answer);
            });
        }
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    answer = {
                        projectName: projectName,
                        templateName: '',
                        projectPath: '',
                    };
                    return [4 /*yield*/, checkProjectName()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, checkDir()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, chooseTemplate()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = create;
function copyTemplate(answer, p) {
    var projectPath = answer.projectPath;
    console.log(chalk_1.default.green('⌛️ 项目构建中...\n'));
    fs_extra_1.default.copySync(path_1.default.resolve(__dirname, "../../template/" + p), projectPath);
}
exports.copyTemplate = copyTemplate;
function compileFile(answer, p) {
    fs_extra_1.default.writeFileSync(answer.projectPath + "/" + p, handlebars_1.default.compile(fs_extra_1.default.readFileSync(answer.projectPath + "/" + p, 'utf-8'))(answer));
}
exports.compileFile = compileFile;
