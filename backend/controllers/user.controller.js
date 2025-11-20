/* eslint-disable no-undef */
import * as user from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


export const getMe = async (req, res) => {
    const userRef = req.user.ref; // Assumons que le 'ref' a été inclus dans le token
    
    if (!userRef) {
        return res.status(403).json({ message: 'Informations d\'utilisateur non trouvées dans le jeton.' });
    }

    try {
        const userResult = await user.findUserByRef(userRef); 

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé en base de données.' });
        }

        const user = userResult[0];

        delete user.password; 
        res.status(200).json({ user: user });

    } catch (error) {
        console.error('Erreur lors de la récupération de /user/me:', error);
        res.status(500).json({ message: 'Erreur serveur interne.' });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body; 

    try {
        const users = await user.getUserByEmail(email);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Identifiants invalides (Email incorrect).' });
        }

        const foundUser = users[0];
        const hashedPassword = foundUser.password;
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (isMatch) {
            const generatedToken = jwt.sign({ id: foundUser.id, email: foundUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            // Pour des raisons de sécurité, retirez le mot de passe de l'objet utilisateur avant de le renvoyer
            delete foundUser.password; 
            
            return res.status(200).json({ 
                message: 'Connexion réussie', 
                user: foundUser,
                token: generatedToken
            });
        } else {
            // 4. Échec : Les mots de passe ne correspondent pas
            return res.status(401).json({ message: 'Identifiants invalides (Mot de passe incorrect).' });
        }

    } catch (error) {
        console.error('Erreur de connexion:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
    }
};

export const signup = async (req, res) => {
    const { firstname, lastname, email, password, phone, role, plan} = req.body;
    const date = new Date().toISOString().split('T')[0];
    const now = Date.now()
    const year = new Date()
    const ref = `USER-${year.getFullYear()}-${now}` 
        try {
            const result = await user.newUser(ref, firstname, lastname, email, password, phone, role, plan, date);
            console.log('Nouvel utilisateur créé avec succès:', result);
            res.status(201).json({ message: 'Nouvel utilisateur créé avec succès', user: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la création de l\'utilisateur.' });
        }
}

export const allUsers = async (req, res) => {
    try {
            const users = await user.getAllUsers();
            res.json({ users });
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des utilisateurs.' });
        }
}
export const getUserFromId = async (req, res) => {
    const id = req.params.id;
        try {
            const userRes = await user.getUserById(id);
            if (userRes.length === 0) {
                return res.status(404).json({ error: 'Utilisateur non trouvé.' });
            }
            res.json({ user: userRes[0] });
        }
        catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de l\'utilisateur.' });
        }
}
export const deleteUser = async (req, res) => {
    const id = req.params.id;
        try {
            await user.deleteUserById(id);
            res.json({ message: 'Utilisateur supprimé avec succès.' });
        }   
        catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de l\'utilisateur' });
        }
}
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { firstName, lastName, email, phone } = req.body;
        try {
            const result = await user.updateUserById(id, firstName, lastName, email, phone);
            res.json({ message: 'Utilisateur mis à jour avec succès.', user: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de l\'utilisateur' });
        }
}
export const updateUserPassword = async (req, res) => {
    const id = req.params.id;
    let { newPassword } = req.body;
    // Hasher le nouveau mot de passe avant de le mettre à jour
    const salt = bcrypt.genSaltSync(10);
    newPassword = bcrypt.hashSync(newPassword, salt);
        try {
            const result = await user.updatePassword(id, newPassword);
            res.json({ message: 'Mot de passe mis à jour avec succès.', user: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour du mot de passe:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du mot de passe' });
        }
}
export const updateUserRole = async (req, res) => {
    const id = req.params.id;
    const { newRole } = req.body;
        try {
            const result = await user.updateRole(id, newRole);
            res.json({ message: 'Rôle mis à jour avec succès.', user: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour du rôle:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du rôle' });
        }
}
export const updateUserEmail = async (req, res) => {
    const id = req.params.id;
    const { newEmail } = req.body;
        try {
            const result = await user.updateEmail(id, newEmail);
            res.json({ message: 'Email mis à jour avec succès.', user: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour de l\'email:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de l\'email' });
        }
}
export const updateUserPhone = async (req, res) => {
    const id = req.params.id;
    const { newPhone } = req.body;
        try {
            const result = await user.updatePhone(id, newPhone);
            res.json({ message: 'Téléphone mis à jour avec succès.', user: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour du téléphone:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du téléphone' });
        }
}
export const updateUserName = async (req, res) => {
    const id = req.params.id;
    const { newFirstName, newLastName } = req.body;
        try {
            const result = await user.updateName(id, newFirstName, newLastName);
            res.json({ message: 'Nom mis à jour avec succès.', user: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour du nom:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du nom' });
        }
}
export const updateUserPlan = async (req, res) => {
    const id = req.params.id;
    const { newPlan } = req.body;
        try {
            const result = await user.updatePlan(id, newPlan);
            res.json({ message: 'Plan mis à jour avec succès.', user: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour du plan:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du plan' });
        }
}
