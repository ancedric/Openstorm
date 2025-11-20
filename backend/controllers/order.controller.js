import * as order from '../models/order.js'


export const createNewOrder = async (req, res) => {
    const { cartId, productId, quantity, price, reduction, total, date } = req.body;
        try {
            const result = await order.newOrder(cartId, productId, quantity, price, reduction, total, date);
            res.status(201).json({ message: 'Nouveau panier créé avec succès', cart: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la création de la commande:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la création du panier.' });
        }
}

export const allOrders = async (req, res) => {
    try {
            const orders = await order.getAllOrders();
            res.json({ orders });
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des commandes.' });
        }
}

export const getOrdersByShopRef = async(req, res) => {
    const {cartId} = req.params;
        try {
            const orders = await order.getOrdersByShopId(cartId);
            res.json({ orders });
        }
        catch (error) {
            console.error('Erreur lors de la récupération des commandes de la boutique:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des commandes de la boutique.' });
        }
}

export const getOrderFromId = async (req, res) => {
    const id = req.params.id;
        try {
            const orderRes = await order.getOrderById(id);
            if (orderRes.length === 0) {
                return res.status(404).json({ error: 'Commande non trouvé.' });
            }
            res.json({ order: orderRes[0] });
        }
        catch (error) {
            console.error('Erreur lors de la récupération de la commande:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la commande.' });
        }
}
export const getOrderFromProductId = async (req, res) => {
    console.log('Appel de getOrderFromProductId du controlleur')
    const id = req.params.id;
    console.log('Identifiant envoyé', id)
        try {
            const orderRes = await order.getOrderByProductId(id);
            if (orderRes.length === 0) {
                return res.json({ error: `Commande non trouvée. pour l'id ${id}` });
            }
            res.json({ order: orderRes });
        }
        catch (error) {
            console.error('Erreur lors de la récupération de la commande:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la commande.' });
        }
}

export const deleteOrder = async (req, res) => {
    const id = req.params.id;
        try {
            await order.deleteOrdertById(id);
            res.json({ message: 'Commande supprimée avec succès.' });
        }   
        catch (error) {
            console.error('Erreur lors de la suppression de la commande:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de la commande.' });
        }
}