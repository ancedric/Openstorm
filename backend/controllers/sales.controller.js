import * as sales from '../models/sales.js';


export const getAllDailySales = async (req, res) => {
        try {
            const dailySales = await sales.getAllDailySales();
            if (dailySales.length === 0) {
                console.log('Aucune vente journalière trouvée');
            }
            res.json({ dailySales });
        } catch (error) {
            console.error('Erreur lors de la récupération des ventes journalières:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des ventes journalières.' });
        }
}
export const getSalesByShopId = async(req, res) => {
    const shopId = req.params.shopId;
        try {
            const salesData = await sales.getDailySalesByShopId(shopId); 
            res.json({ salesData  });
        }
        catch (error) {
            console.error('Erreur lors de la récupération des ventes de la boutique:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des ventes de la boutique.' });
        }
}
export const updateDailySales = async (req, res) => {
    const {shopId} = req.params;
    const { nbSales, totalAmount, date } = req.body;
        try {
            const result = await sales.updateDailySalesById(shopId, nbSales, totalAmount, date);
            res.json({ message: 'Ventes journalières mises à jour avec succès.', dailySales: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour des ventes journalières:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour des ventes journalières.' });
        }
}
export const createDailySales = async (req, res) => {
    const { shopId, nbSales, totalAmount } = req.body;
        try {
            const result = await sales.newDailySales(shopId, nbSales, totalAmount, new Date( ).toISOString());
            res.status(201).json({ message: 'Nouvelles ventes journalières créées avec succès', dailySales: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la création des ventes journalières:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la création des ventes journalières.' });
        }
}

