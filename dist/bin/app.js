#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
var create_1 = __importDefault(require("../lib/create"));
commander_1.default
    .version('1.0.0')
    .name('ad-create-app')
    .usage('<command> [options]')
    .on('--help', function () {
    console.log('');
    console.log('Examples:');
    console.log('create:');
    console.log('  ad-create-app create 项目名称');
});
commander_1.default
    .command('*')
    .action(function (name) {
    console.log('not found "%s" command', name);
});
var programs = {
    list: [],
    use: function (config) {
        this.list.push(config);
        return this;
    },
    run: function () {
        this.list.forEach(function (_a) {
            var command = _a.command, alias = _a.alias, description = _a.description, action = _a.action;
            commander_1.default
                .command(command)
                .alias(alias)
                .description(description)
                .action(action);
        });
    }
};
programs
    .use({
    command: 'create [projectName]',
    alias: 'c',
    description: '创建项目',
    action: create_1.default
})
    .run();
commander_1.default.parse(process.argv);
