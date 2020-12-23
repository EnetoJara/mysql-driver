import type { PoolConfig } from "mysql";
import { PoolConnector } from "./mysql";

export interface AccountsProps {
    id: number;
    name: string;
    last: string;
}


export class Accounts extends PoolConnector<AccountsProps> {

    public constructor (config: PoolConfig | string) {
        super(config);
    }
    protected findById<I> (id: I): Promise<AccountsProps> {
        throw new Error("Method not implemented.");
    }
    protected findOne<K extends "id" | "name" | "last"> (key: K): Promise<AccountsProps> {
        throw new Error("Method not implemented.");
    }
    protected findAll (): Promise<AccountsProps[]> {
        throw new Error("Method not implemented.");
    }
    protected deleteById<I> (id: I): Promise<void> {
        throw new Error("Method not implemented.");
    }
    protected save (obj: AccountsProps): Promise<AccountsProps> {
        throw new Error("Method not implemented.");
    }

}
