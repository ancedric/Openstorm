import {query} from '../config/db.config.js'

export const createShopsTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS shops (
        id SERIAL PRIMARY KEY,
        ref VARCHAR(20) NOT NULL,
        userRef VARCHAR(20) NOT NULL,
        name VARCHAR(255) NOT NULL,
        cash INT DEFAULT 0,
        activity VARCHAR(30) NOT NULL,
        openingHour VARCHAR(100),
        closeHour VARCHAR(100),
        country VARCHAR(45),
        city VARCHar(50) NOT NULL,
        remainingActivationTime INT DEFAULT 0,
        -- NOUVEAU: Colonne pour suivre la dernière vérification de l'abonnement
        last_update_time TIMESTAMP DEFAULT NOW(), 
        image VARCHAR(255),
        createdAt DATE NOT NULL,
        FOREIGN KEY (userRef) REFERENCES users(ref) ON DELETE CASCADE
    )`;
    try {
        await query(sql);
        console.log("Table 'shops' created or already exists.");
    }
    catch (error) {
        console.error("Error creating 'shops' table:", error);
    }
}

export const newShop = (ref, userRef, name, activity, openingHour, closeHour, country, city, image, date) => {
    const sql = "INSERT INTO shops (ref, userRef, name, activity, openingHour, closeHour, country, city, image, createdAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return query(sql, [ref, userRef, name, activity, openingHour, closeHour, country, city, image, date]);
}
export const getAllShops = () => {
    const sql = "SELECT * FROM shops";
    return query(sql);
}
export const getShopByUserId = (userRef) => {
    const sql = "SELECT * FROM shops WHERE userRef = $1";
    return query(sql, [userRef]);
}
export const getShopById = (id) => {
    const sql = "SELECT * FROM shops WHERE id = $1";
    return query(sql, [id]);
}
export const deleteShopById = (id) => {
    const sql = "DELETE FROM shops WHERE id = $1";
    return query(sql, [id]);
}
export const updateShopById = (id, name, activity, country, city, image) => {
    const sql = "UPDATE shops SET (name, activity, country, city, image) VALUES ($1, $2, $3, $4, $5) WHERE id = $6 RETURNING *"
    return query(sql, [name, activity, country, city, image, id])
}
export const updateName = (id, newName) => {
    const sql = "UPDATE shops SET name = $1 WHERE id = $2 RETURNING *"
    return query(sql, [newName, id])
}
export const updateActivity = (id, newActivity) => {
    const sql = "UPDATE shops SET activity = $1 WHERE id = $2 RETURNING *"
    return query(sql, [newActivity, id])
}
export const updateImage = (id, newImage) => {
    const sql = "UPDATE shops SET image = $1 WHERE id = $2 RETURNING *"
    return query(sql, [newImage, id])
}
export const updateOpeningHour = (id, newOpeningHour) => {
    const sql = "UPDATE shops SET openingHour = $1 WHERE id = $2 RETURNING *"
    return query(sql, [newOpeningHour, id])
}
export const updateCloseHour = (id, newCloseHour) => {
    const sql = "UPDATE shops SET closeHour = $1 WHERE id = $2 RETURNING *"
    return query(sql, [newCloseHour, id])
}
export const updateCash = (id, newCash) => {
    const sql = "UPDATE shops SET cash = $1 WHERE id = $2 RETURNING *"
    return query(sql, [newCash, id])
}
export const updateRemainingActivationTime = (id, plan) => {
    const sql = "UPDATE shops SET remainingactivationtime = $1 WHERE ref = $2 RETURNING *"
    return query(sql, [plan, id])
}

// NOUVEAU: Fonction pour mettre à jour les jours restants et le temps de la dernière mise à jour
export const updateSubscriptionState = (shopRef, newRemainingDays, lastUpdateTime) => {
    const sql = `UPDATE shops 
                 SET remainingActivationTime = $1, 
                     last_update_time = $2 
                 WHERE ref = $3 
                 RETURNING *`;
    return query(sql, [newRemainingDays, lastUpdateTime, shopRef]);
}