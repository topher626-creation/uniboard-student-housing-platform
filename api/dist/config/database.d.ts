import { Sequelize } from 'sequelize';
declare const config: {
    database: string;
    username: string;
    password: string;
    host: string;
    port: number;
    dialect: "mysql";
    logging: boolean;
    pool: {
        max: number;
        min: number;
        acquire: number;
        idle: number;
    };
} | {
    database: string;
    username: string;
    password: string;
    host: string;
    port: number;
    dialect: "mysql";
    logging: boolean;
    pool: {
        max: number;
        min: number;
        acquire: number;
        idle: number;
    };
};
export declare const sequelize: Sequelize;
export default config;
//# sourceMappingURL=database.d.ts.map