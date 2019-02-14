# Enigma | NodeJs | Conference app

Rendu de l'examen de NodeJs sur la création d'un application de conférence

Fonctions couvertes :
- Espace d'enregistrement
- Espace d'authentification
- Panneau administrateur
- Chat sécurisé par conférences
- Messages privés 

## Description
L'application est pensé en client - serveur, l'essentiel du travail est fait dans l'api `/routes/api`

Il existe deux middleware `/utils`: 
- Vérification JWT
- Vérication Administrateur

Les fonctions d'ajout, d'édition et suppression nécessitent un adminitrateur

Le chat est sécurisé avec le token jwt `/routes/index` et `/views/public/conference.ejs` aisni qu'une vérification que l'utilisateur fait parti de la conférence

Les messages sécurisés sont uniquement visibles dans la partie administration

L'utilisateur administrateur est : `rastaadmin:rastaadmin`

L'authentification est valide pendant 1h

La route de déconnexion est `/logout` (à taper à la main)

## Installation

Cloner le projet :
```
https://github.com/averdier/enigma_nodejs_conf
```

Installer les dépendances
```
cd enigma_nodejs_conf
npm install
```

Lancer MongoDB sur le port 27017 (port par défaut)

Lancer le projet :
```
npm start

//

nodemon
```