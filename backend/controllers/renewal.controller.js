import * as renewalController from '../models/renewal.js';

export const addRenewal = async (req, res) => {
    const { shopRef, userPlan} = req.body;
    const capture = req.file
    if (!capture) {
        return res.status(400).json({ error: 'Aucun fichier capture fourni.' });
    }
    
    const uploadedFileName = capture.filename;

    try {
        const result = await renewalController.newRenewal(shopRef, userPlan, uploadedFileName);
        console.log('Nouvelle demande de renouvellement créée avec succès:', result);
        res.status(201).json({ message: 'Nouvelle demande de renouvellement créée avec succès', renewal: result[0] });
    }
    catch (error) {
        console.error('Erreur lors de la création de la demande de renouvellement:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la création de la demande de renouvellement.' });
    }
};

//route pour récupérer toutes les demandes de renouvellement
export const allRenewals = async (req, res) => {
    try {
        const renewals = await renewalController.getAllRenewals();
        res.json({ renewals });
    } catch (error) {
        console.error('Erreur lors de la récupération des demandes de renouvellement:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des demandes de renouvellement.' });
    }
};