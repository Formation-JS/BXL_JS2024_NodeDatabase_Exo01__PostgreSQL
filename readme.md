# Exercice 01 - Utilisation de PostgreSQL en Node

## Énoncé
Dans un nouveau projet:  
- Mettre en place un fichier « model » qui permet de manipuler les données « Movie » dans une DB PostgreSQL à l'aide du package « pg ».
- Créer une base de donnée « ExoNode » dans PostgreSQL avec les tables nécessaires. 

\
Le fichier model doit avoir des méthodes pour : 
- Obtenir un film à l'aide du son identifiant.
- Obtenir la liste des films.
- Ajouter un nouveau film.
- Modifier un film.
- Supprimer un film.

Les genres des films doivent être stockage dans une table « Genre ». \
Ceux-ci doivent être ajouter en DB automatiquement lors de l'ajout d'un film.

## Format des données en base de donnée
- Movie
```
Id  (Entier - Auto-incrémenté)
Nom
Description (Optionnelle - Max 500 caractères)
Date de sortie
Durée
GenreId
Cotation (Optionnelle - Valeur entière de 0 à 10)

Date d'ajout (Données lier au stockage en DB)
Date de mise à jours
```
- Genre
```
Id (Entier - Auto-incrémenté)
Nom (Unique)
```