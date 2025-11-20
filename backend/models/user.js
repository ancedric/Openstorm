import {query} from '../config/db.config.js';
import bcrypt from 'bcrypt'

export const createUsersTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        ref VARCHAR(20) NOT NULL,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,  
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(15),
        role VARCHAR(20) NOT NULL,
        plan VARCHAR(20) DEFAULT 'free',
        createdAt DATE NOT NULL
    )`;
    try {
        await query(sql);
        console.log("Table 'users' created or already exists.");
    }
    catch (error) {
        console.error("Error creating 'users' table:", error);
    }
}

export const newUser = (ref, firstName, lastName, email, password, phone, role, plan, date) => {
    // Hash the password before storing it
    const salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);

    const sql = "INSERT INTO users (ref, firstName, lastName, email, password, phone, role, plan, createdAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
    return query(sql, [ref, firstName, lastName, email, password, phone, role, plan, date]);
}
export const getAllUsers = () => {
    const sql = "SELECT * FROM users";
    return query(sql);
}
export const getUserByEmail = (email) => {
    const sql = "SELECT * FROM users WHERE email = $1";
    return query(sql, [email]);
}
export const getUserById = (id) => {
    const sql = "SELECT * FROM users WHERE id = $1";
    return query(sql, [id]);
}
export const deleteUserById = (id) => {
    const sql = "DELETE FROM users WHERE id = $1";
    return query(sql, [id]);
}
export const updateUserById = (id, firstName, lastName, email, phone) => {
    const sql = "UPDATE users SET (firstName, lastName, email, phone) VALUES ($1, $2, $3, $4) WHERE ref = $5 RETURNING *"
    return query(sql, [firstName, lastName, email, phone, id])
}
export const updatePassword = (id, newPassword) => {
    const sql = "UPDATE users SET password = $1 WHERE id = $2 RETURNING *"
    return query(sql, [newPassword, id])
}
export const updateRole = (id, newRole) => {
    const sql = "UPDATE users SET role = $1 WHERE id = $2 RETURNING *"
    return query(sql, [newRole, id])
}
export const updateEmail = (id, newEmail) => {
    const sql = "UPDATE users SET email = $1 WHERE id = $2 RETURNING *"
    return query(sql, [newEmail, id])
}
export const updatePhone = (id, newPhone) => {
    const sql = "UPDATE users SET phone = $1 WHERE id = $2 RETURNING *"
    return query(sql, [newPhone, id])
}
export const updateName = (id, newFirstName, newLastName) => {
    const sql = "UPDATE users SET (firstName, lastName) VALUES ($1, $2) WHERE id = $3 RETURNING *"
    return query(sql, [newFirstName, newLastName, id])
}
export const updatePlan = (id, newPlan) => {
    const sql = "UPDATE users SET plan = $1 WHERE id = $2 RETURNING *"
    return query(sql, [newPlan, id])
}