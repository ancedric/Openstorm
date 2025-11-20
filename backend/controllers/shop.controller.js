import * as shop from '../models/shop.js';


export const createNewShop = async (req, res) => {
    let image
    const file = req.file
    if (file) {
        console.log('Fichier image reçu:', file);
        image = file.path
    }
    const { userRef, shopname, activity, openingHour, closeHour, country, city} = req.body;
    const date = new Date().toISOString().split('T')[0];
    const now = Date.now()
    const year = new Date()
    const ref = `SHOP-${year.getFullYear()}-${now}`
        try {
            const result = await shop.newShop(ref, userRef, shopname, activity, openingHour, closeHour, country, city, image, date);
            console.log('Nouvelle boutique créée avec succès:', result);
            res.status(201).json({ message: 'Nouvelle boutique créée avec succès', shop: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la création de la boutique:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la création de la boutique.' });
        }
}

export const allShops = async (req, res) => {
    try {
            const shops = await shop.getAllShops();
            res.json({ shops });
        } catch (error) {
            console.error('Erreur lors de la récupération des boutiques:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des boutiques.' });
        }
}

export const getShopByUserRef = async(req, res) => {
    const userRef = req.params.userRef;
        try {
            const foundShop = await shop.getShopByUserId(userRef);
            if(foundShop.length=== 0){
                return res.status(404).json({ message: 'Boutique non trouvée pour cet utilisateur.' });
            }
            res.json({ shop:foundShop });
        }
        catch (error) {
            console.error('Erreur lors de la récupération  de la boutique:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la boutique.' });
        }
}

export const getShopFromId = async (req, res) => {
    const id = req.params.id;
        try {
            const shopRes = await shop.getShopById(id);
            if (shopRes.length === 0) {
                return res.status(404).json({ error: 'Boutique non trouvée.' });
            }
            res.json({ product: shopRes[0] });
        }
        catch (error) {
            console.error('Erreur lors de la récupération de la boutique:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la boutique.' });
        }
}

export const deleteShop = async (req, res) => {
    const id = req.params.id;
        try {
            await shop.deleteShopById(id);
            res.json({ message: 'Boutique supprimée avec succès.' });
        }  
        catch (error) {
            console.error('Erreur lors de la suppression de la boutique:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de la boutique' });
        }
}

export const updateShop = async (req, res) => {
    const {id, name, activity, conuntry, city, image} = req.body
    try{
        const result = await shop.updateShopById(id, name, activity, conuntry, city, image)
        res.json({message: 'Boutique mise à jour avec succès', shop: result[0] })
    }
    catch(error){
        console.error('Erreur lors de la mise à jour de la boutique', error)
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour de la boutique'})
    }
}

export const updateShopName = async (req, res) => {
    const {id, newName} = req.body
    try{
        const result = await shop.updateName(id, newName)
        res.json({message:'Mise à jour du nom de la boutique réussie', shop: result[0] })
    }
    catch(error){
        console.error('Erreur lors de la mise à jour du nom de la boutique', error)
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour du nom de la boutique'})
    }
}

export const updateShopActivity = async (req, res) => {
    const {id, newActivity} = req.body
    try{
        const result = await shop.updateActivity(id, newActivity)
        res.json({message:'Mise à jour de l\'activité de la boutique réussie', shop: result[0] })
    }
    catch(error){
        console.error('Erreur lors de la mise à jour de l\'activité de la boutique', error)
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour de l\'activité de la boutique'})
    }
}

export const updateShopImage = (req, res) => {
    const file = req.file
    if (!file) {
        return res.status(400).json({ error: 'Aucun fichier image fourni.' });
    }
    console.log('Fichier image reçu:', file);

    const {id, newImage} = req.body
    try{
        const result = shop.updateImage(id, newImage)
        res.json({message: 'Mise à jour de l\'image de la boutique réussie', shop: result[0]})
    }
    catch(error){
        console.error('Erreur lors de la mise à jour de l\'image de la boutique', error)
        res.status(500).json({error: 'Une erreur est survenue lors de la mis à jour de l\'image de la boutique'})
    }
}
export const updateShopOpeningHour = async (req, res) => {
    const {id, newOpeningHour} = req.body
    try{
        const result = await shop.updateOpeningHour(id, newOpeningHour)
        res.json({message:'Mise à jour de l\'heure d\'ouverture de la boutique réussie', shop: result[0] })
    }
    catch(error){
        console.error('Erreur lors de la mise à jour de l\'heure d\'ouverture de la boutique', error)
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour de l\'heure d\'ouverture de la boutique'})
    }
}
export const updateShopCloseHour = async (req, res) => {
    const {id, newCloseHour} = req.body
    try{
        const result = await shop.updateCloseHour(id, newCloseHour)
        res.json({message:'Mise à jour de l\'heure de fermeture de la boutique réussie', shop: result[0] })
    }
    catch(error){
        console.error('Erreur lors de la mise à jour de l\'heure de fermeture de la boutique', error)
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour de l\'heure de fermeture de la boutique'})
    }
}
export const updateShopCash = async (req, res) => {
    const {id} = req.params
    const {newCash} = req.body
    try{
        const result = await shop.updateCash(id, newCash)
        res.json({message:'Mise à jour du cash de la boutique réussie', shop: result[0] })
    }
    catch(error){
        console.error('Erreur lors de la mise à jour du cash de la boutique', error)
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour du cash de la boutique'})
    }
}
export const updateShopRemainingActivationTime = async (req, res) => {
    const {id} = req.params 
    const {plan} = req.body
    console.log(plan, id)
    try{
        const result = await shop.updateRemainingActivationTime(id, plan)
        res.json({message:'Mise à jour du temps d\'activation restant de la boutique réussie', shop: result[0] })

        console.log(result[0])
    }
    catch(error){
        console.error('Erreur lors de la mise à jour du temps d\'activation restant de la boutique', error)
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour du temps d\'activation restant de la boutique'})
    }
}

// NOUVEAU: Contrôleur pour gérer la décrémentation des jours restants
export const updateSubscriptionState = async (req, res) => {
    const shopRef = req.params.shopRef; 
    console.log("Mise à jour du temps d'activation restant", shopRef)
    // Attention: le client envoie 'remainingActivationTime'
    const { remainingActivationTime, last_update_time } = req.body; 
    
    try {
        // Appeler la nouvelle fonction du modèle
        const result = await shop.updateSubscriptionState(shopRef, remainingActivationTime, last_update_time);
        
        if (result.length === 0) {
             return res.status(404).json({ error: 'Boutique non trouvée ou non mise à jour.' });
        }
        
        res.json({ message: 'État de l\'abonnement mis à jour avec succès', shop: result[0] });
    }
    catch(error){
        console.error('Erreur lors de la mise à jour de l\'état de l\'abonnement', error);
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour de l\'état de l\'abonnement'});
    }
}