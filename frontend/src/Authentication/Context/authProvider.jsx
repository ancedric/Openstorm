/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react';
import api from '../../axiosConfig';
import AuthContext from './AuthContext';
import PropTypes from 'prop-types';

// Constante pour 24 heures en millisecondes
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [shop, setShop] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showShopSetup, setShowShopSetup] = useState(false);
    const [isSubscriptionCheckDone, setIsSubscriptionCheckDone] = useState(false); 


    /**
     * @description Met à jour le temps d'activation restant et l'heure de la dernière mise à jour côté serveur.
     */
    const updateSubscriptionState = useCallback(async (shopRef, newRemainingDays) => {
        console.log("DEBUG: Mise à jour:", shopRef, newRemainingDays)
        try {
            console.log("DEBUG: Vérification de l'état d'activation de la boutique")
            const response = await api.put(`/shops/update-subscription-state/${shopRef}`, {
                remainingActivationTime: newRemainingDays, 
                last_update_time: new Date().toISOString() 
            });

            if (response.data && response.data.shop) {
                // Mettre à jour l'état local avec la nouvelle boutique renvoyée par le serveur
                setShop(response.data.shop);
                console.log("DEBUG: Abonnement boutique mis à jour. Jours restants:", response.data.shop.remainingactivationtime);
                return response.data.shop;
            }
            return null;
        } catch (err) {
            console.error("Erreur lors de la mise à jour de l'abonnement de la boutique :", err);
            // Si le mock est utilisé, ceci ne sera pas déclenché.
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                signOut();
            }
            return null;
        }
    }, []);

    const signIn = useCallback(async (email, password) => {
        const response = await api.post('/user/login', { email, password }); 
        
        const { token, user: userData } = response.data;

        if (token && userData) {
            localStorage.setItem('token', token); 
            
            setUser(userData);
            setProfile(userData)
            setIsAuthenticated(true);

            const isShopFound = await fetchShop(userData.ref);
            if (!isShopFound) {
                setShowShopSetup(true);
            }
            return userData;
        } else {
            throw new Error("Authentification échouée: Jeton manquant");
        }
    }, []);

    const signOut = useCallback(() => {
        setUser(null);
        setProfile(null);
        setShop(null);
        setIsAuthenticated(false);
        setShowShopSetup(false);
        setIsSubscriptionCheckDone(false); 
        localStorage.removeItem('token'); 
    }, []);

    const fetchProfile = useCallback(async (id) => {
        try {
            const response = await api.get(`/user/user/${id}`); 
            if (response.data && response.data.user) {
                setProfile(response.data.user);
                console.log("DEBUG: Profil récupéré", response.data.user);
            }
        } catch (err) {
            console.error("Erreur lors de la récupération du profil :", err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                signOut(); 
            }
        }
    }, [signOut]);

    const fetchShop = useCallback(async (ref) => {
        if (!ref) return false;
        try {
            const response = await api.get(`/shops/get-user-shop/${ref}`); 
            if (response.data && response.data.shop && response.data.shop.length > 0) {
                setShop(response.data.shop[0]);
                checkAndDecrementSubscription(response.data.shop[0]);
                return true;
            }
            setShop(null);
            return false;
        } catch (err) {
            console.error("Erreur lors de la récupération de la boutique :", err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                signOut();
            }
            return false
        }
    }, [signOut]);

    /**
     * @description Calcule le temps écoulé depuis la dernière mise à jour et décrémente les jours restants.
     */
    const checkAndDecrementSubscription = useCallback(async (currentShop) => {
        if (!currentShop || currentShop.remainingactivationtime === undefined) {
            setIsSubscriptionCheckDone(true);
            return;
        }

        const now = Date.now();
        
        const lastUpdateTime = new Date(currentShop.last_update_time || currentShop.createdat).getTime();

        const timeDifference = now - lastUpdateTime;
        
        const daysElapsed = Math.floor(timeDifference / DAY_IN_MS);
        if (daysElapsed > 0) {
            const currentRemaining = currentShop.remainingactivationtime;
            const newRemainingDays = Math.max(0, currentRemaining - daysElapsed);
            await updateSubscriptionState(currentShop.ref, newRemainingDays);
        }

        setIsSubscriptionCheckDone(true);
    }, [updateSubscriptionState]);


    // Fonction pour récupérer l'utilisateur à partir du token stocké
    const fetchAndSetUserFromToken = useCallback(async () => {
        try {
            const response = await api.get('/user/me'); 
            const userData = response.data.user;

            if (userData) {
                setUser(userData);
                setIsAuthenticated(true);

                const isShopFound = await fetchShop(userData.ref);
                if (!isShopFound) {
                    setShowShopSetup(true);
                }
                await fetchProfile(userData.id);
            } else {
                signOut(); 
            }
        } catch (error) {
            console.error("Token de session invalide ou expiré.", error);
            signOut(); 
        }
    }, [fetchProfile, fetchShop, signOut]); 

    // Charger l'utilisateur au montage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            fetchAndSetUserFromToken(); 
        } else {
             // Si pas connecté, la vérification est considérée comme faite
             setIsSubscriptionCheckDone(true);
        }
    }, [fetchAndSetUserFromToken]);

    // Déclencher la vérification de l'abonnement lorsque la boutique est chargée
    useEffect(() => {
        if (isAuthenticated && shop) {
            checkAndDecrementSubscription(shop);
        }
         // Si authentifié mais pas de boutique (setup en attente), la vérification est considérée comme faite.
        if (isAuthenticated && shop === null && showShopSetup) {
             setIsSubscriptionCheckDone(true);
        }
    }, [isAuthenticated, shop, checkAndDecrementSubscription, showShopSetup]);
    
    //Intervalle pour les sessions très longues: vérification toutes les 24h
    useEffect(() => {
        if (isAuthenticated && shop && shop.remainingactivationtime > 0) {
            const intervalId = setInterval(() => {
                checkAndDecrementSubscription(shop);
            }, DAY_IN_MS); 

            return () => clearInterval(intervalId);
        }
    }, [isAuthenticated, shop, checkAndDecrementSubscription]);

    const completeShopSetup = (newShopData) => {
        setShop(newShopData);
        setShowShopSetup(false);
        // Lancer la vérification immédiatement après la configuration initiale
        checkAndDecrementSubscription(newShopData);
    };

    const value = { 
        user, 
        profile, 
        shop, 
        isAuthenticated, 
        showShopSetup, 
        isSubscriptionCheckDone, 
        signIn, 
        signOut, 
        fetchShop, 
        fetchProfile, 
        completeShopSetup 
    };

    // Afficher un écran de chargement si l'utilisateur est authentifié mais que la vérification n'est pas terminée
    


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.object,
};
export default AuthProvider;