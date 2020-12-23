import { PoolConnector } from "./mysql";
export interface AccountsProps {
    id: number;
    name: string;
    last: string;
}
export declare class Accounts extends PoolConnector<AccountsProps> {
    protected findById<I>(id: I): Promise<AccountsProps>;
    protected findOne<K extends "id" | "name" | "last">(key: K): Promise<AccountsProps>;
    protected findAll(): Promise<AccountsProps[]>;
    protected deleteById<I>(id: I): Promise<void>;
    protected save(obj: AccountsProps): Promise<AccountsProps>;
}
//# sourceMappingURL=accounts.d.ts.map