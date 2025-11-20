import {query} from '../config/db.config.js'

export const createProductsTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        ref VARCHAR(20) NOT NULL,
        shopRef VARCHAR(20) NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(30) NOT NULL,
        summary VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        supplier VARCHAR(45),
        price INT NOT NULL,
        reduction INT,
        stock INT,
        status VARCHAR(30),
        image VARCHAR(30),
        createdAt DATE NOT NULL,
        FOREIGN KEY (shopRef) REFERENCES shops(ref) ON DELETE CASCADE
    )`;
    try {
        await query(sql);
        console.log("Table 'products' created or already exists.");
    }
    catch (error) {
        console.error("Error creating 'products' table:", error);
    }
}

export const newProduct = (ref, shopRef, name, category, summary, description, supplier, price, reduction, stock, status, image, date) => {
    const sql = "INSERT INTO products (ref, shopRef, name, category, summary, description, supplier, price, reduction, stock, status, image, createdAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *";
    return query(sql, [ref, shopRef, name, category, summary, description, supplier, price, reduction, stock, status, image, date]);
}
export const getAllProducts = () => {
    const sql = "SELECT * FROM products";
    return query(sql);
}
export const getProductsByShopId = (shopRef) => {
    const sql = "SELECT * FROM products WHERE shopRef = $1";
    return query(sql, [shopRef]);
}
export const getProductById = (id) => {
    const sql = "SELECT * FROM products WHERE id = $1";
    return query(sql, [id]);
}
export const getStock = async (productId) => {
    const sql = "SELECT stock FROM products  WHERE id = $1";
    const stock =  await query(sql, [productId]); 
    return stock[0].stock
}
export const deleteProductById = (id) => {
    const sql = "DELETE FROM products WHERE id = $1";
    return query(sql, [id]);
}
export const updateProductById = (id, name, category, summary, description, supplier, price, reduction, image) => {
    const sql = "UPDATE products SET name = $1, category = $2, summary = $3, description = $4, supplier = $5, price = $6, reduction = $7, image = $8 WHERE id = $9 RETURNING *"
    return query(sql, [name, category, summary, description, supplier, price, reduction, image, id])
}
export const updateStock = (id, newStock) => {
    const sql = "UPDATE products SET stock = $1 WHERE id = $2 RETURNING *"
    return query(sql, [newStock, id])
}
export const updatePrice = (id, newPrice) => {
    const sql = "UPDATE products SET price = $1 WHERE id = $2 RETURNING *"
    return query(sql, [newPrice, id])
}
