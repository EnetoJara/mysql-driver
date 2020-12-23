import mysql, { FieldInfo, MysqlError } from "mysql";

/**
 * @description MySQL base class connector.
 *
 * @date 22/12/2020
 * @class MySQL
 * @private
 * @internal
 */
export class MySQL {
    /**
     * @private
     * @internal
     */
    private _pool: mysql.Pool;

    /**
     * Creates an instance of MySQL.
     *
     * @date 22/12/2020
     * @param {(import("mysql").PoolConfig | string)} config
     * @memberof MySQL
     */
    public constructor (config: mysql.PoolConfig | string) {
        this._pool = mysql.createPool(config);
    }

    /**
     * @description Gets a database poolconnection to perform querys and stuff.
     *
     * @date 22/12/2020
     * @private
     * @internal
     * @returns {Promise<import("mysql").PoolConnection>} a mysql connection.
     * @memberof MySQL
     */
    private getConnection (): Promise<mysql.PoolConnection> {
        return new Promise<mysql.PoolConnection>((resolve, reject) =>
            this._pool.getConnection(
                (error: mysql.MysqlError, connection: mysql.PoolConnection) => {
                    if (error) {
                        if (connection) {
                            connection.rollback();
                            connection.release();
                        }

                        return reject(error);
                    }

                    return resolve(connection);
                }
            )
        );
    }

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
    private runQuery<T extends unknown> (
        connection: mysql.PoolConnection,
        sql: string,
        opts?: unknown[]
    ) {
        return new Promise<{ results: T; fields: mysql.FieldInfo[]; }>(
            (resolve, reject) =>
                connection.query(
                    sql,
                    opts,
                    (error: mysql.MysqlError, results: T, fields: mysql.FieldInfo[]) => {
                        if (error !== null) {
                            return reject(error);
                        }

                        return resolve({ results, fields });
                    }
                )
        );
    }

    /**
     * @description Begins the transaction.
     *
     * @date 22/12/2020
     * @private
     * @internal
     * @param {import("mysql").PoolConnection} connection - a mysql connection.
     * @returns {*}  {Promise<import("mysql").PoolConnection>}
     * @memberof MySQL
     */
    private beginTransaction (
        connection: mysql.PoolConnection
    ): Promise<mysql.PoolConnection> {
        return new Promise<mysql.PoolConnection>((resolve, reject) =>
            connection.beginTransaction((error: mysql.MysqlError) => {
                if (error) {
                    return reject(error);
                }

                return resolve(connection);
            })
        );
    }

    /**
     * @description commits the transaction.
     *
     * @date 22/12/2020
     * @private
     * @internal
     * @param {import("mysql").PoolConnection} connection
     * @returns {*}  {Promise<void>}
     * @memberof MySQL
     */
    private commitTransaction (connection: mysql.PoolConnection): Promise<void> {
        return new Promise((resolve, reject) =>
            connection.commit((err: mysql.MysqlError) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            })
        );
    }

    /**
     * @description Runs a none transactional sql statement. usefull if you want to run retrieve data.
     *
     * @date 22/12/2020
     * @protected
     * @template T - Object type expected.
     * @param {string} sql - SQL statement.
     * @param {unknown[]} [opts=[]] - array of parameters to be injected.
     * @returns {Promise<{ results: T[]; fields: import("mysql").FieldInfo[]; }>} an array of objects.
     * @memberof MySQL
     */
    protected select<T extends object> (
        sql: string,
        opts: unknown[] = []
    ): Promise<{ results: T[]; fields: FieldInfo[]; }> {
        return this.getConnection()
            .then((connection) => {
                return this.runQuery<T>(connection, sql, opts)
                    .then<{ results: T[]; fields: FieldInfo[]; }>(
                        ({ results, fields }) => {
                            let toReturn: T[] = [];

                            if (Array.isArray(results)) {
                                toReturn = results;
                            } else {
                                toReturn = [ results ];
                            }

                            return {
                                results: toReturn,
                                fields,
                            };
                        }
                    )
                    .catch((er) => {
                        throw er;
                    })
                    .finally(() => {
                        connection.release();
                    });
            })
            .catch((error: mysql.MysqlError) => {
                throw error;
            });
    }

    /**
     * Writes one. Runs one transactional sql statement, usefull when writting data.
     *
     * @template T - Table Entity.
     * @param sql - query to run.
     * @param [opts] - array of paramenters.
     * @returns  results
     */
    writeOne<T extends unknown> (sql: string, opts: unknown[] = []) {
        return this.getConnection()
            .then((connection) => {
                return this.beginTransaction(connection).then((connection) => {
                    return this.runQuery<T>(connection, sql, opts)
                        .then((result) => {
                            return this.commitTransaction(connection).then(() => {
                                return result.results;
                            });
                        })
                        .catch((er) => {
                            connection.rollback();
                            throw er;
                        })
                        .finally(() => {
                            connection.release();
                        });
                });
            })
            .catch((error: MysqlError) => {
                throw error;
            });
    }
}
