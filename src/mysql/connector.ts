import type { PoolConfig } from "mysql";
import { MySQL } from "./mysql";

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
export abstract class PoolConnector<T> extends MySQL {
    /**
     * Creates an instance of PoolConnector.
     *
     * @date 22/12/2020
     * @param {(import("mysql").PoolConfig | string)} config
     * @memberof PoolConnector
     */
    protected constructor (config: PoolConfig | string) {
        super(config);
    }

    /**
     * @description Find by id.
     *
     * @date 22/12/2020
     * @protected
     * @abstract
     * @template I - type of the id.
     * @param {I} id - unique identifier of the record.
     * @returns {Promise<T>} if the given id exists it'll return the entire object.
     * @memberof PoolConnector
     */
    protected abstract findById<I> (id: I): Promise<T>;
    /**
     * @description Find a single record with a key other than  the id.
     *
     * @date 22/12/2020
     * @protected
     * @abstract
     * @template K - type of the key/property.
     * @param {K} key - property
     * @returns {*}  {Promise<T>}
     * @memberof PoolConnector
     */
    protected abstract findOne<K extends keyof T> (key: K): Promise<T>;

    /**
     * @description Get all the objects.
     *
     * @date 22/12/2020
     * @protected
     * @abstract
     * @returns {Promise<T[]>}
     * @memberof PoolConnector
     */
    protected abstract findAll (): Promise<T[]>;


    /**
     * @description Delete a record by a given id.
     *
     * @date 22/12/2020
     * @protected
     * @abstract
     * @template I - type of the id key.
     * @param {I} id
     * @returns {Promise<void>}
     * @memberof PoolConnector
     */
    protected abstract deleteById<I> (id: I): Promise<void>;

    /**
     * @description Add a new record into the table.
     *
     * @date 22/12/2020
     * @protected
     * @abstract
     * @param {T} obj - the object to be stored on db.
     * @returns {Promise<T>}
     * @memberof PoolConnector
     */
    protected abstract save (obj: T): Promise<T>;
}
