import {query} from '../config/db.config.js';

export const createRenewalsTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS renewals (
        id SERIAL PRIMARY KEY,
        shopref INT NOT NULL,
        userplan INT NOT NULL,
        capture VARRCHAR(255),
        status VARCHAR (50),
        FOREIGN KEY (shopref) REFERENCES shops(ref) ON DELETE CASCADE
    )`;
    try {
        await query(sql);
        console.log("Table 'renewals' created or already exists.");
    } catch (error) {
        console.error("Error creating 'renewqls' table:", error);
    }
}

export const newRenewal = (shopref, userplan, capture) => {
    const sql = "INSERT INTO renewals (shopref, userplan, capture) VALUES ($1, $2, $3) RETURNING *";
    return query(sql, [shopref, userplan, capture]);
}

export const getAllRenewals = () => {
    const sql = "SELECT * FROM renewals";
    return query(sql);
}
