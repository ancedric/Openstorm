# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

---

# Instructions pour exécuter l'application

Ce dépôt contient :
- frontend (React + Vite)
- backend (API Node/Express)
- electron (wrapper Electron)

Prérequis
- Node.js (>=18 recommandé)
- npm
- Pour builder des exécutables : voir les sections correspondantes ci-dessous (wine pour cross-build Windows depuis Linux, outils système pour electron-builder)

Installation

- Installer les dépendances racine (utile pour electron, electron-builder, scripts utilitaires) :

```bash
npm install
```

- Installer les dépendances du frontend :

```bash
npm run frontend:install
# ou depuis le répertoire frontend
# cd frontend && npm install
```

- Installer les dépendances du backend (si nécessaire) :

```bash
cd backend && npm install
```

Scripts utiles

- Lancer le backend en mode développement :

```bash
npm run backend:dev
# ou depuis backend
# cd backend && npm run dev
```

- Lancer le frontend en mode développement (Vite) :

```bash
npm run frontend:dev
# ouvre le frontend en dev mode (HMR) sur http://localhost:5173
```

- Lancer l'application Electron en mode développement (backend + frontend + Electron) :

```bash
npm run electron:dev
```

- Lancer l'application Electron sans mode dev :

```bash
npm run electron:start
```

Générer les exécutables / build de production

1) Construire le frontend (production build) :

```bash
npm run frontend:build
# ou cd frontend && npm run build
```

2) Générer les paquets Electron (Linux par défaut selon package.json) :

```bash
npm run electron:build
```

Ce script, tel qu'il est défini actuellement dans `package.json`, exécute d'abord la construction du frontend puis lance `electron-builder` pour générer des paquets Linux (AppImage, deb) pour les architectures armv7l et arm64.

Créer un exécutable Windows

- Option rapide (si vous êtes sur Windows ou dans un environnement compatible) :

```bash
# construire le frontend
npm run frontend:build
# puis lancer electron-builder pour Windows (x64 par exemple)
npx electron-builder --win --x64
```

- Cross-build Windows depuis Linux :

electron-builder peut produire des artefacts Windows depuis Linux mais cela nécessite des dépendances système (par ex. wine). Le cross-build n'est pas toujours simple à configurer :
- Installez `wine` et les outils requis (sur Debian/Ubuntu : `sudo apt install wine`),
- Puis exécutez `npx electron-builder --win --x64`.

Note importante : la manière la plus simple et fiable pour produire des paquets Windows est de builder directement sur une machine Windows ou d'utiliser une CI (GitHub Actions, par ex.) configurée pour Windows. Sur CI il est courant d'ajouter un job Windows qui exécute :

```bash
npm ci
npm run frontend:build
npx electron-builder --win --x64
```

Modifier le script `electron:build` pour inclure Windows

Si vous préférez ajouter une commande qui build aussi Windows depuis la racine, vous pouvez modifier (ou ajouter) un script dans `package.json`, par exemple :

```json
"scripts": {
  "electron:build:linux": "npm run frontend:build && electron-builder --linux --armv7l --arm64",
  "electron:build:win": "npm run frontend:build && electron-builder --win --x64",
  "electron:build:all": "npm run frontend:build && electron-builder --linux --armv7l --arm64 --win --x64"
}
```

Attention : lancer `electron-builder --win` sur Linux sans wine ou sans configuration adéquate échouera ; préférez builder sur Windows ou via CI.

Remarques et conseils

- `electron:start` démarre l'application Electron en mode production (ELECTRON_DEV=false) — utile pour tester l'exécutable localement sans HMR.
- Consultez la documentation d'electron-builder pour les options avancées et la configuration des cibles : https://www.electron.build/
- Si vous comptez distribuer pour Windows, pensez aux codesigning (signer vos exécutables) — là aussi généralement fait via CI ou depuis une machine Windows avec les certificats appropriés.

---

Si vous voulez, je peux :
- Mettre à jour `package.json` pour ajouter un script `electron:build:win` ou `electron:build:all` sur la branche `electron-embedded` ; ou
- Ajouter un exemple de workflow GitHub Actions pour builder Windows et Linux automatiquement.

Dites-moi si vous voulez que j'ajoute aussi la modification du `package.json` (script) ou un workflow CI.