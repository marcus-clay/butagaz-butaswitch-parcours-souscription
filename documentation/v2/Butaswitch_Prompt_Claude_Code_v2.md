# Prompt pour Claude Code — Prototype Butaswitch v2
# Version : 8 avril 2026 — Intègre les décisions de la revue FigJam (commentaires Pierre-Louis du Chazaud, Élodie Jolly, Simon White)

Lis le fichier de spécifications `Butaswitch_Specs_Prototype_v2.md` joint à ce message. Il contient l'intégralité du contexte, des wireframes, des wordings, des scénarios et des contraintes techniques pour construire le prototype.

Ce prompt complète et remplace le prompt précédent. En cas de conflit entre ce prompt et le fichier de specs, ce prompt a priorité.

---

## Ce que tu dois produire

Un prototype interactif de tunnel de souscription en ligne, en wireframe noir et blanc, mobile first. Un seul fichier React JSX avec tout le code (composants, state, CSS inline ou bloc style).

Le prototype a deux modes de visualisation et un mode libre.

### Mode 1 : Vue panorama

Affiche tous les écrans d'un scénario côte à côte en miniature (environ 140 x 250 px chacun), dans une bande horizontale scrollable.

Structure :
- Barre de sélection du scénario en haut (onglets : A. Calculateur, B. Frustré pressé, C. Prudent méfiant, D. Accompagné, E. Non éligible, F. Locataire, Tous)
- Ligne de texte sous la barre résumant le scénario sélectionné
- Les écrans miniaturisés côte à côte, reliés par des flèches
- Chaque miniature : nom de l'étape, résumé des données/choix, badge de statut (vert = OK, ambre = embranchement, rouge = sortie)
- Clic sur une miniature → bascule en mode 2 sur cet écran

Onglet « Tous » : les 6 scénarios sont empilés verticalement pour comparaison visuelle.

### Mode 2 : Navigation interactive

Un seul écran mobile affiché au centre (375 x 812 px), interactif.

Structure :
- Barre supérieure : nom du scénario + étape en cours + bouton « Vue panorama »
- Mini-barre de progression : pills pour chaque étape. Active = noire. Passées = gris foncé (cliquables). Futures = gris clair (non cliquables).
- Zone centrale : l'écran mobile interactif (champs remplissables, boutons cliquables, infobulles fonctionnelles, upload simulé)
- Panneau gauche (masquable) : « Annotations UX » — explication des choix de design pour cet écran
- Panneau droit (masquable) : « Contexte du scénario » — profil de l'archétype, données, niveau de friction
- Sous l'écran : boutons « ← Étape précédente » et « Étape suivante → »
- Bouton « Masquer les annotations » pour cacher les panneaux (mode démo client)

### Mode libre

Onglet supplémentaire « Mode libre » dans la barre de sélection. Pas de données pré-remplies. Seul le mode navigation est disponible (pas de panorama). Pas de panneaux latéraux.

---

## Les écrans à implémenter

### Hors tunnel — Lame d'entrée et flows rappel

1. **WF0 — Lame d'entrée** : 2 états (SANS OFFRE et AVEC OFFRE). Dans AVEC OFFRE, le CTA « Souscrire en ligne » est positionné en premier, après le bloc offre vert. Dans SANS OFFRE, l'ordre est : Appeler / Être rappelé / Souscrire en ligne.
2. **WF0-step2 — Formulaire de rappel** : Prénom*, Nom*, Téléphone*, Email*, Message (facultatif), Checkbox RGPD, CTA « Envoyer ma demande »
3. **WF0-step3 — Confirmation rappel** : titre « Votre demande est bien reçue », bloc info 24h, CTA retour site

### Tunnel principal

4. **WF1 — Qualification** : 3 blocs visuels cliquables. Comportement conditionnel : quand le Bloc 1 est sélectionné, un bandeau info jaune apparaît DIRECTEMENT SOUS ce bloc (pas en bas de page). Le bandeau n'est pas visible par défaut.
5. **WF1bis — Prérequis** : écran d'information. Contient la mention « Parcours réservé aux propriétaires d'un logement avec citerne de gaz. » sous le titre. Les 3 factures sont décrites comme toutes obligatoires.
6. **WF2 — Coordonnées** : ordre des champs = Prénom, Nom, Adresse du logement, Téléphone, Préférence d'appel (facultatif), Email, Checkbox « La citerne est à la même adresse que mon domicile » (cochée par défaut), Propriétaire/Locataire, RGPD. Navigation : « ← Précédent » (pas « Retour au site »).
7. **WF3 — Installation** : 2 blocs visuels (apparente/enfouie) + radio conserver. La checkbox « La citerne est à la même adresse » a été retirée de cet écran (elle est en WF2).
8. **WF4 — Factures + Biopropane** : 3 zones upload toutes obligatoires. Mode B = sous-étapes par facture (Étape A préparation + Étape B upload). Biopropane = question distincte avec le wording PL. Bloc RGPD APRÈS le CTA Continuer (pas avant).
9. **WF5 — Synthèse** : récap modifiable. Section Installation affiche l'adresse de la citerne si différente du domicile. Le message de confirmation contient « proposition de contrat » (pas « devis »).
10. **WF5b — Confirmation** : 2 états (citerne apparente avec bloc offre 200 € / citerne souterraine sans offre). Pas de bloc enrichissement dossier.

### Écrans de sortie

11. **WF1-sortie — Non éligible** : titre « Ce parcours ne correspond pas à votre situation ». Formulaire inline avec récap pré-rempli + Checkbox RGPD + bouton « Confirmer et Envoyer ». Pas de redirection externe.
12. **WF2-sortie — Locataire** : supprimer la phrase « C'est une contrainte réglementaire. » Numéro de téléphone : 09 70 81 80 65 (ligne dédiée contrats locataires).
13. **WF4-sortie — Pas de factures** : nouvel écran. Titre « Nous avons besoin de vos factures pour continuer ». Formulaire de rappel pré-rempli + lien « ← J'ai retrouvé mes factures, reprendre ma démarche » (retour WF4).

### Composant transversal

14. **Modale « Être rappelé »** : formulaire simplifié (Nom, Téléphone, Email). Nom pré-rempli si déjà saisi dans le tunnel.

---

## Les éléments transversaux (présents sur chaque écran du tunnel)

- **Header** : « Butagaz » à gauche, « Retour au site » à droite
- **Navigation retour** : lien « ← Précédent » (absent à l'étape 1). Libellé exact : « Précédent »
- **Barre de progression** : 5 cercles numérotés. Actif = noir. Passés = gris foncé (cliquables). Futurs = gris clair.
- **Bandeau footer fixe** : « Besoin d'aide ? 01 XX XX XX XX ou demandez à être rappelé »
- **Validation inline** : au blur, message d'erreur en rouge sous le champ
- **Infobulles** : icône (i) au clic, bloc jaune pâle sous le champ, une seule ouverte à la fois

---

## Les 6 scénarios à implémenter

**Scénario A (Calculateur)** : parcours complet fluide. WF0 → WF1 → WF1bis → WF2 (Jean Moreau, Nantes, Propriétaire, citerne même adresse, préférence Indifférent) → WF3 (apparente, conserve) → WF4 (3 factures uploadées, biopropane 20 %) → WF5 → WF5b (citerne apparente, bloc offre 200 €).

**Scénario B (Frustré pressé)** : sort à WF4 faute de factures. WF0 → WF1 → WF1bis → WF2 (Sophie Duval, Rennes, Propriétaire) → WF3 (enfouie, conserve) → WF4 → clic lien « pas de factures » → WF4-sortie (formulaire pré-rempli confirmé).

**Scénario C (Prudent méfiant)** : hésite à l'étape 2, sort via le bandeau footer « être rappelé ». WF0 → WF1 → WF1bis → WF2 (Françoise Petit, Poitiers, commence à remplir, hésite sur le téléphone) → modale footer.

**Scénario D (Accompagné)** : clique « Être rappelé » dès la lame d'entrée. WF0 → WF0-step2 (Marcel Lefèvre) → WF0-step3. N'entre jamais dans le tunnel.

**Scénario E (Non éligible)** : choisit « maison avec citerne » à l'étape 1, sort vers WF1-sortie. WF0 → WF1 → WF1-sortie (formulaire inline, confirme rappel).

**Scénario F (Locataire)** : remplit l'étape 2, sélectionne « Locataire », sort vers WF2-sortie. WF0 → WF1 → WF1bis → WF2 (Claire Martin, Bordeaux, locataire) → WF2-sortie (numéro 09 70 81 80 65).

Les données de test complètes sont dans la section 6 du fichier de specs.

---

## Le contenu des panneaux latéraux (mode navigation)

### Panneau gauche : Annotations UX

- **WF0** : « Lame d'entrée injectable sur butagaz.fr. 2 états : SANS OFFRE et AVEC OFFRE (toggle CMS). Dans AVEC OFFRE, le CTA Souscrire est positionné en premier pour réduire la distance entre l'offre et l'action. »
- **WF0-step2** : « Flow de rappel hors tunnel. Collecte minimale. RGPD obligatoire car données commerciales. »
- **WF1** : « Blocs visuels cliquables. Seul le choix 1 continue dans le tunnel. Le bandeau info conditionnel apparaît sous le bloc sélectionné pour expliquer le périmètre sans alourdir l'interface initiale. »
- **WF1bis** : « Écran de préparation, pas de collecte. La mention propriétaires rappelle le périmètre. Les 3 factures sont obligatoires (décision Pierre-Louis du Chazaud). »
- **WF1-sortie** : « Ton bienveillant. Titre reformulé en positif. Formulaire inline évite une redirection : le prospect peut confirmer son rappel sans quitter la page. »
- **WF2** : « Prénom avant Nom (convention française naturelle). L'adresse est l'adresse du logement (citerne), pas l'adresse postale du prospect. Checkbox citerne = domicile cochée par défaut : couvre 85 % des cas. Préférence d'appel facultative : Matin / Après-midi / Indifférent (validé en session). RGPD wording validé par Pierre-Louis du Chazaud. »
- **WF2-sortie** : « Le prospect locataire ne peut pas légalement changer de fournisseur. Ton orienté solution. Numéro dédié 09 70 81 80 65 (ligne contrats locataires). »
- **WF3** : « Pas de filtre à cette étape. La checkbox adresse citerne a été déplacée en WF2 pour grouper toutes les informations de localisation. »
- **WF4** : « Les 3 factures sont toutes obligatoires (décision Pierre-Louis du Chazaud). Mode B = sous-étapes par facture pour guider les profils peu digitaux. Biopropane = option payante (wording validé par Pierre-Louis). RGPD déplacé après le CTA pour ne pas créer de friction à l'upload (décision Pierre-Louis). »
- **WF4-sortie** : « Sortie 3 (hard block). Le prospect est orienté vers un rappel. Un lien de retour lui permet de revenir quand il aura ses factures. »
- **WF5** : « Chaque section est modifiable. Lien Modifier renvoie à l'étape puis retour auto à WF5. Adresse citerne conditionnelle dans la section Installation. Wording "proposition de contrat" (décision Pierre-Louis : Butagaz envoie un contrat, pas un devis). »
- **WF5b** : « Lead déjà dans Salesforce. Contacts locaux nommés (Sabrina/Éric). Bloc offre 200 € conditionnel à la citerne apparente (validé juridiquement). Bloc enrichissement dossier supprimé (décision UX : mauvais timing mobile, le conseiller posera les questions au téléphone). »

### Panneau droit : Contexte du scénario

**Scénario A** :
```
Archétype : Le calculateur
Jean Moreau, Nantes
Propriétaire 5+ ans, citerne Primagaz
Compare les prix, arrive en sachant ce qu'il veut

Friction globale : FAIBLE
Profil le plus susceptible de compléter
le tunnel intégralement.
```

**Scénario B** :
```
Archétype : Le frustré pressé
Sophie Duval, Rennes
Citerne enfouie chez Antargaz
Problème récent : panne hiver

Friction WF4 : ÉLEVÉE
N'a pas ses factures sous la main.
Sort via la Sortie 3 (formulaire rappel).
```

**Scénario C** :
```
Archétype : Le prudent méfiant
Françoise Petit, Poitiers
Contrat arrivant à échéance
Explore sans être décidée

Friction WF2 : ÉLEVÉE
Hésite à communiquer son téléphone.
Sort via le bandeau footer « être rappelé ».
```

**Scénario D** :
```
Archétype : L'accompagné économique
Marcel Lefèvre, Bergerac
Propriétaire âgé, zone rurale
Son fils lui a montré le site

Friction globale : MAXIMALE
Le tunnel n'existe pas pour ce profil.
Utilise « Être rappelé » dès la lame d'entrée.
```

**Scénario E** :
```
Profil : Nouveau propriétaire (succession)
Choisit « maison avec citerne » à l'étape 1
→ Sortie 1 (non éligible)
Utilise le formulaire inline pour demander un rappel.
```

**Scénario F** :
```
Profil : Locataire
Claire Martin, Bordeaux
Remplit l'étape 2, sélectionne « Locataire »
→ Sortie 2 (locataire)
Numéro dédié : 09 70 81 80 65
```

---

## Wordings critiques à appliquer mot pour mot

Ces textes sont validés par le client. Ne pas les reformuler.

**RGPD WF2 (checkbox)** :
« J'accepte que les informations saisies soient utilisées dans le cadre de la relation commerciale avec Butagaz, pour me recontacter. »

**RGPD WF4 (bloc après CTA)** :
« Les factures transmises sont utilisées exclusivement pour analyser votre consommation énergétique et estimer votre budget, afin de vous proposer une offre adaptée. Ces données sont traitées par Butagaz, dans le cadre de l'étude de votre projet, conformément au RGPD. Seules les informations nécessaires sont collectées et accessibles aux services internes concernés. Elles sont conservées uniquement le temps nécessaire à l'analyse de votre projet. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données à l'adresse suivante : protectiondesdonnees@butagaz.com. Vous pouvez également introduire une réclamation auprès de la CNIL. »

**Biopropane — label question** :
« Souhaitez-vous souscrire à l'option Biopropane ? (option payante) »

**Biopropane — infobulle** :
« Le biopropane est une version du propane issue de ressources renouvelables. Cette option entraîne un coût supplémentaire par rapport au propane standard. »

**Infobull upload ordinateur** :
« Sur ordinateur : faites glisser et déposer votre fichier, ou cliquez sur "Parcourir mes fichiers". »

**WF5 — message avant CTA** :
« En validant, vous recevrez une proposition de contrat personnalisée sous 48 h ouvrées. Aucun engagement à ce stade. »

**WF5b — message principal** :
« Vous recevrez une proposition de contrat personnalisée sous 48 h ouvrées. Aucun engagement de votre part. »

**WF5b — bloc offre (citerne apparente uniquement)** :
« Offre de bienvenue : 200 € d'avoir gaz offerts sur votre première commande. Détails dans votre proposition de contrat. »

**WF0-step3 — confirmation rappel** :
« Un conseiller vous contactera sous 24 h. Rappel entre 9h et 17h, du lundi au vendredi. »

**Mention légale WF0 AVEC OFFRE** :
« *Offre réservée aux clients souscrivant à une citerne apparente. Le montant de l'avoir sera déterminé en fonction de la consommation annuelle estimée. »

---

## Design wireframe noir et blanc

Reprends les specs de la section 7 du fichier :
- Frame mobile : 375 x 812 px, fond blanc
- Typo : system font stack, noir #1A1A1A, gris #666, tertiaire #999
- Champs : border 1px #D0D0D0, radius 8px, hauteur 40px min
- Bouton primaire : fond #1A1A1A, texte blanc, radius 10px
- Bouton secondaire : fond transparent, border 1px #D0D0D0
- Infobulles : fond #FFF9E6, border #E6D490
- Réassurance / blocs info : fond #EFF6FF, texte #1A4D8C
- Bloc offre : fond #F0FFF4, border #22C55E
- Erreur : texte #CC0000, border champ #CC0000
- Upload : zone dashed, 4 états (vide, en cours, succès vert, erreur rouge)
- Barre de progression : 5 cercles 28px, actif noir, passé gris foncé, futur gris clair
- Footer : fixe en bas, fond #F5F5F5

---

## Interactions

Reprends les specs de la section 9 :
- Transitions slide horizontal 250ms ease-out
- Barre de progression cliquable pour retour aux étapes passées
- Validation inline au blur
- Upload Mode B : sous-étapes Étape A (préparation) + Étape B (upload), simulation 2s
- Checkbox citerne = domicile : slide-down du champ adresse citerne si décochée
- Infobulles toggle au clic, une seule ouverte à la fois
- Bandeau conditionnel WF1 : apparaît SOUS le bloc sélectionné, pas en bas de page
- Lien « Modifier » dans WF5 : renvoie à l'étape, puis retour auto à WF5
- Modale « Être rappelé » : overlay + formulaire + confirmation 2s puis fermeture
- Écrans de sortie : pas de retour au tunnel sauf WF4-sortie (lien de retour WF4)

---

## Règles critiques

1. Ne jamais inventer de texte. Tous les wordings sont dans ce prompt et dans le fichier de specs.
2. Le prototype est en français. Tous les textes, labels, messages, infobulles sont en français.
3. Les accents sur les majuscules sont obligatoires (À, É, È, Ê, Î, Ç...).
4. Pas de localStorage, pas d'appel réseau. Tout en mémoire React (useState, useReducer).
5. Un seul fichier JSX. Pas de fichiers séparés.
6. Mobile first (375px). Au-delà de 768px, centrer le frame mobile sur fond gris clair.
7. Les scénarios pré-remplissent les données ET simulent les choix.
8. En mode navigation, quand un scénario est actif, les champs sont pré-remplis mais restent modifiables.
9. Le mode libre n'a pas de données pré-remplies et pas de panorama.
10. Les panneaux latéraux sont masquables via un toggle « Masquer les annotations ».
11. WF4-sans-facture (parcours dégradé 700 kg/an) ne doit PAS être implémenté. Il a été supprimé.
12. WF6-bonus (enrichissement dossier) ne doit PAS être implémenté. Il a été supprimé.
13. Le numéro 09 70 81 80 65 s'utilise UNIQUEMENT dans WF2-sortie Locataire. Partout ailleurs, utiliser 01 XX XX XX XX.
14. Dans WF5 et WF5b, le mot « devis » ne doit jamais apparaître. Utiliser « proposition de contrat ».
