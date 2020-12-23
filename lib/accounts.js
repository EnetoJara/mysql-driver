"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accounts = void 0;
var tslib_1 = require("tslib");
var mysql_1 = require("./mysql");
var Accounts = /** @class */ (function (_super) {
    tslib_1.__extends(Accounts, _super);
    function Accounts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Accounts.prototype.findById = function (id) {
        throw new Error("Method not implemented.");
    };
    Accounts.prototype.findOne = function (key) {
        throw new Error("Method not implemented.");
    };
    Accounts.prototype.findAll = function () {
        throw new Error("Method not implemented.");
    };
    Accounts.prototype.deleteById = function (id) {
        throw new Error("Method not implemented.");
    };
    Accounts.prototype.save = function (obj) {
        throw new Error("Method not implemented.");
    };
    return Accounts;
}(mysql_1.PoolConnector));
exports.Accounts = Accounts;
//# sourceMappingURL=accounts.js.map