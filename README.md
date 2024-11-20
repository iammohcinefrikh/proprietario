

# 1. Présentation du projet

Ce projet porte sur le développement d'une application web de gestion immobilière, qui représente une solution pour répondre aux besoins des propriétaires immobiliers.

En offrant une plateforme intuitive, sécurisée et efficace, l'application aura pour but de révolutionner la manière dont la gestion immobilière est effectuée et optimisée.

# 2. Objectifs initiaux

-   **En tant que propriétaire**, je veux **ajouter, mettre à jour et gérer mes propriétés** afin de suivre mon portefeuille immobilier.
-   **En tant que propriétaire**, je veux **consulter et gérer mes locataires** afin de suivre qui occupe mes biens.
-   **En tant que propriétaire**, je veux **créer et gérer les baux** pour définir les termes de la location de mes biens.
-   **En tant que propriétaire**, je veux **suivre mes finances, y compris mes revenus et mes dépenses** afin de surveiller la rentabilité de mes propriétés.
-   **En tant que propriétaire**, je veux **recevoir, consulter et gérer les demandes des locataires** afin de traiter les questions de maintenance et autres problèmes soulevés par mes locataires.
-   **En tant que locataire**, je veux **accéder aux informations concernant mes biens loués** afin de rester informé sur ma situation de logement.
-   **En tant que locataire**, je veux **consulter les informations de mon propriétaire** afin de pouvoir le contacter facilement en cas de besoin.
-   **En tant que locataire**, je veux **voir les détails de mon bail** afin de comprendre les termes de mon contrat de location.
-   **En tant que locataire**, je veux **soumettre des demandes (par exemple, des demandes de maintenance ou de service)** afin de signaler directement les problèmes à mon propriétaire.

# 3. Les exigences Fonctionnelles

## 1. Front-End (Propriétaire) :

### 1.1. Tableau de bord :

-   **Vue d'ensemble des propriétés :** Affiche le nombre total de propriétés avec un aperçu rapide de leur statut d'occupation (vacant vs loué).
-   **Indicateurs clés :** Comprend le nombre de locataires, les dépenses du mois en cours, et les revenus encaissés pour le mois.
-   **Graphiques financiers :** Un graphique en barres mensuel affichant côte à côte les dépenses et les revenus, ainsi qu'un camembert montrant le statut d'occupation des propriétés.

### 1.2. Gestion des propriétés :

-   **Liste des propriétés :** Affiche un tableau des propriétés avec les informations clés et des options pour les gérer.
-   **Ajouter une propriété :** Permet l'ajout de nouvelles propriétés dans le système.

### 1.3. Gestion des locataires :

-   **Liste des locataires :** Affiche un tableau des locataires avec les détails pertinents et des options de gestion.
-   **Ajouter un locataire :** Permet d'ajouter de nouveaux locataires ou d'inviter des locataires à rejoindre l'application.

### 1.4. Gestion des baux :

-   **Liste des baux :** Affiche un tableau des baux avec les informations essentielles et des options pour gérer chaque bail.
-   **Ajouter un bail :** Permet la création de nouveaux baux dans le système.

### 1.5. Gestion des demandes des locataires :

-   **Liste des demandes :** Affiche un tableau des demandes des locataires avec des options pour visualiser et gérer chaque demande.

## 2. Front-End (Locataire) :

### 2.1. Page des propriétés :

-   **Consultation des propriétés :** Affichage des propriétés actuellement louées, avec un tableau présentant les informations relatives à chaque propriété.

### 2.2. Page des propriétaires :

-   **Consultation des propriétaires :** Affichage des propriétaires actifs avec un tableau répertoriant les locataires, incluant les informations pertinentes.

### 2.3. Page des baux :

-   **Consultation des baux :** Affichage des baux actifs avec un tableau contenant les informations liées à chaque bail.

### 2.4. Gestion des demandes :

-   **Ajout de demandes :** Permet de soumettre de nouvelles demandes.
-   **Consultation des demandes :** Affiche un tableau des demandes, avec les informations associées et des options pour les gérer.

## 3. Back-End:

### 2.1. RESTful API:

-   **Gestion des propriétés:** Endpoints pour créer, lire, mettre à jour et supprimer des propriétés.
-   **Gestion des locataires:** Endpoints pour gérer les informations des locataires et les communications.
-   **Gestion des paiements:** Endpoints pour les paiements de loyer, les reçus et les historiques de transactions.
-   **Rapports financiers:** Endpoints pour générer et exporter des rapports financiers.
-   **Maintenance et inspections:** Endpoints pour suivre et gérer les demandes de maintenance et les inspections de sécurité.

### 2.2. Sécurité:

-   **Authentification et autorisation:** Utilisation de JSON Web Tokens (JWT) pour sécuriser les endpoints sensibles.
-   **Validation des données:** Mise en place de validations pour assurer l'intégrité et la sécurité des données reçues.
-   **Chiffrement des données:** Utilisation de techniques de chiffrement pour sécuriser les données sensibles, comme les informations de paiement et les détails des locataires.

## 4. UX/UI Design:

-   **Design responsive:** Interface utilisateur adaptée aux différents types d'écrans (ordinateurs, tablettes, smartphones).
-   **Composants réutilisables:** Utilisation de composants réutilisables pour assurer la cohérence et faciliter la maintenance.
-   **Expérience utilisateur intuitive:** Interface simple et intuitive pour une navigation facile et une utilisation efficace.

# 4. **Les Exigences Techniques**

## **1. Technologies et architecture**

### 1.1 Front-End:

-   **Framework:** Next.JS
-   **Routing:** Next.JS App Router
-   **Communication avec le back-end:** Fetch API

### 1.2. Back-End:

-   **Framework:** Express.JS
-   **Base de données:** PostgreSQL
-   **ORM:** Prisma

# **5. Sécurité:**

-   **Authentification à l'aide de jetons JWT:** Implémentation de l'authentification par token pour sécuriser les endpoints.
-   **Cryptage des données:** Utilisation de crypto pour chiffrer les mots de passe des utilisateurs.
-   **Protection contre les attaques courantes:** Mise en place de protections contre les attaques XSS, CSRF, et les injections SQL.
