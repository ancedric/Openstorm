// Multer.Config.js (Version Locale Améliorée)

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Assurez-vous que le dossier 'uploads/' existe !
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Utilisation de path.parse pour isoler le nom de base sans extension
        const baseName = path.parse(file.originalname).name.replace(/\s/g, '_'); // Remplacer les espaces
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        // Nom du fichier généré: NOM_FICHIER_PROPRE-TIMESTAMP-SUFFIXE.EXT
        cb(null, `${baseName}-${uniqueSuffix}${extension}`); 
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 } // Limite la taille des fichiers à 5MB (exemple de bonne pratique)
});

export default upload;