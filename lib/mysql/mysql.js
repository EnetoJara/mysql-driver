"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQL = void 0;
var mysql_1 = require("mysql");
/**
 * @description MySQL base class connector.
 *
 * @date 22/12/2020
 * @class MySQL
 * @private
 * @internal
 */
var MySQL = /** @class */ (function () {
    /**
     * Creates an instance of MySQL.
     *
     * @date 22/12/2020
     * @param {(mysql.PoolConfig | string)} config
     * @memberof MySQL
     */
    function MySQL(config) {
        this._pool = mysql_1.default.createPool(config);
    }
    /**
     * @description Gets a database poolconnection to perform querys and stuff.
     *
     * @date 22/12/2020
     * @private
     * @internal
     * @returns {Promise<mysql.PoolConnection>} a mysql connection.
     * @memberof MySQL
     */
    MySQL.prototype.getConnection = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this._pool.getConnection(function (error, connection) {
                if (error) {
                    if (connection) {
                        connection.rollback();
                        connection.release();
                    }
                    return reject(error);
                }
                return resolve(connection);
            });
        });
    };
    /**
     * @description Runs the given SQL statement passed as param.
     *
     * @date 22/12/2020
     * @private
     * @internal
     * @template T - Type of object the function will return.
     * @param {import("mysql").PoolConnection} connection - db connection.
     * @param {mysql.Query} sql - SQL statement to be exectuted.
     * @param {*} [opts] opts - array of parameters to be injected at the sql statement.
     * @returns {Rows<T>} query - data fetched from db.
     * @memberof MySQL
     */
    MySQL.prototype.runQuery = function (connection, sql, opts) {
        return new Promise(function (resolve, reject) {
            return connection.query(sql, opts, function (error, results, fields) {
                if (error !== null) {
                    return reject(error);
                }
                return resolve({ results: results, fields: fields });
            });
        });
    };
    /**
     * @description Begins the transaction.
     *
     * @date 22/12/2020
     * @private
     * @internal
     * @param {mysql.PoolConnection} connection - a mysql connection.
     * @returns {*}  {Promise<mysql.PoolConnection>}
     * @memberof MySQL
     */
    MySQL.prototype.beginTransaction = function (connection) {
        return new Promise(function (resolve, reject) {
            return connection.beginTransaction(function (error) {
                if (error) {
                    return reject(error);
                }
                return resolve(connection);
            });
        });
    };
    /**
     * @description commits the transaction.
     *
     * @date 22/12/2020
     * @private
     * @internal
     * @param {mysql.PoolConnection} connection
     * @returns {*}  {Promise<void>}
     * @memberof MySQL
     */
    MySQL.prototype.commitTransaction = function (connection) {
        return new Promise(function (resolve, reject) {
            return connection.commit(function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    };
    /**
     * @description Runs a none transactional sql statement. usefull if you want to run retrieve data.
     *
     * @date 22/12/2020
     * @protected
     * @template T - Object type expected.
     * @param {string} sql - SQL statement.
     * @param {unknown[]} [opts=[]] - array of parameters to be injected.
     * @returns {Promise<{ results: T[]; fields: FieldInfo[]; }>} an array of objects.
     * @memberof MySQL
     */
    MySQL.prototype.select = function (sql, opts) {
        var _this = this;
        if (opts === void 0) { opts = []; }
        return this.getConnection()
            .then(function (connection) {
            return _this.runQuery(connection, sql, opts)
                .then(function (_a) {
                var results = _a.results, fields = _a.fields;
                var toReturn = [];
                if (Array.isArray(results)) {
                    toReturn = results;
                }
                else {
                    toReturn = [results];
                }
                return {
                    results: toReturn,
                    fields: fields,
                };
            })
                .catch(function (er) {
                throw er;
            })
                .finally(function () {
                connection.release();
            });
        })
            .catch(function (error) {
            throw error;
        });
    };
    /**
     * Writes one. Runs one transactional sql statement, usefull when writting data.
     *
     * @template T - Table Entity.
     * @param sql - query to run.
     * @param [opts] - array of paramenters.
     * @returns  results
     */
    MySQL.prototype.writeOne = function (sql, opts) {
        var _this = this;
        if (opts === void 0) { opts = []; }
        return this.getConnection()
            .then(function (connection) {
            return _this.beginTransaction(connection).then(function (connection) {
                return _this.runQuery(connection, sql, opts)
                    .then(function (result) {
                    return _this.commitTransaction(connection).then(function () {
                        return result.results;
                    });
                })
                    .catch(function (er) {
                    connection.rollback();
                    throw er;
                })
                    .finally(function () {
                    connection.release();
                });
            });
        })
            .catch(function (error) {
            throw error;
        });
    };
    return MySQL;
}());
exports.MySQL = MySQL;
//# sourceMappingURL=mysql.js.map