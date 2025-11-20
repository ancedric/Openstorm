import {query} from '../config/db.config.js';

export const createCartTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        shopId INT NOT NULL,
        amount INT NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (shopId) REFERENCES shops(id) ON DELETE CASCADE
    )`;
    try {
        await query(sql);
        console.log("Table 'cart' created or already exists.");
    } catch (error) {
        console.error("Error creating 'cart' table:", error);
    }
}

export const newCart = (shopId, total) => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const sql = "INSERT INTO carts (shopId, amount, date) VALUES ($1, $2, $3) RETURNING *";
    return query(sql, [shopId, total, date]);
}

export const getAllCarts = () => {
    const sql = "SELECT * FROM carts";
    return query(sql);
}

export const getCartsByShopId = (shopId) => {
    const sql = "SELECT * FROM carts WHERE shopid = $1";
    return query(sql, [shopId]);
}

export const getCartById = (id) => {
    const sql = "SELECT * FROM carts WHERE id = $1";
    return query(sql, [id]);
}

export const deleteCartById = (id) => {
    const sql = "DELETE FROM carts WHERE id = $1";
    return query(sql, [id]);
}