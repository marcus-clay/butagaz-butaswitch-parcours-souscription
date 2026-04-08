# Butaswitch — Patch spec prototype v2.1
# Ajout : PAGE0 site butagaz.fr + raccordement « Retour au site »
# À intégrer dans Butaswitch_Specs_Prototype_v2.md

---

## Modification de l'architecture (section 2)

### Flux principal — version mise à jour

```
PAGE0 (site butagaz.fr — encart visible)
  ├── Appeler → affiche numéro (reste sur PAGE0)
  ├── Être rappelé → WF0-step2 → WF0-step3 → PAGE0
  └── Souscrire en ligne → TUNNEL
        │
        ├── WF1 : Qualification
        │     ├── « Changer de fournisseur » → WF1bis → WF2
        │     └── Autre choix → SORTIE 1 → PAGE0
        │
        ├── WF2 : Coordonnées + Statut
        │     ├── Propriétaire → WF3
        │     └── Locataire → SORTIE 2 → PAGE0
        │
        ├── WF3 : Installation → WF4
        │
        ├── WF4 : Factures
        │     ├── 3 factures uploadées → WF5
        │     └── Pas de factures → SORTIE 3 → PAGE0 (ou retour WF4)
        │
        └── WF5 → WF5b → PAGE0
```

**Suppression :** WF0 (lame d'entrée isolée) est supprimé en tant qu'écran autonome. Son contenu est intégré à PAGE0 sous forme d'encart. WF0-step2 et WF0-step3 (formulaire et confirmation de rappel) restent des écrans autonomes accessibles depuis PAGE0.

---

## Nouvel écran : PAGE0 — Site butagaz.fr

**Contexte** : écran d'entrée du prototype. Représente une page de contenu Butagaz.fr sur laquelle l'encart de souscription est intégré. Il n'est pas conçu pour représenter la page réelle (inconnue à ce stade) mais pour montrer le contexte d'intégration de l'encart. Tout ce qui n'est pas l'encart est grisé et non interactif.

**Structure de PAGE0 (mobile, 375px)** :

| Zone | Contenu | État |
|---|---|---|
| Header | Logo « Butagaz » + icône menu | Grisé, non interactif |
| Breadcrumb | « Offres > Gaz en citerne » | Grisé, non interactif |
| Titre de section | « Gaz en citerne » | Grisé, non interactif |
| Bloc intro | 2-3 lignes de texte fictif sur l'offre GPL | Grisé, non interactif |
| **Encart souscription** | **Zone active — fond blanc, bordure visible** | **Interactif** |
| Contenu page bas | Section « Nos engagements » (lignes fictives) | Grisé, non interactif |
| Footer | Mentions légales, liens fictifs | Grisé, non interactif |

**Contenu de l'encart souscription dans PAGE0** :

| Élément | Contenu |
|---|---|
| Label encart | « Vous souhaitez changer de fournisseur ? » |
| Bloc offre (optionnel, si AVEC OFFRE actif) | « Jusqu'à 200 € d'avoir gaz offerts sur votre première commande* » |
| CTA 1 | « Souscrire en ligne — Devis personnalisé sous 48 h » (noir, mis en avant) |
| CTA 2 | « Appeler un conseiller — 01 XX XX XX XX, lun-ven 9h-18h » |
| CTA 3 | « Être rappelé — Un conseiller vous contacte sous 24 h » |
| Mention légale | « *Offre réservée aux clients souscrivant à une citerne apparente. » (si AVEC OFFRE) |

**Comportement des CTAs de l'encart** :
- « Souscrire en ligne » → navigation vers WF1 (qualification, première étape du tunnel)
- « Appeler un conseiller » → affiche le numéro à côté du CTA (ou dans une bannière sous l'encart), reste sur PAGE0
- « Être rappelé » → navigation vers WF0-step2 (formulaire de rappel)

**Indicateur visuel** : une étiquette « Zone active du prototype » en haut de l'encart signale clairement quelle partie de la page est interactive. Les zones grisées ont une opacité réduite (opacity 0.35) pour communiquer leur statut non interactif.

**Comportement du scroll** : PAGE0 est une page scrollable. L'encart est positionné environ à mi-hauteur de la page. Quand le prototype revient à PAGE0 depuis un écran de sortie ou de confirmation, il scrolle automatiquement pour centrer l'encart dans la vue.

---

## Mise à jour des écrans existants : comportement « Retour au site »

Tous les liens et CTAs libellés « Retour au site butagaz.fr » doivent naviguer vers PAGE0 (pas vers une URL externe, pas vers un écran vide).

| Écran | Élément | Comportement mis à jour |
|---|---|---|
| WF0-step3 | CTA « Retour au site butagaz.fr » | → PAGE0 (scroll sur encart) |
| WF1-sortie | Lien « Retour au site butagaz.fr » | → PAGE0 (scroll sur encart) |
| WF2-sortie | Lien « Retour au site butagaz.fr » | → PAGE0 (scroll sur encart) |
| WF4-sortie | Lien « Retour au site butagaz.fr » | → PAGE0 (scroll sur encart) |
| WF5b (apparente) | CTA « ← Retour au site butagaz.fr » | → PAGE0 (scroll sur encart) |
| WF5b (souterraine) | CTA « ← Retour au site butagaz.fr » | → PAGE0 (scroll sur encart) |

**Transition** : le retour à PAGE0 utilise le même slide horizontal inversé (droite → gauche) que les retours arrière dans le tunnel. Durée 250 ms ease-out.

---

## Mise à jour des scénarios (section 5)

Tous les scénarios démarrent maintenant depuis PAGE0.

### Scénario A (Calculateur) — mise à jour
Ajouter en tête : PAGE0 → clic « Souscrire en ligne » → WF1 → (suite inchangée) → WF5b → clic « Retour au site » → PAGE0

### Scénario B (Frustré pressé) — mise à jour
PAGE0 → clic « Souscrire en ligne » → WF1 → ... → WF4-sortie → clic « Retour au site » → PAGE0

### Scénario C (Prudent méfiant) — mise à jour
PAGE0 → clic « Souscrire en ligne » → WF1 → WF1bis → WF2 → sort via footer → modale (inchangé)

### Scénario D (Accompagné économique) — mise à jour
PAGE0 → clic « Être rappelé » → WF0-step2 → WF0-step3 → PAGE0

### Scénario E (Non éligible) — mise à jour
PAGE0 → clic « Souscrire en ligne » → WF1 → WF1-sortie → « Retour au site » → PAGE0

### Scénario F (Locataire) — mise à jour
PAGE0 → clic « Souscrire en ligne » → WF1 → WF1bis → WF2 → WF2-sortie → « Retour au site » → PAGE0

---

## Mise à jour des panneaux latéraux

### Annotation UX pour PAGE0

« Page d'offre butagaz.fr avec l'encart de souscription intégré. L'encart est le seul élément interactif du prototype à cette étape : les zones grisées représentent le contenu de la page hôte, non pertinent pour le test de ce parcours. Dans la vraie implémentation, l'encart est injectable (balise <section> indépendante) et peut être placé sur n'importe quelle page de butagaz.fr ou landing page SEA. »

### Mise à jour annotation WF1

Ajouter : « Étape 1 du tunnel. Le prospect a cliqué "Souscrire en ligne" depuis l'encart sur butagaz.fr. »

---

## Contraintes techniques supplémentaires (section 11)

- **PAGE0 est un écran scrollable** dans le frame mobile 375px. Utiliser un div avec overflow-y: auto et hauteur fixe représentant une page de contenu (environ 1400px de contenu total).
- **Scroll automatique vers l'encart** : quand le prototype navigue vers PAGE0 (depuis un retour au site), utiliser scrollIntoView() ou scrollTo() pour centrer l'encart dans la vue après la transition.
- **Zones grisées** : opacité 0.35, pointer-events: none, cursor: default. Un commentaire visuel discret peut signaler « contenu de la page hôte — non interactif dans ce prototype ».
- **WF0 comme écran autonome est supprimé** : son contenu (les 3 CTAs) est désormais intégré directement dans PAGE0 comme section d'encart. Il ne doit plus apparaître comme étape séparée dans la barre de progression ou le panorama.
- **Barre de progression** : le compteur commence à WF1 (étape 1 sur 5). PAGE0 est hors tunnel et n'est pas comptée.
