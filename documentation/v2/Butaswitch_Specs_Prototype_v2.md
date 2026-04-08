# Butaswitch — Spécifications prototype interactif v2
# Mise à jour : 8 avril 2026 — Intègre toutes les décisions de la revue FigJam (commentaires Pierre-Louis du Chazaud, Élodie Jolly, Simon White)

## 1. Contexte projet

### Le produit

Butaswitch est un tunnel de souscription en ligne pour Butagaz. Il digitalise la phase de découverte commerciale du gaz en citerne (GPL). Aujourd'hui, cette phase se fait intégralement par téléphone avec un commercial sédentaire appelé OBAM.

Le tunnel collecte les informations du prospect, récupère ses factures de gaz, et envoie un lead qualifié dans Salesforce. Un OBAM traite ensuite le lead et envoie une proposition de contrat personnalisée par email sous 48 h ouvrées. Le prospect signe électroniquement via Docapost.

Il n'y a pas de prix affiché en temps réel dans le tunnel. Le contrat est produit manuellement par l'OBAM après réception du lead.

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

Propriétaires de maisons individuelles, souvent en zone rurale ou périurbaine. Profil plutôt senior (50+). Autonomie digitale variable : certains sont à l'aise, d'autres très peu. Ils ne sont pas familiers avec les parcours de souscription en ligne.

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
| 3 factures obligatoires | Hard block — sans les 3 factures, le prospect est orienté vers un rappel |
| Citerne | Taille moyenne 1,2 tonne, remplie au max à 35 % |
| OBAM domestique | 2 commerciaux sédentaires : Sabrina et Éric |
| Délai contrat | 48 h ouvrées après réception du lead |
| Signature | Électronique via Docapost |
| Chat | Pas de chat prévu dans le formulaire |

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
  ├── Être rappelé → formulaire simplifié étape 2 → confirmation étape 3 (hors tunnel)
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
        │     ├── 3 factures uploadées → Étape 5
        │     └── Pas de facture → SORTIE 3 (formulaire pré-rempli + lien retour)
        │
        └── Étape 5 : Synthèse + Validation
              └── Valider → Confirmation
```

### Points de sortie

Il y a exactement 3 points de sortie dans le tunnel.

**Sortie 1 (étape 1)** : le prospect choisit « maison avec citerne » (succession) ou « changer d'énergie ». Il sort du tunnel. On lui propose : appeler, être rappelé via un formulaire inline pré-rempli avec ses informations déjà saisies.

**Sortie 2 (étape 2)** : le prospect est locataire. Il sort du tunnel. On lui propose : appeler, être rappelé, ou recevoir une documentation à transmettre à son propriétaire.

**Sortie 3 (étape 4)** : le prospect n'a pas ses 3 factures. Il sort vers un écran dédié avec formulaire de rappel pré-rempli et un lien pour revenir à l'étape 4 quand il aura ses factures. Il n'y a pas de parcours dégradé sans facture.

### Éléments transversaux (présents sur chaque écran du tunnel)

- **Header** : « Butagaz » à gauche, « Retour au site » à droite
- **Navigation retour** : lien « ← Précédent » (absent à l'étape 1). Libellé : « Précédent » (pas « Étape précédente », pas « Retour au site »)
- **Barre de progression** : 5 cercles numérotés (1 à 5). L'étape en cours est noire. Les étapes passées sont gris foncé (cliquables). Les étapes futures sont gris clair (non cliquables).
- **Bandeau footer** : fond gris clair, fixe en bas. Texte : « Besoin d'aide ? 01 XX XX XX XX ou demandez à être rappelé »
- **Validation inline** : chaque champ valide au blur (perte de focus). Message d'erreur en rouge sous le champ. Pas de validation en bloc.
- **Infobulles** : icône (i) à côté du label. Au clic, un bloc jaune pâle s'affiche sous le champ. Une seule infobulle ouverte à la fois.

---

## 3. Spécifications écran par écran

### WF0 : Lame d'entrée

**Contexte** : bloc injectable sur la page offre Butagaz.fr et sur les landing pages SEA. Ce n'est pas une page séparée, c'est une section de la page existante.

Il existe deux états de la lame : SANS OFFRE (état par défaut) et AVEC OFFRE (activable en back office).

**WF0 SANS OFFRE** :

| Élément | Contenu |
|---|---|
| Titre | « Gaz en citerne » |
| Sous-titre | « Changez de fournisseur simplement » |
| Bloc 1 | « Appeler un conseiller » + « 01 XX XX XX XX, lun-ven 9h-18h » |
| Bloc 2 | « Être rappelé » + « Un conseiller vous contacte sous 24 h » |
| Bloc 3 (mis en avant) | « Souscrire en ligne » + « Devis personnalisé sous 48 h » |
| Footer | « Besoin d'aide ? 01 XX XX XX XX » |

**WF0 AVEC OFFRE** (toggle CMS activé) :

| Élément | Contenu |
|---|---|
| Titre | « Gaz en citerne » |
| Sous-titre | « Changez de fournisseur simplement » |
| Bloc offre (vert) | « Jusqu'à 200 € d'avoir gaz offerts sur votre première commande* » |
| Bloc 1 (mis en avant, en premier) | « Souscrire en ligne » + « Devis personnalisé sous 48 h » |
| Bloc 2 | « Appeler un conseiller » + « 01 XX XX XX XX, lun-ven 9h-18h » |
| Bloc 3 | « Être rappelé » + « Un conseiller vous contacte sous 24 h » |
| Mention légale | « *Offre réservée aux clients souscrivant à une citerne apparente. Le montant de l'avoir sera déterminé en fonction de la consommation annuelle estimée. » |
| Footer | « Besoin d'aide ? 01 XX XX XX XX » |

Comportements communs aux deux états :
- Bloc « Appeler » → affiche le numéro (reste sur la page)
- Bloc « Être rappelé » → ouvre le flow en 2 étapes (WF0-step2 puis WF0-step3)
- Bloc « Souscrire en ligne » → entre dans le tunnel (étape 1)

**WF0-step2 : Formulaire de rappel** (hors tunnel, accessible via « Être rappelé »)

| Élément | Contenu |
|---|---|
| Navigation | « ← Retour » |
| Titre | « Vos coordonnées » |
| Champ 1 | Prénom* |
| Champ 2 | Nom* |
| Champ 3 | Numéro de téléphone* |
| Champ 4 | Email* |
| Champ 5 | Message (facultatif) |
| Checkbox RGPD | « J'accepte que les informations saisies soient utilisées dans le cadre de la relation commerciale avec Butagaz, pour me recontacter. » |
| CTA | « Envoyer ma demande » → WF0-step3 |

**WF0-step3 : Confirmation de rappel** (hors tunnel)

| Élément | Contenu |
|---|---|
| Titre | « Votre demande est bien reçue » |
| Bloc info (bleu) | « Un conseiller vous contactera sous 24 h. Rappel entre 9h et 17h, du lundi au vendredi. » |
| CTA | « Retour au site butagaz.fr » |

### WF1 : Qualification

| Élément | Contenu |
|---|---|
| Progression | **(1)** — 2 — 3 — 4 — 5 |
| Titre | « Quel est votre projet aujourd'hui ? » |
| Sous-titre | « Choisissez la situation qui vous correspond. » |
| Bloc 1 (mis en avant) | « Je souhaite changer de fournisseur de gaz en citerne » |
| Bloc 2 | « J'ai acheté une maison avec une citerne de gaz » |
| Bloc 3 | « Je souhaite passer au gaz en citerne » |
| Footer | Bandeau téléphone |

Comportement :
- Bloc 1 → sélectionné : affiche un bandeau info jaune IMMÉDIATEMENT SOUS le bloc sélectionné (pas en position fixe, pas au bas de l'écran). Texte : « ⓘ Ce parcours est réservé aux propriétaires qui souhaitent changer de fournisseur de gaz en citerne. » Puis → WF1bis (prérequis) au clic « Continuer »
- Bloc 2 ou 3 → WF1-sortie

Le bandeau info jaune est conditionnel : il n'apparaît que si Bloc 1 est sélectionné. Il n'est pas visible à l'état initial.

### WF1bis : Prérequis

Écran d'information uniquement. Aucune donnée collectée.

| Élément | Contenu |
|---|---|
| Progression | (1) — 2 — 3 — 4 — 5 |
| Titre | « Avant de commencer » |
| Mention propriétaires | « Parcours réservé aux propriétaires d'un logement avec citerne de gaz. » |
| Bloc info (bleu) | « Pour vous proposer le meilleur tarif, nous aurons besoin de vos 3 dernières factures de gaz en citerne. Elles nous permettent d'estimer votre consommation réelle et de vous proposer un tarif compétitif. » |
| Bloc aide (jaune) | « Où trouver vos factures ? Dans votre boîte aux lettres. Dans votre espace client en ligne (Primagaz, Antargaz, Vitogaz). Sur l'appli de votre fournisseur. » |
| Bloc sans facture (gris) | « Vous n'avez pas vos 3 factures ? Vous pouvez appeler un conseiller ou demander à être rappelé. » |
| CTA | « C'est parti » → WF2 |
| Lien secondaire | « Vous préférez être accompagné ? Appelez-nous ou soyez rappelé » |

### WF1-sortie : Non éligible

| Élément | Contenu |
|---|---|
| Titre | « Ce parcours ne correspond pas à votre situation » |
| Paragraphe 1 | « Le parcours en ligne est conçu pour les propriétaires souhaitant changer de fournisseur de gaz en citerne. » |
| Paragraphe 2 | « Votre situation est différente, mais nos conseillers peuvent tout à fait vous accompagner. » |
| CTA 1 (gris) | « Appeler le 01 XX XX XX XX — lun-ven 9h-18h » |
| Section rappel (déployée) | « Demander à être rappelé » — section ouverte affichant : |
| Sous-titre section | « Un conseiller vous recontactera sous 24 h. » |
| Récapitulatif pré-rempli | Bloc récap avec les informations saisies jusqu'ici (Civilité, Nom, Prénom, Téléphone si disponibles). Mock : « Mme Marie Dupont — 06 12 34 56 78 — marie.dupont@email.fr » + bouton « Modifier » |
| Checkbox RGPD | « J'accepte que les informations saisies soient utilisées dans le cadre de la relation commerciale avec Butagaz, pour me recontacter. » |
| CTA | « Confirmer et Envoyer » (noir) |
| Lien | « Retour au site butagaz.fr » |

Ton : bienveillant. Jamais « vous n'êtes pas éligible ». On oriente, on ne ferme pas la porte.

### WF2 : Coordonnées + Statut

| Champ | Type | Obligatoire | Placeholder | Infobulle |
|---|---|---|---|---|
| Prénom | Texte | Oui | — | — |
| Nom | Texte | Oui | — | — |
| Adresse du logement | Texte | Oui | « Commencez à taper votre adresse » | Aucune (infobull autocomplete supprimée) |
| Téléphone | Texte (format contrôlé) | Oui | « 06 ou 07... » | « ⓘ Un conseiller vous appellera pour vous transmettre votre proposition de contrat. Vous serez contacté depuis le 01 XX XX XX XX. » |
| Email | Texte (format contrôlé) | Oui | « votre@email.fr » | « ⓘ Votre proposition de contrat sera envoyée à cette adresse. Aucun spam, promis. » |
| Citerne = domicile | Checkbox | Non | « La citerne est à la même adresse que mon domicile » | — |
| Adresse de la citerne | Texte (conditionnel) | Conditionnel | « Adresse de la citerne » | « ⓘ Résidence secondaire ? Indiquez l'adresse exacte de la citerne. » |
| Propriétaire/locataire | Radio | Oui | — | « ⓘ Seul le propriétaire peut changer de fournisseur de gaz en citerne. » |
| Préférence d'appel | Radio (facultatif) | Non | — | « ⓘ Rappel entre 9h et 17h, du lundi au vendredi. » |
| Consentement RGPD | Checkbox | Oui | — | — |

Notes importantes :
- L'ordre des champs est : Prénom d'abord, puis Nom.
- « La citerne est à la même adresse que mon domicile » est cochée par défaut. Si décochée, un champ « Adresse de la citerne » apparaît.
- La préférence d'appel propose 3 options radio : Matin / Après-midi / Indifférent.
- Navigation : « ← Précédent » (pas « Retour au site »).

| Élément | Contenu |
|---|---|
| Progression | 1 — **(2)** — 3 — 4 — 5 |
| Titre | « Vos coordonnées » |
| Texte RGPD checkbox | « J'accepte que les informations saisies soient utilisées dans le cadre de la relation commerciale avec Butagaz, pour me recontacter. » |
| CTA | « Continuer » → WF3 (si propriétaire) ou WF2-sortie (si locataire) |

Messages d'erreur :
- Prénom vide : « Veuillez saisir votre prénom. »
- Nom vide : « Veuillez saisir votre nom. »
- Adresse vide : « Veuillez saisir l'adresse du logement. »
- Téléphone invalide : « Veuillez saisir un numéro de téléphone valide (10 chiffres). »
- Email invalide : « Veuillez saisir une adresse email valide. »
- RGPD non coché : « Veuillez accepter les conditions pour continuer. »

### WF2-sortie : Locataire

| Élément | Contenu |
|---|---|
| Titre | « Ce parcours est réservé aux propriétaires » |
| Paragraphe 1 | « En tant que locataire, c'est votre propriétaire qui décide du choix du fournisseur. » |
| Paragraphe 2 | « Ce que vous pouvez faire : Parlez-en à votre propriétaire. Nous pouvons lui envoyer une documentation par email. Si votre propriétaire est intéressé, il peut remplir ce formulaire lui-même. » |
| CTA principal (gris) | « Appeler un conseiller au 09 70 81 80 65 — lun-ven 9h-18h » |
| CTA secondaire (gris) | « Demander à être rappelé » |
| Lien | « Retour au site butagaz.fr » |

Note : le numéro de téléphone pour les locataires est 09 70 81 80 65 (ligne dédiée contrats locataires). Ce numéro est différent du numéro général du tunnel.

### WF3 : Installation actuelle

| Champ | Type | Obligatoire | Infobulle |
|---|---|---|---|
| Citerne apparente/enfouie | 2 blocs visuels cliquables | Oui | « ⓘ Apparente : vous la voyez dans votre jardin, posée au sol. Enfouie : enterrée sous terre. Seul un petit capot dépasse du sol. » |
| Conserver le même type | Radio (Oui / Non) | Oui | « ⓘ C'est votre préférence, pas un engagement. Un technicien vérifiera la faisabilité avant installation. Enfouir une citerne peut entraîner des frais précisés dans le devis. » |

Note importante : la checkbox « La citerne est à la même adresse que mon domicile » a été déplacée à l'étape 2 (WF2 - Coordonnées). Elle n'apparaît plus ici.

| Élément | Contenu |
|---|---|
| Progression | 1 — 2 — **(3)** — 4 — 5 |
| Titre | « Votre installation actuelle » |
| Question 1 | « Votre citerne est-elle visible dans votre jardin ? » |
| Question 2 | « Souhaitez-vous garder le même type de citerne ? » |
| CTA | « Continuer » → WF4 |

Pas de filtre à cette étape. Pas de sortie.

### WF4 : Factures + Biopropane

Les 3 factures sont toutes obligatoires (hard block décidé par Pierre-Louis du Chazaud). Il n'existe pas de parcours dégradé « continuer sans facture ». Un prospect sans les 3 factures est orienté vers la Sortie 3 (formulaire de rappel avec lien de retour).

**Structure du parcours d'upload — Mode B (référence)**

Le Mode B est le parcours principal. Pour chaque facture, l'upload se décompose en 2 sous-étapes :
- Étape A : « Préparez votre facture » (illustration + conseils) → clic « Ma facture est prête »
- Étape B : upload ou photo (2 options : télécharger un fichier / prendre une photo sur mobile)
- État succès : fond vert clair, nom du fichier, boutons [Voir] [Remplacer] [Supprimer]
- État erreur : fond rouge clair, message et option [Réessayer]

L'indicateur « Facture 1/3 », « Facture 2/3 », « Facture 3/3 » est visible en haut de chaque sous-étape.

**Écran principal WF4** :

| Élément | Contenu |
|---|---|
| Progression | 1 — 2 — 3 — **(4)** — 5 |
| Titre | « Vos factures de gaz » |
| Bloc réassurance (bleu) | « Avec vos factures, nous estimons votre consommation réelle et vous proposons le tarif le plus adapté. Les 3 factures sont nécessaires pour finaliser votre demande. » |
| Upload 1 | « Facture 1 (obligatoire) — Appuyez pour choisir un fichier ou prendre une photo — PDF, JPG ou PNG — 10 Mo max » |
| Upload 2 | « Facture 2 (obligatoire) — PDF, JPG ou PNG — 10 Mo max » |
| Upload 3 | « Facture 3 (obligatoire) — PDF, JPG ou PNG — 10 Mo max » |
| Infobull ordinateur | « ⓘ Sur ordinateur : faites glisser et déposer votre fichier, ou cliquez sur "Parcourir mes fichiers". » |
| Infobull mobile | « ⓘ Sur mobile : photographiez directement votre facture papier avec votre téléphone. » |
| Tuto facture (jaune) | « ⓘ Où trouver vos factures ? Chez vous : dans vos courriers. En ligne : espace client de votre fournisseur (Primagaz, Antargaz, Vitogaz) > rubrique "Mes factures". » |
| Lien sortie 3 | « Vous n'avez pas vos 3 factures ? Un conseiller peut vous rappeler pour vous aider. » → WF4-sortie |
| Question biopropane | « Souhaitez-vous souscrire à l'option Biopropane ? (option payante) » |
| Radio biopropane | Non merci / Oui, 20 % biopropane / Oui, 100 % biopropane |
| Infobulle biopropane | « ⓘ Le biopropane est une version du propane issue de ressources renouvelables. Cette option entraîne un coût supplémentaire par rapport au propane standard. » |
| CTA | « Continuer » → WF5 (si les 3 factures sont uploadées) |
| Bloc RGPD (après le CTA) | Voir wording complet ci-dessous |

**Wording complet du bloc RGPD (à afficher après le bouton Continuer) :**

« Les factures transmises sont utilisées exclusivement pour analyser votre consommation énergétique et estimer votre budget, afin de vous proposer une offre adaptée. Ces données sont traitées par Butagaz, dans le cadre de l'étude de votre projet, conformément au RGPD. Seules les informations nécessaires sont collectées et accessibles aux services internes concernés. Elles sont conservées uniquement le temps nécessaire à l'analyse de votre projet. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données à l'adresse suivante : protectiondesdonnees@butagaz.com. Vous pouvez également introduire une réclamation auprès de la CNIL. »

États d'upload (4 états à implémenter) :
1. **Vide** : zone dashed, texte « Appuyez pour choisir un fichier ou prendre une photo »
2. **En cours** : nom du fichier + barre de progression (simuler 0 à 100 % en 2 secondes)
3. **Succès** : fond vert clair, nom du fichier + taille + boutons [Voir] [Remplacer] [Supprimer]
4. **Erreur** : fond rouge clair, « Ce fichier ne peut pas être envoyé. Seuls les PDF, JPG et PNG sont acceptés (10 Mo maximum). [Réessayer avec un autre fichier] »

### WF4-sortie : Pas de factures

S'affiche quand le prospect clique sur « Vous n'avez pas vos 3 factures ? » dans WF4.

| Élément | Contenu |
|---|---|
| Titre | « Nous avons besoin de vos factures pour continuer » |
| Paragraphe 1 | « Les 3 factures sont indispensables pour analyser votre consommation et vous proposer un tarif personnalisé. Sans elles, nous ne pouvons pas finaliser votre demande en ligne. » |
| Bloc aide (jaune) | « Où trouver vos factures ? Dans votre boîte aux lettres. Dans votre espace client en ligne (Primagaz, Antargaz, Vitogaz). Sur l'appli de votre fournisseur. Sur votre téléphone si vous les avez photographiées. » |
| Section rappel | « Un conseiller peut vous aider » — avec formulaire pré-rempli (nom, téléphone, email) + checkbox RGPD + CTA « Confirmer et Envoyer » |
| Lien retour | « ← J'ai retrouvé mes factures, reprendre ma démarche » → retour WF4 |
| Lien | « Retour au site butagaz.fr » |

### WF5 : Synthèse + Validation

| Élément | Contenu |
|---|---|
| Progression | 1 — 2 — 3 — 4 — **(5)** |
| Titre | « Vérifiez vos informations » |
| Sous-titre | « Relisez bien avant d'envoyer. Vous pouvez modifier chaque section si besoin. » |
| Section 1 | « Coordonnées — Modifier > » + récap (civilité, prénom, nom, adresse, tél, email, statut) |
| Section 2 | « Installation — Modifier > » + récap (type citerne, conserver, adresse citerne si différente) |
| Section 3 | « Factures — Modifier > » + récap (nombre de factures, biopropane) |
| Bloc info (bleu) | « En validant, vous recevrez une proposition de contrat personnalisée sous 48 h ouvrées. Aucun engagement à ce stade. » |
| CTA (noir, gros) | « Valider et envoyer ma demande » → WF5b |
| Footer | « Une question avant d'envoyer ? 01 XX XX XX XX » |

Note importante sur la Section 2 (Installation) :
- Si la citerne est à la même adresse que le domicile → afficher : « Même adresse que le domicile »
- Si la citerne est à une adresse différente → afficher l'adresse de la citerne saisie en WF2

Comportement « Modifier » : renvoie à l'étape concernée. Après modification, retour automatique à WF5.

### WF5b : Confirmation

Il existe deux états de l'écran de confirmation selon le type de citerne.

**WF5b — Citerne apparente** (avec bloc offre) :

| Élément | Contenu |
|---|---|
| Icône | Cercle vert avec « OK » |
| Titre | « Votre demande est envoyée » |
| Référence | « Référence : BSWT-2026-XXXX » (générer un identifiant fictif à 4 chiffres) |
| Bloc info (bleu) | « Vous recevrez une proposition de contrat personnalisée sous 48 h ouvrées. Aucun engagement de votre part. » |
| Bloc offre (vert) | « Offre de bienvenue : 200 € d'avoir gaz offerts sur votre première commande. Détails dans votre proposition de contrat. » |
| Bloc contact | Photo placeholder + « Sabrina et Éric — Vos contacts locaux — Appel depuis le 01 XX XX XX XX » |
| Infobulle contact | « ⓘ Si vous avez une question, vous pouvez les contacter directement. Ils connaissent déjà votre dossier. » |
| CTA | « ← Retour au site butagaz.fr » |

**WF5b — Citerne souterraine** (message neutre, sans bloc offre) :

| Élément | Contenu |
|---|---|
| Icône | Cercle vert avec « OK » |
| Titre | « Votre demande est envoyée » |
| Référence | « Référence : BSWT-2026-XXXX » |
| Bloc info (bleu) | « Vous recevrez une proposition de contrat personnalisée sous 48 h ouvrées. Aucun engagement de votre part. » |
| Bloc contact | Photo placeholder + « Sabrina et Éric — Vos contacts locaux — Appel depuis le 01 XX XX XX XX » |
| Infobulle contact | « ⓘ Si vous avez une question, vous pouvez les contacter directement. Ils connaissent déjà votre dossier. » |
| CTA | « ← Retour au site butagaz.fr » |

Note : le bloc enrichissement dossier (photos de citerne, certificat de conformité, contraintes d'accès) a été supprimé de cet écran. Le conseiller posera ces questions par téléphone.

---

## 4. Les 4 archétypes de prospects

### Archétype A : Le calculateur

- **Profil** : propriétaire 5+ ans, citerne chez Primagaz/Antargaz, dernière facture trop élevée, a comparé sur Selectra/HelloWatt, arrive en sachant ce qu'il veut
- **Job-to-be-done** : « Quand je reçois ma facture et que le prix a encore augmenté, je veux obtenir rapidement une proposition de contrat concurrente, pour décider en connaissance de cause si je change. »
- **Friction dans le tunnel** : faible. Profil le plus susceptible de compléter le tunnel.

### Archétype B : Le frustré pressé

- **Profil** : en citerne chez un concurrent, problème récent (retard livraison, panne hiver), déclencheur émotionnel, veut partir maintenant
- **Job-to-be-done** : « Quand mon fournisseur me laisse tomber en plein hiver, je veux lancer un changement immédiatement. »
- **Friction dans le tunnel** : upload de factures (pas sous la main en mode impulsif). Sort en WF4 via la Sortie 3.

### Archétype C : Le prudent méfiant

- **Profil** : en citerne longue durée, contrat arrivant à échéance, explore sans être décidé
- **Job-to-be-done** : « Quand mon contrat arrive à terme, je veux me renseigner sans m'engager. »
- **Friction dans le tunnel** : coordonnées (surtout téléphone), RGPD, upload de factures.

### Archétype D : L'accompagné économique

- **Profil** : propriétaire âgé, zone rurale, pas à l'aise en digital, entre dans le tunnel parce qu'un enfant lui a montré le site
- **Job-to-be-done** : « Quand mon fils me dit que je paie trop cher, je veux demander à être recontacté simplement. »
- **Friction dans le tunnel** : tout le tunnel est un point de friction. Sort dès la lame d'entrée.

---

## 5. Scénarios utilisateurs

### Scénario A : Le calculateur (parcours complet)

| Étape | Écran | Action | Données |
|---|---|---|---|
| 0 | Lame d'entrée | Clique « Souscrire en ligne » | — |
| 1 | WF1 | Sélectionne « Changer de fournisseur » | — |
| 1bis | WF1bis | Lit le message, clique « C'est parti » | — |
| 2 | WF2 | Remplit tous les champs | M. Jean Moreau, 15 rue des Chênes 44300 Nantes, 06 78 45 12 89, jean.moreau@orange.fr, Propriétaire, citerne même adresse, préférence Indifférent, RGPD coché |
| 3 | WF3 | Sélectionne apparente, conserve | Apparente, Oui |
| 4 | WF4 | Uploade 3 factures, sélectionne biopropane 20 % | facture_primagaz_jan.pdf, facture_primagaz_avr.pdf, facture_primagaz_juil.pdf, Biopropane 20 % |
| 5 | WF5 | Vérifie le récap, clique « Valider et envoyer » | — |
| 5b | WF5b Apparente | Voit la confirmation avec bloc offre 200 € | Réf. BSWT-2026-0412 |

### Scénario B : Le frustré pressé (sortie Pas de factures)

| Étape | Écran | Action | Données |
|---|---|---|---|
| 0 | Lame d'entrée | Clique « Souscrire en ligne » | — |
| 1 | WF1 | Sélectionne « Changer de fournisseur » | — |
| 1bis | WF1bis | Lit rapidement, clique « C'est parti » | — |
| 2 | WF2 | Remplit tous les champs | Mme Sophie Duval, 8 chemin du Lavoir 35000 Rennes, 07 65 23 41 98, s.duval@gmail.com, Propriétaire, RGPD coché |
| 3 | WF3 | Sélectionne enfouie, conserve | Enfouie, Oui |
| 4 | WF4 | N'a pas ses factures, clique le lien sortie | → WF4-sortie |
| 4s | WF4-sortie | Formulaire pré-rempli, confirme la demande de rappel | Coordonnées pré-remplies |

### Scénario C : Le prudent méfiant (hésite, sort via le footer)

| Étape | Écran | Action | Données |
|---|---|---|---|
| 0 | Lame d'entrée | Clique « Souscrire en ligne » | — |
| 1 | WF1 | Sélectionne « Changer de fournisseur » | — |
| 1bis | WF1bis | Lit attentivement, hésite, clique « C'est parti » | — |
| 2 | WF2 | Commence à remplir. Hésite sur le téléphone. | Mme Françoise Petit, 3 impasse des Vignes 86000 Poitiers |
| — | Footer | Clique « demandez à être rappelé » → modale | Nom, tél, email → envoi |

### Scénario D : L'accompagné économique (sort immédiatement)

| Étape | Écran | Action | Données |
|---|---|---|---|
| 0 | Lame d'entrée | Clique « Être rappelé » | — |
| 0s2 | WF0-step2 | Remplit le formulaire simplifié | M. Marcel Lefèvre, 05 53 12 34 56 |
| 0s3 | WF0-step3 | Voit la confirmation | — |

### Scénario E : Non éligible (succession)

| Étape | Écran | Action | Données |
|---|---|---|---|
| 0 | Lame d'entrée | Clique « Souscrire en ligne » | — |
| 1 | WF1 | Sélectionne « J'ai acheté une maison avec une citerne » | — |
| 1s | WF1-sortie | Voit le message, remplit le formulaire de rappel | — |

### Scénario F : Locataire

| Étape | Écran | Action | Données |
|---|---|---|---|
| 0 | Lame d'entrée | Clique « Souscrire en ligne » | — |
| 1 | WF1 | Sélectionne « Changer de fournisseur » | — |
| 1bis | WF1bis | Clique « C'est parti » | — |
| 2 | WF2 | Remplit les champs, sélectionne « Locataire » | Mme Claire Martin, locataire |
| 2s | WF2-sortie | Voit le message locataire, numéro 09 70 81 80 65 | — |

---

## 6. Données de test par scénario

| Archétype | Prénom | Nom | Adresse | Tél | Email | Statut | Citerne | Conserver | Factures | Biopropane |
|---|---|---|---|---|---|---|---|---|---|---|
| A. Calculateur | Jean | Moreau | 15 rue des Chênes, 44300 Nantes | 06 78 45 12 89 | jean.moreau@orange.fr | Propriétaire | Apparente | Oui | 3 (upload simulé) | 20 % |
| B. Frustré pressé | Sophie | Duval | 8 chemin du Lavoir, 35000 Rennes | 07 65 23 41 98 | s.duval@gmail.com | Propriétaire | Enfouie | Oui | 0 (sortie WF4) | — |
| C. Prudent méfiant | Françoise | Petit | 3 impasse des Vignes, 86000 Poitiers | — (hésite) | — | — | — | — | — | — |
| D. Accompagné | Marcel | Lefèvre | 2 route de l'Église, 24100 Bergerac | 05 53 12 34 56 | — | — | — | — | — | — |
| E. Non éligible | — | — | — | — | — | — | — | — | — | — |
| F. Locataire | Claire | Martin | 7 allée des Tilleuls, 33000 Bordeaux | 06 45 67 89 01 | c.martin@gmail.com | Locataire | — | — | — | — |

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
- Hauteur : 40px minimum (textarea : auto)
- Padding interne : 0 12px
- Label : au-dessus du champ, font-size 13px, color #666
- État focus : border 2px solid #1A1A1A
- État erreur : border 2px solid #CC0000 + message sous le champ en #CC0000 font-size 12px

### Boutons

- Primaire : fond #1A1A1A, texte blanc, border-radius 10px, padding 14px, font-size 15px, font-weight 600
- Secondaire : fond transparent, border 1px solid #D0D0D0, texte #666, border-radius 10px

### Blocs cliquables (qualification, citerne)

- Border : 1px solid #E0E0E0, border-radius 10px, padding 16px
- Hover : border-color #999
- Sélectionné : border 2px solid #1A1A1A, fond #F5F5F5

### Infobulles

- Fond : #FFF9E6
- Border : 1px solid #E6D490
- Border-radius : 8px
- Padding : 10px
- Font-size : 13px
- Déclenchement : clic sur l'icône (i) à côté du label
- Comportement : toggle (clic ouvre, re-clic ferme), une seule ouverte à la fois

### Messages de réassurance (blocs bleus)

- Fond : #EFF6FF
- Border-radius : 8px
- Padding : 12px
- Font-size : 13px
- Color : #1A4D8C

### Messages d'alerte / offre (blocs verts)

- Fond : #F0FFF4
- Border : 1px solid #22C55E
- Border-radius : 8px
- Padding : 12px

### Messages d'erreur

- Texte : #CC0000
- Font-size : 12px
- Position : sous le champ en erreur

### Barre de progression

- 5 cercles de 28px, numérotés 1 à 5
- Trait de liaison : 2px solid
- Étape active : fond #1A1A1A, texte blanc
- Étapes passées : fond #666, texte blanc (cliquables)
- Étapes futures : fond #E0E0E0, texte #999 (non cliquables)

### Zone d'upload

- Zone dashed : border 2px dashed #D0D0D0, border-radius 10px, padding 20px, text-align center
- État en cours : fond #F5F5F5, barre de progression noire croissante
- État succès : fond #F0FFF0, border solid #22C55E
- État erreur : fond #FFF0F0, border solid #CC0000

### Bandeau footer

- Position : fixe en bas de l'écran
- Fond : #F5F5F5
- Padding : 10px 16px
- Font-size : 13px

### Modale « Être rappelé »

- Overlay : rgba(0,0,0,0.4)
- Modale : fond blanc, border-radius 16px, padding 24px, max-width 340px, centrée
- Champs : Nom, Téléphone, Email
- CTA : « Envoyer ma demande de rappel »
- Bouton fermer : croix en haut à droite
- Après envoi : message « Demande envoyée. Un conseiller vous contactera sous 24 h. » pendant 2 secondes, puis fermeture

---

## 8. Tableau de référence des messages

### Titres et sous-titres

| Écran | Titre | Sous-titre |
|---|---|---|
| Lame d'entrée | Gaz en citerne | Changez de fournisseur simplement |
| WF0-step2 | Vos coordonnées | (pas de sous-titre) |
| WF0-step3 | Votre demande est bien reçue | (pas de sous-titre) |
| WF1 | Quel est votre projet aujourd'hui ? | Choisissez la situation qui vous correspond. |
| WF1bis | Avant de commencer | (pas de sous-titre) |
| WF2 | Vos coordonnées | (pas de sous-titre) |
| WF3 | Votre installation actuelle | (pas de sous-titre) |
| WF4 | Vos factures de gaz | (pas de sous-titre) |
| WF4-sortie | Nous avons besoin de vos factures pour continuer | (pas de sous-titre) |
| WF5 | Vérifiez vos informations | Relisez bien avant d'envoyer. Vous pouvez modifier chaque section. |
| WF5b | Votre demande est envoyée | Référence : BSWT-2026-XXXX |
| Sortie non éligible | Ce parcours ne correspond pas à votre situation | (pas de sous-titre) |
| Sortie locataire | Ce parcours est réservé aux propriétaires | (pas de sous-titre) |

### Textes des infobulles

| Écran | Champ | Texte infobulle |
|---|---|---|
| WF1 | Conditionnel (sous bloc sélectionné) | Ce parcours est réservé aux propriétaires qui souhaitent changer de fournisseur de gaz en citerne. |
| WF1bis | Où trouver | Dans votre boîte aux lettres. Dans votre espace client en ligne (Primagaz, Antargaz, Vitogaz). Sur l'appli de votre fournisseur. |
| WF2 | Téléphone | Un conseiller vous appellera pour vous transmettre votre proposition de contrat. Vous serez contacté depuis le 01 XX XX XX XX. |
| WF2 | Email | Votre proposition de contrat sera envoyée à cette adresse. Aucun spam, promis. |
| WF2 | Adresse citerne (conditionnel) | Résidence secondaire ? Indiquez l'adresse exacte de la citerne. |
| WF2 | Propriétaire | Seul le propriétaire peut changer de fournisseur de gaz en citerne. |
| WF2 | Préférence d'appel | Rappel entre 9h et 17h, du lundi au vendredi. |
| WF3 | Citerne | Apparente : vous la voyez dans votre jardin, posée au sol. Enfouie : enterrée sous terre. Seul un petit capot dépasse. |
| WF3 | Conserver type | C'est votre préférence, pas un engagement. Un technicien vérifiera la faisabilité. Enfouir peut entraîner des frais précisés dans le devis. |
| WF4 | Tuto facture ordinateur | Sur ordinateur : faites glisser et déposer votre fichier, ou cliquez sur « Parcourir mes fichiers ». |
| WF4 | Tuto facture mobile | Sur mobile : photographiez directement votre facture papier avec votre téléphone. |
| WF4 | Biopropane | Le biopropane est une version du propane issue de ressources renouvelables. Cette option entraîne un coût supplémentaire par rapport au propane standard. |
| WF5b | Contact | Si vous avez une question, contactez-les directement. Ils connaissent déjà votre dossier. |

### Messages d'erreur par champ

| Champ | Condition | Message |
|---|---|---|
| Prénom | Vide | Veuillez saisir votre prénom. |
| Nom | Vide | Veuillez saisir votre nom. |
| Adresse | Vide | Veuillez saisir l'adresse du logement. |
| Téléphone | Vide | Veuillez saisir votre numéro de téléphone. |
| Téléphone | Format invalide | Veuillez saisir un numéro valide (10 chiffres, commençant par 0). |
| Email | Vide | Veuillez saisir votre adresse email. |
| Email | Format invalide | Veuillez saisir une adresse email valide (ex. : nom@exemple.fr). |
| RGPD | Non coché | Veuillez accepter les conditions pour continuer. |
| Citerne | Non sélectionné | Veuillez indiquer si votre citerne est apparente ou enfouie. |
| Conserver type | Non sélectionné | Veuillez indiquer si vous souhaitez garder le même type. |
| Upload | Fichier trop gros | Ce fichier dépasse la taille maximum de 10 Mo. |
| Upload | Mauvais format | Seuls les fichiers PDF, JPG et PNG sont acceptés. |

### Texte RGPD

**WF2 — Checkbox** : « J'accepte que les informations saisies soient utilisées dans le cadre de la relation commerciale avec Butagaz, pour me recontacter. »

**WF4 — Bloc mentions légales (après le CTA Continuer)** :
« Les factures transmises sont utilisées exclusivement pour analyser votre consommation énergétique et estimer votre budget, afin de vous proposer une offre adaptée. Ces données sont traitées par Butagaz, dans le cadre de l'étude de votre projet, conformément au RGPD. Seules les informations nécessaires sont collectées et accessibles aux services internes concernés. Elles sont conservées uniquement le temps nécessaire à l'analyse de votre projet. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données à l'adresse suivante : protectiondesdonnees@butagaz.com. Vous pouvez également introduire une réclamation auprès de la CNIL. »

### Messages de confirmation

- **Après validation** : « Vous recevrez une proposition de contrat personnalisée sous 48 h ouvrées. Aucun engagement de votre part. »
- **Contact local** : « Sabrina et Éric — Vos contacts locaux — Appel depuis le 01 XX XX XX XX »
- **Offre (citerne apparente)** : « Offre de bienvenue : 200 € d'avoir gaz offerts sur votre première commande. Détails dans votre proposition de contrat. »

---

## 9. Interactions et transitions

### Navigation entre écrans

- Transition : slide horizontal (gauche → droite pour avancer, droite → gauche pour reculer)
- Durée : 250 ms, ease-out
- Le contenu du nouvel écran scrolle automatiquement en haut

### Barre de progression

- Cliquable pour revenir aux étapes précédentes (pas pour avancer)
- Au clic sur une étape passée : navigation directe vers cette étape
- Les données saisies sont préservées en mémoire

### Validation des champs

- Déclenchement : au blur (quand le champ perd le focus)
- Message d'erreur : apparaît sous le champ avec une animation fade-in (150 ms)
- Le champ en erreur passe en border rouge
- Le bouton « Continuer » est toujours cliquable. Si des erreurs existent, elles s'affichent au clic.

### Upload de factures (Mode B)

Pour chaque facture, le flow est :
1. Clic sur la zone upload → Étape A (sous-écran Préparez votre facture)
2. Clic « Ma facture est prête » → Étape B (choix : Prendre une photo / Choisir un fichier)
3. Sélection du fichier → simulation upload 2 secondes → état succès ou erreur

Pour le prototype : accepter n'importe quel fichier, simuler l'upload avec setTimeout(2000). Utiliser les noms de fichiers du scénario actif.

### Infobulles

- Toggle au clic sur l'icône (i)
- Animation : slide-down + fade-in (150 ms)
- Une seule infobulle ouverte à la fois
- Se ferme au clic en dehors

### Checkbox citerne = domicile (WF2)

- Cochée par défaut
- Si décochée : le champ « Adresse de la citerne » apparaît avec une animation slide-down
- Si recochée : le champ disparaît et sa valeur est vidée

### Lien « Modifier » (synthèse WF5)

- Ramène à l'étape concernée
- Les champs sont pré-remplis avec les données saisies
- Après modification et clic sur « Continuer », retour automatique à WF5

### Modale « Être rappelé »

- Ouvre au clic sur « être rappelé » dans le bandeau footer ou les écrans de sortie
- Champs : Nom (pré-rempli si déjà saisi), Téléphone, Email (optionnel)
- CTA : « Envoyer ma demande de rappel »
- Après envoi : confirmation 2 secondes puis fermeture

---

## 10. Modes de visualisation

### Mode 1 : Vue panorama

Tous les écrans du scénario sélectionné sont affichés côte à côte en miniature (environ 140 x 250 px chacun), dans une bande horizontale scrollable.

Structure :
- Barre de sélection du scénario (onglets : A. Calculateur, B. Frustré pressé, C. Prudent méfiant, D. Accompagné, E. Non éligible, F. Locataire, Tous)
- Ligne de texte résumant le scénario sélectionné
- Les écrans miniaturisés côte à côte, reliés par des flèches
- Chaque miniature : nom de l'étape, résumé des données/choix, badge (vert = OK, ambre = embranchement, rouge = sortie)
- Clic sur une miniature → bascule en mode 2 sur cet écran

Onglet « Tous » : les 6 scénarios sont empilés verticalement pour comparaison.

### Mode 2 : Navigation interactive

Un seul écran mobile affiché au centre (375 x 812 px), interactif.

Structure :
- Barre supérieure : nom du scénario + étape en cours + bouton « Vue panorama »
- Mini-barre de progression : pills pour chaque étape
- Zone centrale : l'écran mobile interactif
- Panneau gauche (masquable) : « Annotations UX »
- Panneau droit (masquable) : « Contexte du scénario »
- Sous l'écran : boutons « ← Étape précédente » et « Étape suivante → »
- Bouton « Masquer les annotations » pour cacher les panneaux (mode démo client)

### Mode libre

Onglet supplémentaire « Mode libre ». Pas de données pré-remplies. Seul le mode navigation est disponible. Pas de panneaux latéraux.

---

## 11. Contraintes techniques pour Claude Code

- **Fichier unique** : un seul fichier JSX (React) avec tout le state, les composants et le CSS inline ou dans un bloc style
- **Mobile first** : 375 px natif. Lisible jusqu'à 768 px. Au-delà, centrer le frame mobile sur fond gris.
- **Pas de framework CSS externe** : pas de Tailwind, pas de Bootstrap.
- **Pas d'appel réseau** : tout en mémoire (useState, useReducer)
- **Pas de localStorage**
- **Librairies autorisées** : React, lucide-react pour les icônes
- **Upload simulé** : input type="file" natif + progression setTimeout 2 secondes
- **Identifiants** : « BSWT-2026-XXXX » (4 chiffres aléatoires) à la validation
- **Numéro de téléphone** : « 01 XX XX XX XX » comme placeholder. Exception : WF2-sortie Locataire utilise « 09 70 81 80 65 »
