"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminModule = void 0;
var common_1 = require("@nestjs/common");
var main_controller_1 = require("./main/main.controller");
var login_controller_1 = require("./login/login.controller");
var manager_controller_1 = require("./manager/manager.controller");
var tools_service_1 = require("../../service/tools/tools.service");
var AdminModule = /** @class */ (function () {
    function AdminModule() {
    }
    AdminModule = __decorate([
        common_1.Module({
            controllers: [main_controller_1.MainController, login_controller_1.LoginController, manager_controller_1.ManagerController],
            providers: [tools_service_1.ToolsService]
        })
    ], AdminModule);
    return AdminModule;
}());
exports.AdminModule = AdminModule;
