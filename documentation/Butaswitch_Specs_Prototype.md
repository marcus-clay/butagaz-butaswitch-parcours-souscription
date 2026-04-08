# Butaswitch — Spécifications prototype interactif

## 1. Contexte projet

### Le produit

Butaswitch est un tunnel de souscription en ligne pour Butagaz. Il digitalise la phase de découverte commerciale du gaz en citerne (GPL). Aujourd'hui, cette phase se fait intégralement par téléphone avec un commercial sédentaire appelé OBAM.

Le tunnel collecte les informations du prospect, récupère ses factures de gaz, et envoie un lead qualifié dans Salesforce. Un OBAM traite ensuite le lead et envoie un devis personnalisé par email sous 48 h ouvrées. Le prospect signe électroniquement via Docapost.

Il n'y a pas de prix affiché en temps réel dans le tunnel. Le devis est produit manuellement par l'OBAM après réception du lead.

### Le marché

Butagaz sera le premier acteur du marché GPL citerne en France à proposer un parcours digital structuré. Les concurrents directs (Primagaz, Antargaz) n'ont aucun tunnel de souscription en ligne. Ils proposent uniquement un formulaire de contact basique et un numéro de téléphone.

C'est un avantage concurrentiel réel, mais aussi un risque : les prospects GPL citerne ne sont pas habitués à ce type de parcours digital.

### La cible utilisateur

Le tunnel s'adresse uniquement au « cas de piquage » :
- Propriétaires de maisons individuelles
- Déjà en citerne de gaz chez un concurrent (Primagaz, Antargaz, Vitogaz)
- Souhaitant changer de fournisseur au profit de Butagaz

Sont exclus du parcours :
- Les locataires (le propriétaire décide du fournisseur)
- Les professionnels
- Les prospects souhaitant changer d'énergie (passer au gaz)
- Les nouveaux propriétaires d'une maison avec citerne (succession)
- Les clients Butagaz existants

### Le profil type des utilisateurs

Propriétaires de maisons individuelles, souvent en zone rurale ou périurbaine. Profil plutôt senior (50+). Autonomie digitale variable : certains sont à l'aise, d'autres très peu. Ils ne sont pas familiers avec les parcours de souscription en ligne (le marché GPL citerne n'en propose pas).

Conséquences sur le design :
- Langage courant, pas de jargon technique
- Expliquer pourquoi on demande chaque information
- Infobulles systématiques sur chaque champ non évident
- Taille de texte lisible, contraste élevé
- Bouton téléphone et « être rappelé » visible sur chaque écran
- Messages d'erreur bienveillants et orientés solution

### Données métier clés

| Donnée | Valeur |
|---|---|
| Volume de leads | 100 à 200 leads bruts/mois (domestiques), environ 2 000/an |
| Durée d'engagement | 5 ans environ |
| Modèle économique | Capex initial + prix euro-tonne sur la durée du contrat |
| Estimation par défaut (sans facture) | 700 kg/an (peu compétitif) |
| Citerne | Taille moyenne 1,2 tonne, remplie au max à 35 % |
| OBAM domestique | 2 commerciaux sédentaires : Sabrina et Éric |
| Délai devis | 48 h ouvrées après réception du lead |
| Signature | Électronique via Docapost |
| Chat | Pas de chat prévu dans le formulaire (chat existant uniquement pour les pros, via Crisp) |

### Ce que le prototype doit être

Un fichier HTML/CSS/JS unique (ou React JSX unique), navigable dans un navigateur, en noir et blanc (wireframe), mobile first (375 x 812 px). Il sert à démontrer et tester le parcours complet avant la phase de design UI.

### Ce que le prototype n'est pas

- Pas de design system Butagaz (pas encore reçu)
- Pas de couleurs de marque, pas de logo réel
- Pas de connexion back-end, pas d'envoi réel de données
- Pas de localStorage (tout en mémoire dans le state)

---

## 2. Architecture du parcours

### Flux principal

```
Page Butagaz.fr (lame d'entrée)
  ├── Appeler → numéro affiché (hors tunnel)
  ├── Être rappelé → formulaire simplifié (hors tunnel)
  └── Souscrire en ligne → TUNNEL
        │
        ├── Étape 1 : Qualification
        │     ├── « Changer de fournisseur » → Prérequis → Étape 2
        │     └── Autre choix → SORTIE 1 (non éligible)
        │
        ├── Étape 2 : Coordonnées + Statut
        │     ├── Propriétaire → Étape 3
        │     └── Locataire → SORTIE 2 (locataire)
        │
        ├── Étape 3 : Installation actuelle
        │     └── → Étape 4 (pas de filtre)
        │
        ├── Étape 4 : Factures + Biopropane
        │     ├── Factures uploadées → Étape 5
        │     └── Pas de facture → Parcours dégradé → Étape 5
        │
        ├── Étape 5 : Synthèse + Validation
        │     └── Valider → Lead Salesforce
        │
        └── Confirmation
              └── Étape bonus (facultative)
```

### Points de sortie

Il y a exactement 2 points de sortie dans le tunnel, plus 1 embranchement sans sortie.

**Sortie 1 (étape 1)** : le prospect choisit « maison avec citerne » (succession) ou « changer d'énergie ». Il sort du tunnel. On lui propose : appeler ou être rappelé.

**Sortie 2 (étape 2)** : le prospect est locataire. Il sort du tunnel. On lui propose : appeler, être rappelé, ou recevoir une documentation à transmettre à son propriétaire.

**Embranchement étape 4 (pas de sortie)** : le prospect n'a pas ses factures. Il ne sort pas. Il continue avec une estimation par défaut à 700 kg/an. On lui demande son fournisseur actuel. On prévoit une relance email à J+2.

### Éléments transversaux (présents sur chaque écran du tunnel)

- **Header** : « Butagaz » à gauche, « Retour au site » à droite
- **Retour étape** : lien « < Étape précédente » (absent à l'étape 1)
- **Barre de progression** : 5 cercles numérotés (1 à 5). L'étape en cours est noire. Les étapes passées sont gris foncé. Les étapes futures sont gris clair.
- **Bandeau footer** : fond gris clair, fixe en bas. Texte : « Besoin d'aide ? 01 XX XX XX XX ou demandez à être rappelé » (si numéro d'appel connu) OU « Besoin d'aide ? Un conseiller peut vous rappeler » (si numéro inconnu)
- **Validation inline** : chaque champ valide au blur (perte de focus). Message d'erreur en rouge sous le champ. Pas de validation en bloc.
- **Infobulles** : icône (i) à côté du label. Au clic, un bloc jaune pâle s'affiche sous le champ. Une seule infobulle ouverte à la fois.

---

## 3. Spécifications écran par écran

### WF0 : Lame d'entrée

**Contexte** : bloc injectable sur la page offre Butagaz.fr et sur les landing pages SEA. Ce n'est pas une page séparée, c'est une section de la page existante.

| Élément | Contenu |
|---|---|
| Titre | « Gaz en citerne » |
| Sous-titre | « Changez de fournisseur simplement » |
| Bloc 1 | « Appeler un conseiller » + « 01 XX XX XX XX, lun-ven 9h-18h » |
| Bloc 2 | « Être rappelé » + « Un conseiller vous contacte sous 24 h » |
| Bloc 3 (mis en avant) | « Souscrire en ligne » + « Devis personnalisé sous 48 h » |
| Footer | « Besoin d'aide ? 01 XX XX XX XX » |

Comportement :
- Bloc 1 → affiche le numéro (reste sur la page)
- Bloc 2 → ouvre une modale avec formulaire simplifié (nom, tél, email, envoyer)
- Bloc 3 → entre dans le tunnel (étape 1)

### WF1 : Qualification

| Élément | Contenu |
|---|---|
| Progression | (1) — 2 — 3 — 4 — 5 |
| Titre | « Quel est votre projet aujourd'hui ? » |
| Sous-titre | « Choisissez la situation qui vous correspond. » |
| Bloc 1 (mis en avant) | « Je souhaite changer de fournisseur de gaz en citerne » |
| Bloc 2 | « J'ai acheté une maison avec une citerne de gaz » |
| Bloc 3 | « Je souhaite passer au gaz en citerne » |
| Infobulle | « (i) Ce parcours est réservé aux propriétaires qui souhaitent changer de fournisseur de gaz en citerne. » |
| Footer | Bandeau téléphone |

Comportement :
- Bloc 1 → WF1bis (prérequis)
- Bloc 2 ou 3 → WF1-sortie

### WF1bis : Prérequis

Écran d'information uniquement. Aucune donnée collectée.

| Élément | Contenu |
|---|---|
| Progression | (1) — 2 — 3 — 4 — 5 |
| Titre | « Avant de commencer » |
| Bloc info (bleu) | « Pour vous proposer le meilleur tarif, nous aurons besoin de vos 2 à 3 dernières factures de gaz en citerne. Plus vous en fournissez, plus votre devis sera compétitif. » |
| Bloc aide (jaune) | « Où trouver vos factures ? Dans votre boîte aux lettres. Dans votre espace client en ligne (Primagaz, Antargaz, Vitogaz). Sur l'appli de votre fournisseur. » |
| Bloc sans facture (gris) | « Vous n'avez pas vos factures ? Pas d'inquiétude. Vous pourrez continuer sans, ou être rappelé. » |
| CTA | « C'est parti » → WF2 |
| Lien secondaire | « Préférer être accompagné ? Appelez-nous ou soyez rappelé » |

### WF1-sortie : Non éligible

| Élément | Contenu |
|---|---|
| Titre | « Nous ne pouvons pas traiter votre demande en ligne » |
| Paragraphe 1 | « Le parcours en ligne est conçu pour les propriétaires souhaitant changer de fournisseur de gaz en citerne. » |
| Paragraphe 2 | « Votre situation est différente, mais nos conseillers peuvent tout à fait vous accompagner. » |
| CTA principal | « Appeler le 01 XX XX XX XX — lun-ven 9h-18h » |
| CTA secondaire | « Demander à être rappelé » |
| Texte sous CTA | « Un conseiller vous recontactera sous 24 heures ouvrées. » |
| Lien | « Retour au site butagaz.fr » |

Ton : bienveillant. Pas de « vous n'êtes pas éligible ». On oriente, on ne ferme pas la porte.

### WF2 : Coordonnées + Statut

| Champ | Type | Obligatoire | Placeholder | Infobulle |
|---|---|---|---|---|
| Civilité | Radio (Madame / Monsieur) | Oui | — | — |
| Nom | Texte | Oui | — | — |
| Prénom | Texte | Oui | — | — |
| Adresse du logement | Texte (autocomplete) | Oui | « Commencez à taper votre adresse » | « (i) Tapez les premiers caractères. Des suggestions apparaîtront automatiquement. » |
| Téléphone | Texte (format contrôlé) | Oui | « 06 ou 07... » | « (i) Un conseiller vous appellera pour vous transmettre votre devis. Vous serez contacté depuis le 01 XX XX XX XX. » |
| Email | Texte (format contrôlé) | Oui | « votre@email.fr » | « (i) Votre devis sera envoyé à cette adresse. Aucun spam, promis. » |
| Propriétaire/locataire | Radio | Oui | — | « (i) Seul le propriétaire peut changer de fournisseur de gaz en citerne. » |
| Consentement RGPD | Checkbox | Oui | — | « (i) Vos données sont protégées. Butagaz ne revend jamais vos informations. Politique de confidentialité > » |

| Élément | Contenu |
|---|---|
| Progression | 1 — (2) — 3 — 4 — 5 |
| Titre | « Vos coordonnées » |
| Sous-titre | « Ces informations nous permettent de vous envoyer votre devis. » |
| Texte RGPD checkbox | « J'accepte que les informations saisies soient utilisées pour me recontacter par téléphone ou email. En savoir plus > » |
| CTA | « Continuer » → WF3 (si propriétaire) ou WF2-sortie (si locataire) |

Messages d'erreur :
- Nom vide : « Veuillez saisir votre nom. »
- Téléphone invalide : « Veuillez saisir un numéro de téléphone valide (10 chiffres). »
- Email invalide : « Veuillez saisir une adresse email valide. »
- RGPD non coché : « Veuillez accepter les conditions pour continuer. »

### WF2-sortie : Locataire

| Élément | Contenu |
|---|---|
| Titre | « Ce parcours est réservé aux propriétaires » |
| Paragraphe 1 | « En tant que locataire, c'est votre propriétaire qui décide du choix du fournisseur. C'est une contrainte réglementaire. » |
| Paragraphe 2 | « Ce que vous pouvez faire : Parlez-en à votre propriétaire. Nous pouvons lui envoyer une documentation par email. Si votre propriétaire est intéressé, il peut remplir ce formulaire lui-même. » |
| CTA principal | « Appeler un conseiller » |
| CTA secondaire | « Être rappelé » |
| Lien | « Retour au site butagaz.fr » |

### WF3 : Installation actuelle

| Champ | Type | Obligatoire | Infobulle |
|---|---|---|---|
| Citerne apparente/enfouie | 2 blocs visuels cliquables (avec emplacement pour une photo/illustration) | Oui | « (i) Apparente : vous la voyez dans votre jardin, posée au sol. Enfouie : enterrée sous terre. Seul un petit capot dépasse du sol. » |
| Conserver le même type | Radio (Oui / Non) | Oui | « (i) C'est votre préférence, pas un engagement. Un technicien vérifiera la faisabilité avant installation. Enfouir une citerne peut entraîner des frais précisés dans le devis. » |
| Même adresse que domicile | Checkbox | Non | — |
| Adresse de la citerne | Texte (conditionnel : visible si checkbox décochée) | Conditionnel | « (i) Résidence secondaire ? Indiquez l'adresse exacte de la citerne. » |

| Élément | Contenu |
|---|---|
| Progression | 1 — 2 — (3) — 4 — 5 |
| Titre | « Votre installation actuelle » |
| Question 1 | « Votre citerne est-elle visible dans votre jardin ? » |
| Question 2 | « Souhaitez-vous garder le même type de citerne ? » |
| CTA | « Continuer » → WF4 |

Pas de filtre à cette étape. Pas de sortie.

### WF4 : Factures + Biopropane (avec factures)

| Élément | Contenu |
|---|---|
| Progression | 1 — 2 — 3 — (4) — 5 |
| Titre | « Vos factures de gaz » |
| Bloc réassurance (bleu) | « Avec vos factures, nous estimons votre consommation réelle et vous proposons le tarif le plus adapté. Sans elles, le devis sera standard. » |
| Upload 1 | « Facture 1 (obligatoire) — Appuyez pour choisir un fichier ou prendre une photo — PDF, JPG ou PNG — 10 Mo max » |
| Upload 2 | « Facture 2 (obligatoire) — PDF, JPG ou PNG — 10 Mo max » |
| Upload 3 | « Facture 3 (recommandée) — 3 factures = estimation plus fiable » |
| Tuto facture (jaune) | « (i) Où trouver vos factures ? Chez vous : dans vos courriers. En ligne : espace client de votre fournisseur (Primagaz, Antargaz, Vitogaz) > rubrique « Mes factures ». » |
| Aide mobile (jaune) | « (i) Sur mobile ? Photographiez directement votre facture papier avec votre téléphone. » |
| Lien sans facture (ambre) | « Vous n'avez pas vos factures ? Continuez sans. Le devis sera basé sur une estimation à 700 kg/an (moins précis). On vous enverra un rappel pour les ajouter plus tard. » |
| Question biopropane | « Option biopropane » |
| Radio biopropane | Non merci / Oui, 20 % biopropane / Oui, 100 % biopropane |
| Infobulle biopropane | « (i) Le biopropane est produit à partir de matières renouvelables. Il coûte un peu plus cher que le propane classique. » |
| Bloc RGPD | « Protection de vos données — Vos factures servent uniquement à estimer votre consommation et à vous proposer un devis. Conservées le temps de l'étude. Vous pouvez demander leur suppression à tout moment. Politique de confidentialité > » |
| CTA | « Continuer » → WF5 |

États d'upload (4 états à implémenter) :
1. **Vide** : zone dashed, texte « Appuyez pour choisir un fichier ou prendre une photo »
2. **En cours** : nom du fichier + barre de progression (simuler 0 à 100 % en 2 secondes)
3. **Succès** : fond vert clair, nom du fichier + taille + boutons [Voir] [Remplacer] [Supprimer]
4. **Erreur** : fond rouge clair, « Ce fichier ne peut pas être envoyé. Seuls les PDF, JPG et PNG sont acceptés (10 Mo maximum). [Réessayer avec un autre fichier] »

### WF4-sans-facture : Parcours dégradé

S'affiche quand le prospect clique sur « Vous n'avez pas vos factures ? » dans WF4.

| Élément | Contenu |
|---|---|
| Progression | 1 — 2 — 3 — (4) — 5 |
| Titre | « Vos factures de gaz » |
| Bloc alerte (ambre) | « Sans facture, nous estimons votre consommation à 700 kg/an. Le devis sera moins précis et potentiellement moins compétitif. » |
| Question | « Aidez-nous à mieux estimer : » |
| Champ fournisseur | Pills cliquables : Antargaz / Primagaz / Vitogaz / Autre — Obligatoire |
| Bloc relance (gris) | « On vous enverra un rappel dans 2 jours pour ajouter vos factures et obtenir un meilleur tarif. » |
| Question biopropane | Même que WF4 |
| CTA principal (ambre) | « Continuer sans facture » → WF5 |
| CTA secondaire | « Revenir ajouter mes factures » → retour WF4 |

### WF5 : Synthèse + Validation

| Élément | Contenu |
|---|---|
| Progression | 1 — 2 — 3 — 4 — (5) |
| Titre | « Vérifiez vos informations » |
| Sous-titre | « Relisez bien avant d'envoyer. Vous pouvez modifier chaque section si besoin. » |
| Section 1 | « Coordonnées — Modifier > » + récap (civilité, nom, prénom, adresse, tél, email, statut) |
| Section 2 | « Installation — Modifier > » + récap (type citerne, conserver, adresse citerne) |
| Section 3 | « Factures — Modifier > » + récap (nombre de factures ou « estimation 700 kg », biopropane) |
| Bloc info (bleu) | « En validant, vous recevrez un devis personnalisé sous 48 h ouvrées. Aucun engagement à ce stade. » |
| CTA (vert, gros) | « Valider et envoyer ma demande » → WF6 |
| Footer | « Une question avant d'envoyer ? 01 XX XX XX XX » |

Comportement « Modifier » : renvoie à l'étape concernée. Après modification, retour automatique à WF5.

### WF6 : Confirmation

| Élément | Contenu |
|---|---|
| Icône | Cercle vert avec « OK » |
| Titre | « Votre demande est envoyée » |
| Référence | « Référence : BSWT-2026-0412 » (générer un identifiant fictif) |
| Bloc info (bleu) | « Votre devis personnalisé vous sera envoyé par email sous 48 h ouvrées. Aucun engagement de votre part. » |
| Bloc contact | Photo placeholder + « Sabrina et Éric — Vos contacts locaux — Appel depuis le 01 XX XX XX XX » |
| Infobulle contact | « (i) Si vous avez une question, vous pouvez les contacter directement. Ils connaissent déjà votre dossier. » |

### WF6-bonus : Enrichissement (facultatif)

Affiché sous la confirmation. Le lead est déjà dans Salesforce. Ces éléments enrichissent le dossier.

| Élément | Contenu |
|---|---|
| Titre | « Vous pouvez enrichir votre dossier (facultatif) » |
| Sous-titre | « Votre demande est déjà envoyée. Ces informations aident le conseiller à préparer un meilleur devis. » |
| Bloc 1 | « Ajouter des photos de la citerne » |
| Bloc 2 | « Certificat de conformité (si disponible) » |
| Bloc 3 | « Signaler des contraintes d'accès » |
| Infobulle | « (i) Pas obligatoire. Si vous ne le faites pas maintenant, le conseiller vous posera ces questions au téléphone. » |
| Lien | « Retour au site butagaz.fr » |

---

## 4. Les 4 archétypes de prospects

### Archétype A : Le calculateur

- **Profil** : propriétaire 5+ ans, citerne chez Primagaz/Antargaz, dernière facture trop élevée, a comparé sur Selectra/HelloWatt, arrive en sachant ce qu'il veut
- **Job-to-be-done** : « Quand je reçois ma facture et que le prix a encore augmenté, je veux obtenir rapidement un devis concurrent, pour décider en connaissance de cause si je change. »
- **Frustrations** : ne veut pas parler à un commercial avant d'avoir un chiffre, veut garder le contrôle, peur de s'engager sur un contrat pire
- **Friction dans le tunnel** : faible. Profil le plus susceptible de compléter le tunnel + le bonus
- **Risque d'abandon** : si le parcours ne donne aucune indication de prix ou d'économie potentielle

### Archétype B : Le frustré pressé

- **Profil** : en citerne chez un concurrent, problème récent (retard livraison, panne hiver, service client injoignable), déclencheur émotionnel, veut partir maintenant
- **Job-to-be-done** : « Quand mon fournisseur me laisse tomber en plein hiver, je veux lancer un changement immédiatement, pour ne plus dépendre d'une entreprise qui ne me respecte pas. »
- **Frustrations** : a déjà perdu trop de temps, peur que le changement soit compliqué, peur de se retrouver sans gaz
- **Friction dans le tunnel** : upload de factures (pas sous la main, mode impulsif), questions techniques
- **Risque d'abandon** : tout ce qui ressemble à de l'administratif
- **Information métier** : les clients surestiment leur consommation (disent « 1 tonne » quand c'est 600 kg). Citerne taille moyenne 1,2 tonne.

### Archétype C : Le prudent méfiant

- **Profil** : en citerne longue durée, contrat arrivant à échéance, explore sans être décidé, entre dans le tunnel par curiosité
- **Job-to-be-done** : « Quand mon contrat arrive à terme et que je me demande s'il y a mieux, je veux me renseigner sans m'engager, pour décider tranquillement. »
- **Frustrations** : ne veut pas être harcelé (téléphone), ne comprend pas les différences entre les offres, le changement lui semble lourd
- **Friction dans le tunnel** : coordonnées (surtout téléphone), consentement RGPD, upload de factures
- **Risque d'abandon** : étape 2 (téléphone) ou étape 4 (upload)
- **Information métier** : consulte les comparateurs (Selectra, HelloWatt)

### Archétype D : L'accompagné économique

- **Profil** : propriétaire âgé, zone rurale, citerne longue durée, pas à l'aise en digital, entre dans le tunnel parce qu'un enfant ou voisin lui a montré le site
- **Job-to-be-done** : « Quand mon fils me dit que je paie trop cher et me montre le site Butagaz, je veux demander à être recontacté simplement, pour qu'on m'explique. »
- **Frustrations** : ne comprend pas ce qu'on lui demande, n'a jamais changé de fournisseur, préférerait qu'on l'appelle
- **Friction dans le tunnel** : tout le tunnel est un point de friction
- **Risque d'abandon** : immédiat (étape 1 ou même la lame d'entrée)
- **Information métier** : le formulaire n'existe pas pour ce profil. La lame d'entrée avec « Être rappelé » est vitale.

---

## 5. Scénarios utilisateurs

Chaque scénario décrit un parcours complet avec les choix effectués et les données saisies.

### Scénario A : Le calculateur (parcours complet)

| Étape | Écran | Action | Données |
|---|---|---|---|
| 0 | Lame d'entrée | Clique « Souscrire en ligne » | — |
| 1 | WF1 | Sélectionne « Changer de fournisseur » | — |
| 1bis | WF1bis | Lit le message, clique « C'est parti » | — |
| 2 | WF2 | Remplit tous les champs | M. Jean Moreau, 15 rue des Chênes 44300 Nantes, 06 78 45 12 89, jean.moreau@orange.fr, Propriétaire, RGPD coché |
| 3 | WF3 | Sélectionne apparente, conserve, même adresse | Apparente, Oui, Même adresse |
| 4 | WF4 | Uploade 3 factures, sélectionne biopropane 20 % | facture_primagaz_jan.pdf, facture_primagaz_avr.pdf, facture_primagaz_juil.pdf, Biopropane 20 % |
| 5 | WF5 | Vérifie le récap, clique « Valider et envoyer » | — |
| 6 | WF6 | Voit la confirmation, explore le bonus, ajoute des photos | Réf. BSWT-2026-0412 |

### Scénario B : Le frustré pressé (sans facture)

| Étape | Écran | Action | Données |
|---|---|---|---|
| 0 | Lame d'entrée | Clique « Souscrire en ligne » | — |
| 1 | WF1 | Sélectionne « Changer de fournisseur » | — |
| 1bis | WF1bis | Lit rapidement, clique « C'est parti » | — |
| 2 | WF2 | Remplit tous les champs | Mme Sophie Duval, 8 chemin du Lavoir 35000 Rennes, 07 65 23 41 98, s.duval@gmail.com, Propriétaire, RGPD coché |
| 3 | WF3 | Sélectionne enfouie, conserve, même adresse | Enfouie, Oui, Même adresse |
| 4 | WF4 → WF4-sans-facture | Clique « Pas de facture », sélectionne Antargaz, biopropane Non | Antargaz, Non |
| 5 | WF5 | Vérifie (mention « estimation 700 kg »), valide | — |
| 6 | WF6 | Voit la confirmation + mention relance J+2 | — |

### Scénario C : Le prudent méfiant (hésite, sort par le footer)

| Étape | Écran | Action | Données |
|---|---|---|---|
| 0 | Lame d'entrée | Clique « Souscrire en ligne » | — |
| 1 | WF1 | Sélectionne « Changer de fournisseur » | — |
| 1bis | WF1bis | Lit attentivement, hésite, clique « C'est parti » | — |
| 2 | WF2 | Commence à remplir. Hésite sur le téléphone. Ouvre l'infobulle. Lit la réassurance. Ne veut pas continuer. | Mme Françoise Petit, 3 impasse des Vignes 86000 Poitiers |
| — | Footer | Clique « demandez à être rappelé » → modale | Nom, tél, email → envoi |

Le prospect sort du tunnel via le bandeau footer, pas par un écran de sortie. Il a saisi des données partielles.

### Scénario D : L'accompagné économique (sort immédiatement)

| Étape | Écran | Action | Données |
|---|---|---|---|
| 0 | Lame d'entrée | Clique « Être rappelé » | — |
| — | Modale formulaire simplifié | Remplit nom, tél | M. Marcel Lefèvre, 05 53 12 34 56 |

Le prospect n'entre jamais dans le tunnel. Il utilise le canal existant dès la lame d'entrée.

### Scénario E : Non éligible (succession)

| Étape | Écran | Action | Données |
|---|---|---|---|
| 0 | Lame d'entrée | Clique « Souscrire en ligne » | — |
| 1 | WF1 | Sélectionne « J'ai acheté une maison avec une citerne » | — |
| — | WF1-sortie | Voit le message non éligible, clique « Être rappelé » | — |

### Scénario F : Locataire

| Étape | Écran | Action | Données |
|---|---|---|---|
| 0 | Lame d'entrée | Clique « Souscrire en ligne » | — |
| 1 | WF1 | Sélectionne « Changer de fournisseur » | — |
| 1bis | WF1bis | Clique « C'est parti » | — |
| 2 | WF2 | Remplit les champs, sélectionne « Locataire » | Mme Claire Martin, locataire |
| — | WF2-sortie | Voit le message, clique « Appeler un conseiller » | — |

---

## 6. Données de test par scénario

| Archétype | Civilité | Nom | Adresse | Tél | Email | Statut | Citerne | Conserver | Fournisseur | Factures | Biopropane |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A. Calculateur | M. | Jean Moreau | 15 rue des Chênes, 44300 Nantes | 06 78 45 12 89 | jean.moreau@orange.fr | Propriétaire | Apparente | Oui | Primagaz | 3 (upload) | 20 % |
| B. Frustré pressé | Mme | Sophie Duval | 8 chemin du Lavoir, 35000 Rennes | 07 65 23 41 98 | s.duval@gmail.com | Propriétaire | Enfouie | Oui | Antargaz | 0 (sans facture) | Non |
| C. Prudent méfiant | Mme | Françoise Petit | 3 impasse des Vignes, 86000 Poitiers | — (hésite) | — | — | — | — | — | — | — |
| D. Accompagné | M. | Marcel Lefèvre | 2 route de l'Église, 24100 Bergerac | 05 53 12 34 56 | — | — | — | — | — | — | — |
| E. Non éligible | — | — | — | — | — | — | — | — | — | — | — |
| F. Locataire | Mme | Claire Martin | 7 allée des Tilleuls, 33000 Bordeaux | 06 45 67 89 01 | c.martin@gmail.com | Locataire | — | — | — | — | — |

---

## 7. Composants UI du prototype (wireframe noir et blanc)

### Cadre global

- Frame mobile : 375 x 812 px
- Fond : blanc (#FFFFFF)
- Typographie : system font stack (-apple-system, BlinkMacSystemFont, « Segoe UI », sans-serif)
- Couleur texte principal : noir (#1A1A1A)
- Couleur texte secondaire : gris (#666666)
- Couleur texte tertiaire / placeholder : gris clair (#999999)

### Champs de formulaire

- Border : 1px solid #D0D0D0
- Border-radius : 8px
- Hauteur : 40px
- Padding interne : 0 12px
- Label : au-dessus du champ, font-size 13px, color #666
- État focus : border 2px solid #1A1A1A
- État erreur : border 2px solid #CC0000 + message sous le champ en #CC0000 font-size 12px

### Boutons

- Primaire : fond #1A1A1A, texte blanc, border-radius 10px, padding 14px, font-size 15px, font-weight 600
- Secondaire : fond transparent, border 1px solid #D0D0D0, texte #666, border-radius 10px
- Ambre (sans facture) : fond #F5C518, texte #1A1A1A

### Blocs cliquables (qualification, citerne)

- Border : 1px solid #E0E0E0, border-radius 10px, padding 16px
- Hover : border-color #999
- Sélectionné : border 2px solid #1A1A1A, fond #F5F5F5
- Titre : font-size 15px, font-weight 500
- Sous-titre : font-size 13px, color #666

### Infobulles

- Fond : #FFF9E6
- Border : 1px solid #E6D490
- Border-radius : 8px
- Padding : 10px
- Font-size : 13px
- Déclenchement : clic sur l'icône (i) à côté du label
- Comportement : toggle (clic ouvre, re-clic ferme), une seule ouverte à la fois

### Messages de réassurance

- Fond : #EFF6FF (bleu pâle)
- Border-radius : 8px
- Padding : 12px
- Font-size : 13px
- Color : #1A4D8C

### Messages d'erreur

- Texte : #CC0000
- Font-size : 12px
- Position : sous le champ en erreur
- Le champ en erreur a aussi sa border en #CC0000

### Messages d'alerte (sans facture)

- Fond : #FFF8E1 (ambre pâle)
- Border : 1px solid #F5C518
- Border-radius : 8px
- Padding : 12px

### Barre de progression

- 5 cercles de 28px, numérotés 1 à 5
- Trait de liaison : 2px solid
- Étape active : fond #1A1A1A, texte blanc
- Étapes passées : fond #666, texte blanc
- Étapes futures : fond #E0E0E0, texte #999
- Les étapes passées sont cliquables (retour possible)
- Les étapes futures ne sont pas cliquables

### Zone d'upload

- Zone dashed : border 2px dashed #D0D0D0, border-radius 10px, padding 20px, text-align center
- État en cours : fond #F5F5F5, barre de progression (div noire croissante)
- État succès : fond #F0FFF0, border solid #22C55E
- État erreur : fond #FFF0F0, border solid #CC0000

### Bandeau footer

- Position : fixe en bas de l'écran
- Fond : #F5F5F5
- Padding : 10px 16px
- Font-size : 13px
- Le numéro de téléphone est cliquable (tel: sur mobile)

### Modale « Être rappelé »

- Overlay : rgba(0,0,0,0.4)
- Modale : fond blanc, border-radius 16px, padding 24px, max-width 340px, centrée
- Champs : Nom, Téléphone, Email
- CTA : « Envoyer ma demande de rappel »
- Bouton fermer : croix en haut à droite

---

## 8. Tableau de référence des messages

### Titres et sous-titres

| Écran | Titre | Sous-titre |
|---|---|---|
| Lame d'entrée | Gaz en citerne | Changez de fournisseur simplement |
| WF1 | Quel est votre projet aujourd'hui ? | Choisissez la situation qui vous correspond. |
| WF1bis | Avant de commencer | (pas de sous-titre) |
| WF2 | Vos coordonnées | Ces informations nous permettent de vous envoyer votre devis. |
| WF3 | Votre installation actuelle | (pas de sous-titre) |
| WF4 | Vos factures de gaz | (pas de sous-titre) |
| WF4-sans-facture | Vos factures de gaz | (pas de sous-titre) |
| WF5 | Vérifiez vos informations | Relisez bien avant d'envoyer. Vous pouvez modifier chaque section. |
| WF6 | Votre demande est envoyée | Référence : BSWT-2026-XXXX |
| Sortie non éligible | Nous ne pouvons pas traiter votre demande en ligne | (pas de sous-titre) |
| Sortie locataire | Ce parcours est réservé aux propriétaires | (pas de sous-titre) |

### Textes des infobulles (14 au total)

| Écran | Champ | Texte infobulle |
|---|---|---|
| WF1 | Général | Ce parcours est réservé aux propriétaires qui souhaitent changer de fournisseur de gaz en citerne. |
| WF1bis | Où trouver | Dans votre boîte aux lettres. Dans votre espace client en ligne (Primagaz, Antargaz, Vitogaz). Sur l'appli de votre fournisseur. |
| WF2 | Adresse | Tapez les premiers caractères. Des suggestions apparaîtront automatiquement. |
| WF2 | Téléphone | Un conseiller vous appellera pour vous transmettre votre devis. Vous serez contacté depuis le 01 XX XX XX XX. |
| WF2 | Email | Votre devis sera envoyé à cette adresse. Aucun spam, promis. |
| WF2 | Propriétaire | Seul le propriétaire peut changer de fournisseur de gaz en citerne. |
| WF2 | RGPD | Vos données sont protégées. Butagaz ne revend jamais vos informations. |
| WF3 | Citerne | Apparente : vous la voyez dans votre jardin, posée au sol. Enfouie : enterrée sous terre. Seul un petit capot dépasse. |
| WF3 | Conserver type | C'est votre préférence, pas un engagement. Un technicien vérifiera la faisabilité. Enfouir peut entraîner des frais précisés dans le devis. |
| WF3 | Adresse citerne | Résidence secondaire ? Indiquez l'adresse exacte de la citerne. |
| WF4 | Tuto facture | Chez vous : dans vos courriers. En ligne : espace client (Primagaz, Antargaz, Vitogaz) > « Mes factures ». |
| WF4 | Mobile | Photographiez directement votre facture papier avec votre téléphone. |
| WF4 | Biopropane | Le biopropane est produit à partir de matières renouvelables. Il coûte un peu plus cher. |
| WF6 | Contact | Si vous avez une question, contactez-les directement. Ils connaissent déjà votre dossier. |

### Messages d'erreur par champ

| Champ | Condition | Message |
|---|---|---|
| Nom | Vide | Veuillez saisir votre nom. |
| Prénom | Vide | Veuillez saisir votre prénom. |
| Adresse | Vide | Veuillez saisir votre adresse. |
| Téléphone | Vide | Veuillez saisir votre numéro de téléphone. |
| Téléphone | Format invalide | Veuillez saisir un numéro valide (10 chiffres, commençant par 0). |
| Email | Vide | Veuillez saisir votre adresse email. |
| Email | Format invalide | Veuillez saisir une adresse email valide (ex. : nom@exemple.fr). |
| RGPD | Non coché | Veuillez accepter les conditions pour continuer. |
| Citerne | Non sélectionné | Veuillez indiquer si votre citerne est apparente ou enfouie. |
| Conserver type | Non sélectionné | Veuillez indiquer si vous souhaitez garder le même type. |
| Fournisseur (sans facture) | Non sélectionné | Veuillez indiquer votre fournisseur actuel. |
| Upload | Fichier trop gros | Ce fichier dépasse la taille maximum de 10 Mo. |
| Upload | Mauvais format | Seuls les fichiers PDF, JPG et PNG sont acceptés. |

### Texte RGPD

**Version courte (checkbox étape 2)** : « J'accepte que les informations saisies soient utilisées pour me recontacter par téléphone ou email. »

**Version longue (bloc étape 4)** : « Vos factures servent uniquement à estimer votre consommation et à vous proposer un devis. Conservées le temps de l'étude. Vous pouvez demander leur suppression à tout moment. Politique de confidentialité > »

### Messages de confirmation

- **Après validation** : « Votre devis personnalisé vous sera envoyé par email sous 48 h ouvrées. Aucun engagement de votre part. »
- **Contact local** : « Sabrina et Éric — Vos contacts locaux — Appel depuis le 01 XX XX XX XX »
- **Bonus** : « Votre demande est déjà envoyée. Ces informations aident le conseiller à préparer un meilleur devis. »
- **Si bonus non rempli** : « Pas obligatoire. Si vous ne le faites pas maintenant, le conseiller vous posera ces questions au téléphone. »

---

## 9. Interactions et transitions

### Navigation entre écrans

- Transition : slide horizontal (gauche → droite pour avancer, droite → gauche pour reculer)
- Durée : 250 ms, ease-out
- Le contenu du nouvel écran scroll automatiquement en haut

### Barre de progression

- Cliquable pour revenir aux étapes précédentes (pas pour avancer)
- Au clic sur une étape passée : navigation directe vers cette étape
- Les données saisies sont préservées en mémoire

### Validation des champs

- Déclenchement : au blur (quand le champ perd le focus)
- Message d'erreur : apparaît sous le champ avec une animation fade-in (150 ms)
- Le champ en erreur passe en border rouge
- Au re-focus, le message d'erreur reste visible jusqu'à correction
- Le bouton « Continuer » est toujours cliquable (pas de grisage). Si des erreurs existent, elles s'affichent au clic sur « Continuer » pour les champs non encore visités.

### Upload de factures

- Simulation : clic ouvre un sélecteur de fichier natif (input type="file")
- Pour le prototype : accepter n'importe quel fichier, simuler l'upload avec une barre de progression (0 à 100 % en 2 secondes)
- Utiliser des noms de fichiers réalistes pour le scénario actif (ex. : « facture_primagaz_jan2025.pdf »)
- Le bouton [Supprimer] ramène à l'état vide
- Le bouton [Remplacer] rouvre le sélecteur

### Infobulles

- Toggle au clic sur l'icône (i)
- Animation : slide-down + fade-in (150 ms)
- Une seule infobulle ouverte à la fois (ouvrir une nouvelle ferme l'ancienne)
- L'infobulle se ferme aussi au clic en dehors

### Lien « Modifier » (synthèse)

- Ramène à l'étape concernée
- Les champs sont pré-remplis avec les données saisies
- Après modification et clic sur « Continuer », retour automatique à WF5 (pas de re-parcours des étapes intermédiaires)

### Modale « Être rappelé »

- Ouvre au clic sur « être rappelé » dans le bandeau footer ou les écrans de sortie
- Champs : Nom (si pas déjà saisi), Téléphone, Email (optionnel)
- CTA : « Envoyer ma demande de rappel »
- Après envoi : la modale affiche « Demande envoyée. Un conseiller vous contactera sous 24 h. » pendant 2 secondes, puis se ferme.

### Écrans de sortie

- Pas de retour possible vers le tunnel (pas de bouton « retour au tunnel »)
- Le lien « Retour au site butagaz.fr » ramène à la lame d'entrée

---

## 10. Modes de visualisation

Le prototype offre deux modes d'affichage, accessibles à tout moment.

### Mode 1 : Vue panorama

Tous les écrans du scénario sélectionné sont affichés côte à côte en miniature, de gauche à droite, dans une bande horizontale scrollable.

**Structure de l'écran** :
- **En haut** : barre de sélection du scénario (onglets : A. Calculateur, B. Frustré pressé, C. Prudent méfiant, D. Accompagné, E. Non éligible, F. Locataire)
- **Sous la barre** : une ligne de texte résumant le scénario (ex. : « Scénario A : Le calculateur — Parcours complet, fluide, 3 factures, biopropane 20 %, bonus »)
- **Zone principale** : les écrans mobiles miniaturisés (environ 140 x 250 px chacun), côte à côte, reliés par des flèches

**Chaque miniature affiche** :
- Le nom de l'étape en haut (« Lame d'entrée », « Étape 1 : Qualification », etc.)
- Un résumé des données saisies ou du choix effectué à cette étape
- Un badge de statut : vert (passage OK), ambre (embranchement/parcours dégradé), rouge (sortie du tunnel)
- Les miniatures sont cliquables : cliquer sur une miniature bascule en mode 2 (navigation) sur cet écran

**Affichage multi-scénarios** : quand aucun scénario n'est sélectionné (onglet « Tous »), les scénarios sont empilés verticalement, un par ligne. Permet de comparer visuellement les parcours (ex. : voir que le scénario A a 9 écrans, le scénario D en a 2).

### Mode 2 : Navigation interactive

Un seul écran affiché en grand au centre, dans un cadre mobile (375 x 812 px). L'utilisateur parcourt le scénario étape par étape, avec des interactions fonctionnelles.

**Structure de l'écran** :
- **Barre supérieure** : nom du scénario + étape en cours + bouton « Vue panorama » pour revenir au mode 1
- **Mini-barre de progression** : sous la barre, une ligne de pills représentant toutes les étapes du scénario. L'étape active est noire. Les étapes déjà parcourues sont gris foncé (cliquables). Les étapes à venir sont gris clair (non cliquables).
- **Zone centrale** : l'écran mobile en grand (375 x 812 px), interactif
- **Panneau gauche (masquable)** : « Annotations UX » — explique les choix de design pour cet écran (pourquoi ce champ est à cet endroit, quelle décision d'atelier le justifie, quel archétype est impacté)
- **Panneau droit (masquable)** : « Contexte du scénario » — rappelle le profil de l'archétype, les données pré-remplies, le niveau de friction à cette étape
- **Sous l'écran** : boutons « < Étape précédente » et « Étape suivante > » + nom de l'étape correspondante

**Panneau gauche — annotations UX** (exemples de contenu par écran) :
- WF2 : « Le téléphone est obligatoire. Décision atelier 24/03 : l'OBAM doit rappeler le client. Réassurance ajoutée : numéro d'appel sortant affiché. »
- WF4 : « Fournisseur demandé uniquement si pas de facture. Décision atelier 24/03. Message volontairement transparent sur l'impact (« moins compétitif »). »
- WF4 : « Bouton ambre = action dégradée (pas primaire). Le CTA secondaire « Revenir ajouter mes factures » est positionné en dessous pour encourager l'upload. »

**Panneau droit — contexte du scénario** (exemple pour scénario B, étape 4) :
```
Archétype : Le frustré pressé
Sophie Duval, 35 ans, Rennes
Citerne enfouie chez Antargaz
Problème récent : panne hiver

Pas de facture sous la main.
Continue avec estimation 700 kg.
Relance J+2 prévue.

Friction à cette étape : ÉLEVÉE
C'est l'étape de décrochage
identifiée pour ce profil.
```

**Bouton toggle panneaux** : un bouton « Masquer les annotations » en haut permet de cacher les deux panneaux latéraux pour montrer l'écran seul (mode « démo client »). Un second clic les remontre.

### Bascule entre les modes

- **Panorama → Navigation** : cliquer sur une miniature d'écran. L'écran s'agrandit au centre avec une transition zoom.
- **Navigation → Panorama** : cliquer sur le bouton « Vue panorama » dans la barre supérieure.
- **Changement de scénario** : en mode panorama, cliquer sur un onglet. En mode navigation, un sélecteur dans la barre supérieure permet de changer de scénario (les données et choix changent, l'écran actif reste le même si l'étape existe dans le nouveau scénario).

### Mode libre

En plus des 6 scénarios pré-définis, un onglet « Mode libre » permet de parcourir le tunnel sans données pré-remplies. L'utilisateur remplit librement les champs et fait ses propres choix. Le mode panorama n'est pas disponible en mode libre (pas de parcours prédéfini à afficher).

---

## 11. Contraintes techniques pour Claude Code

- **Fichier unique** : un seul fichier JSX (React) avec tout le state, les composants et le CSS inline ou dans un bloc style
- **Mobile first** : 375 px natif. Lisible jusqu'à 768 px. Au-delà, centrer le frame mobile sur fond gris.
- **Pas de framework CSS externe** : pas de Tailwind, pas de Bootstrap. CSS custom pour garder le contrôle wireframe noir et blanc.
- **Pas d'appel réseau** : tout est en mémoire dans le state React (useState, useReducer)
- **Pas de localStorage** : les données ne persistent pas entre les sessions
- **Librairies autorisées** : React (import { useState, useReducer, useEffect } from "react"), lucide-react pour les icônes
- **Upload simulé** : utiliser un input type="file" natif. Au lieu d'envoyer le fichier, lire le nom et la taille, puis simuler une barre de progression avec un setTimeout de 2 secondes.
- **Identifiants de référence** : générer un ID fictif « BSWT-2026-XXXX » (4 chiffres aléatoires) à la validation
- **Numéro de téléphone** : utiliser « 01 XX XX XX XX » comme placeholder partout. Le numéro réel sera fourni plus tard.
