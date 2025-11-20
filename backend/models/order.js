import {query} from '../config/db.config.js'

export const createOrderTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        cartId INT NOT NULL,
        productId INT NOT NULL,
        quantity INT NOT NULL,
        unitPrice INT NOT NULL,
        reduction INT,
        total DECIMAL(10, 2) NOT NULL,
        date DATE NOT NULL,
        FOREIGN KEY (cartId) REFERENCES carts(id) ON DELETE CASCADE
    )`;
    try {
        await query(sql);
        console.log("Table 'orders' created or already exists.");
    }
    catch (error) {
        console.error("Error creating 'orders' table:", error);
    }
}

export const newOrder = (cartId, productId, quantity, unitPrice, reduction, total, date) => {
    const sql = "INSERT INTO orders (cartId, productId, quantity, unitPrice, reduction, total, date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    return query(sql, [cartId, productId, quantity, unitPrice, reduction, total, date]);
}
export const getAllOrders = () => {
    const sql = "SELECT * FROM orders";
    return query(sql);
}
export const getOrdersByShopId = (cartId) => {
    const sql = "SELECT * FROM orders WHERE cartid = $1";
    return query(sql, [cartId]);
}
export const getOrderById = (id) => {
    const sql = "SELECT * FROM orders WHERE id = $1";
    return query(sql, [id]);
}
export const getOrderByProductId = (id) => {
    const sql = "SELECT * FROM orders WHERE productid = $1";
    return query(sql, [id]);
}
export const deleteOrderById = (id) => {
    const sql = "DELETE FROM orders WHERE id = $1";
    return query(sql, [id]);
}
