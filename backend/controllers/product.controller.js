import * as product from '../models/products.js';


export const createNewProduct = async (req, res) => {
    const file = req.file
    if (!file) {
        return res.status(400).json({ error: 'Aucun fichier image fourni.' });
    }
    
    const uploadedFileName = file.filename;

    const { ref, shopref, name, category, summary, description, supplier, price} = req.body;
    const date = new Date().toISOString().split('T')[0];
        try {
            const result = await product.newProduct(ref, shopref, name, category, summary, description, supplier, price, 0, 0, 'out of order', uploadedFileName, date);
            res.status(201).json({ message: 'Nouveau produit créé avec succès', product: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la création du produit:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la création du produit.' });
        }
}

export const allProducts = async (req, res) => {
    try {
            const products = await product.getAllProducts();
            res.json({ products });
        } catch (error) {
            console.error('Erreur lors de la récupération des produits:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des produits.' });
        }
}

export const getProductsByShopRef = async(req, res) => {
    const shopRef = req.params.shopRef;
        try {
            const products = await product.getProductsByShopId(shopRef);
            res.json({ products: products  });
        }
        catch (error) {
            console.error('Erreur lors de la récupération des produits de la boutique:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des produuits de la boutique.' });
        }
}

export const getProductFromId = async (req, res) => {
    const id = req.params.id;
        try {
            const productRes = await product.getProductById(id);
            if (productRes.length === 0) {
                return res.status(404).json({ error: 'Produit non trouvé.' });
            }
            res.json({ product: productRes[0] });
        }
        catch (error) {
            console.error('Erreur lors de la récupération du produite:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du produit.' });
        }
}

export const deleteProduct = async (req, res) => {
    const id = req.params.id;
        try {
            await product.deleteProductById(id);
            res.json({ message: 'Produit supprimée avec succès.' });
        }   
        catch (error) {
            console.error('Erreur lors de la suppression du produit:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du produit' });
        }
}

export const updateProduct = async (req, res) => {
    const file = req.file
    if (!file) {
        return res.status(400).json({ error: 'Aucun fichier image fourni.' });
    }
    
    const uploadedFileName = file.filename;

    const {id, name, category, summary, description, supplier, price, reduction} = req.body
    try{
        const result = await product.updateProductById(id, name, category, summary, description, supplier, price, reduction, uploadedFileName)
        res.json({message: 'Produit mis à jour avec succès', product: result[0] })
    }
    catch(error){
        console.error('Erreur lors de la mise à jour du produit', error)
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour du produit'})
    }
}

export const updateProductPrice =  async (req, res) => {
    const {id, newPrice} = req.params
    try{
        const result = await product.updatePrice(id, newPrice)
        res.json({message:'Mise à jour du prix réussie', product: result[0] })
    }
    catch(error){
        console.error('Erreur lors de la mise à jour du prix du produit', error)
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour du prix du produit'})
    }
}

export const updateProductStock = async (req, res) => {
    const {quantity} = req.body
    const {id} = req.params
    console.log("Données reçues: ", quantity, id)
    try{
        const currentStock = await product.getStock(id)
        const newStock = currentStock - quantity
        const result = await product.updateStock(id, newStock)
        console.log("result: ", result)
        res.status(201).json({message: 'Mise à jour du stock réussie', product: result})
    }
    catch(error){
        console.error('Erreur lors de la mise à jour du stock', error)
        res.status(500).json({error: 'Une erreur est survenue lors de la mis à jour du stock'})
    }
}
export const addProductStock = async (req, res) => {
    const {quantity} = req.body
    const {id} = req.params
    console.log("Données reçues: ", quantity, id)
    try{
        const currentStock = await product.getStock(id)
        const newStock = currentStock + quantity
        const result = await product.updateStock(id, newStock)
        console.log("result: ", result)
        res.status(201).json({message: 'Mise à jour du stock réussie', product: result})
    }
    catch(error){
        console.error('Erreur lors de la mise à jour du stock', error)
        res.status(500).json({error: 'Une erreur est survenue lors de la mis à jour du stock'})
    }
}