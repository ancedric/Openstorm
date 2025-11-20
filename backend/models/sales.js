import {query} from '../config/db.config.js';

export const createSalesTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS dailysales (
        id SERIAL PRIMARY KEY,
        shopId VARCHAR(20) NOT NULL,
        nbSales INT DEFAULT 0,
        totalAmount INT DEFAULT 0,
        date DATE NOT NULL,
        FOREIGN KEY (shopId) REFERENCES shops(id) ON DELETE CASCADE
    )`;
    try {
        await query(sql);
        console.log("Table 'dailysales' created or already exists.");
    }
    catch (error) {
        console.error("Error creating 'dailysales' table:", error);
    }
}
export const newDailySales = (shopId, nbSales, totalAmount, date) => {
    const sql = "INSERT INTO dailysales (shopId, nbSales, totalAmount, date) VALUES ($1, $2, $3, $4) RETURNING *";
    return query(sql, [shopId, nbSales, totalAmount, date]);
}
export const getAllDailySales = () => {
    const sql = "SELECT * FROM dailysales";
    return query(sql);
}
export const getDailySalesByShopId = (shopId) => {
    const sql = "SELECT * FROM dailysales WHERE shopId = $1";
    return query(sql, [shopId]);
}
export const getDailySalesById = (id) => {
    const sql = "SELECT * FROM dailysales WHERE id = $1";
    return query(sql, [id]);
}
export const getDailySalesByDate = (date) => {
    const sql = "SELECT * FROM dailysales WHERE date = $1";
    return query(sql, [date]);
}
export const deleteDailySalesById = (id) => {
    const sql = "DELETE FROM dailysales WHERE id = $1";
    return query(sql, [id]);
}
export const updateDailySalesById = (shopId, nbSales, totalAmount, date) => {
    const sql = "UPDATE dailysales SET nbSales=$1, totalAmount=$2 WHERE date = $3 AND shopId = $4 RETURNING *"
    return query(sql, [nbSales, totalAmount, date, shopId])
}
export const updateNbSales = (id, newNbSales) => {
    const sql = "UPDATE dailysales SET nbSales = $1 WHERE id = $2 RETURNING *"
    return query(sql, [newNbSales, id])
}
export const updateTotalAmount = (id, newTotalAmount) => {
    const sql = "UPDATE dailysales SET totalAmount = $1 WHERE id = $2 RETURNING *"
    return query(sql, [newTotalAmount, id])
}
