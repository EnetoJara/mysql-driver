"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolConnector = void 0;
var tslib_1 = require("tslib");
var mysql_1 = require("./mysql");
/**
 * @description
 * @author Ernesto Jara Olveda
 * @date 22/12/2020
 * @export
 * @abstract
 * @class PoolConnector
 * @extends {MySQL}
 * @template T
 */
var PoolConnector = /** @class */ (function (_super) {
    tslib_1.__extends(PoolConnector, _super);
    /**
     * Creates an instance of PoolConnector.
     *
     * @date 22/12/2020
     * @param {(PoolConfig | string)} config
     * @memberof PoolConnector
     */
    function PoolConnector(config) {
        return _super.call(this, config) || this;
    }
    return PoolConnector;
}(mysql_1.MySQL));
exports.PoolConnector = PoolConnector;
//# sourceMappingURL=connector.js.map