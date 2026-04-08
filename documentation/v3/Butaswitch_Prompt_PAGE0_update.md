# Prompt Claude Code — Mise à jour Butaswitch : ajout PAGE0 + raccordement « Retour au site »

Ce prompt est un **complément** au prototype déjà en cours de construction. Il décrit les modifications à apporter au fichier JSX existant. Applique ces changements sans casser ce qui existe déjà.

---

## Ce qui change

### 1. Suppression de WF0 comme écran autonome

L'écran WF0 (lame d'entrée isolée) est supprimé en tant qu'étape indépendante. Son contenu (les 3 CTAs) est intégré à PAGE0 (voir ci-dessous).

WF0-step2 (formulaire rappel) et WF0-step3 (confirmation rappel) restent des écrans autonomes accessibles depuis PAGE0.

Dans le state et le routing du prototype :
- Supprimer `'WF0'` comme valeur d'écran possible
- Remplacer toutes les navigations vers `WF0` par des navigations vers `PAGE0`
- La barre de progression commence toujours à WF1 (étape 1). PAGE0 est hors tunnel, elle n'est pas comptée.

---

### 2. Ajout de PAGE0 — Site butagaz.fr

**PAGE0** est le nouvel écran d'entrée du prototype. C'est un écran scrollable (overflow-y: auto) dans le frame mobile 375px. Il représente une page de contenu butagaz.fr dans laquelle l'encart de souscription est intégré.

**Structure de PAGE0 :**

```
┌─────────────────────────────────────┐
│  [Logo Butagaz]          [≡ Menu]   │  ← Header grisé (opacity 0.35, non interactif)
├─────────────────────────────────────┤
│  Offres > Gaz en citerne            │  ← Breadcrumb grisé
├─────────────────────────────────────┤
│  Gaz en citerne                     │  ← Titre de section grisé
│  Lorem ipsum dolor sit amet,        │  ← Texte fictif grisé (2-3 lignes)
│  consectetur adipiscing elit...     │
│  En savoir plus >                   │  ← Lien grisé
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │  Zone active du prototype   │    │  ← Étiquette indicateur
│  │─────────────────────────────│    │
│  │  Vous souhaitez changer     │    │  ← Encart souscription
│  │  de fournisseur ?           │    │    (fond blanc, bordure 2px #1A1A1A)
│  │                             │    │    INTERACTIF
│  │  ┌─────────────────────┐   │    │
│  │  │ Souscrire en ligne  │   │    │  ← CTA primaire (noir, fond #1A1A1A)
│  │  │ Devis sous 48 h     │   │    │
│  │  └─────────────────────┘   │    │
│  │  ┌─────────────────────┐   │    │
│  │  │ Appeler un conseill.│   │    │  ← CTA secondaire
│  │  │ 01 XX XX XX XX      │   │    │
│  │  └─────────────────────┘   │    │
│  │  ┌─────────────────────┐   │    │
│  │  │ Être rappelé        │   │    │  ← CTA secondaire
│  │  │ Sous 24 h           │   │    │
│  │  └─────────────────────┘   │    │
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│  Nos engagements                    │  ← Section grisée
│  Lorem ipsum...                     │
│  ────────────────────────────────   │
│  [Mentions] [Contact] [CGU]         │  ← Footer grisé
└─────────────────────────────────────┘
```

**Implémentation des zones grisées :**
```css
.page-host-content {
  opacity: 0.35;
  pointer-events: none;
  cursor: default;
}
```

**Étiquette « Zone active du prototype »** :
- Positionnée en haut de l'encart
- Fond #FFF9E6 (jaune pâle), border 1px #E6D490, border-radius 4px
- Font-size 11px, color #666, padding 3px 8px
- Texte : « Zone active du prototype »

**Comportement des CTAs de l'encart dans PAGE0 :**
- « Souscrire en ligne » → `setScreen('WF1')` + scroll to top
- « Appeler un conseiller » → affiche le numéro en bas de l'encart (une ligne de texte apparaît : « Appelez le 01 XX XX XX XX, du lundi au vendredi de 9h à 18h »). Pas de navigation.
- « Être rappelé » → `setScreen('WF0_STEP2')`

**Version AVEC OFFRE de l'encart** (si l'état `offerActive` est true) :
Ajouter un bloc vert avant les CTAs :
```
┌─────────────────────────────────────┐
│  Jusqu'à 200 € d'avoir gaz offerts  │  ← Fond #F0FFF4, border #22C55E
│  sur votre première commande*       │
└─────────────────────────────────────┘
```
Et le CTA « Souscrire en ligne » est repositionné en premier (avant « Appeler »).

Ajouter un toggle dans l'interface du prototype (hors frame mobile, dans la barre de contrôle du prototype) : « Afficher l'offre 200 € » (checkbox ou toggle). Ce toggle contrôle l'état `offerActive`.

---

### 3. Raccordement « Retour au site butagaz.fr »

Dans tous les écrans listés ci-dessous, le lien ou CTA « Retour au site butagaz.fr » doit déclencher la navigation vers PAGE0 avec scroll automatique sur l'encart.

**Implémentation :**
```javascript
const returnToSite = () => {
  setScreen('PAGE0');
  // Après la transition, scroller jusqu'à l'encart
  setTimeout(() => {
    document.getElementById('encart-souscription')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }, 300);
};
```

**Écrans concernés :**

| Écran | Élément | Action |
|---|---|---|
| WF0-step3 | CTA « Retour au site butagaz.fr » | `returnToSite()` |
| WF1-sortie | Lien « Retour au site butagaz.fr » | `returnToSite()` |
| WF2-sortie | Lien « Retour au site butagaz.fr » | `returnToSite()` |
| WF4-sortie | Lien « Retour au site butagaz.fr » | `returnToSite()` |
| WF5b (apparente) | CTA « ← Retour au site butagaz.fr » | `returnToSite()` |
| WF5b (souterraine) | CTA « ← Retour au site butagaz.fr » | `returnToSite()` |

La transition vers PAGE0 utilise le même slide horizontal inversé (droite → gauche, 250ms ease-out) que les retours arrière dans le tunnel.

---

### 4. Mise à jour des scénarios

Tous les scénarios commencent maintenant à PAGE0. Mettre à jour les tableaux de scénarios dans le state :

**Scénario A (Calculateur)** : PAGE0 → [clic Souscrire] → WF1 → ... → WF5b → [clic Retour site] → PAGE0

**Scénario B (Frustré pressé)** : PAGE0 → [clic Souscrire] → WF1 → ... → WF4-sortie → [clic Retour site] → PAGE0

**Scénario C (Prudent méfiant)** : PAGE0 → [clic Souscrire] → WF1 → WF1bis → WF2 (hésite) → [footer être rappelé] → modale

**Scénario D (Accompagné)** : PAGE0 → [clic Être rappelé] → WF0-step2 → WF0-step3 → [clic Retour site] → PAGE0

**Scénario E (Non éligible)** : PAGE0 → [clic Souscrire] → WF1 → WF1-sortie → [clic Retour site] → PAGE0

**Scénario F (Locataire)** : PAGE0 → [clic Souscrire] → WF1 → WF1bis → WF2 → WF2-sortie → [clic Retour site] → PAGE0

Dans le mode panorama, PAGE0 apparaît comme la première miniature de chaque scénario avec :
- Nom : « Site butagaz.fr »
- Résumé : « Encart de souscription intégré »
- Badge : vert (pas de sortie ici)

---

### 5. Mise à jour du panneau gauche « Annotations UX » pour PAGE0

```
PAGE0 — Annotation UX :
"Page d'offre butagaz.fr avec l'encart de souscription intégré.
L'encart est le seul élément interactif du prototype : les zones 
grisées représentent le contenu de la page hôte, non pertinent 
pour tester ce parcours.

Dans la vraie implémentation, l'encart est injectable (section 
indépendante) et peut être placé sur n'importe quelle page de 
butagaz.fr ou landing page SEA.

Décision de placement : au niveau du fold, visible sans scroll 
sur les formats desktop. Sur mobile, accessible après le chapeau 
de l'offre."
```

---

### 6. Toggle AVEC OFFRE dans l'interface du prototype

Ajouter dans la barre de contrôle du prototype (hors frame mobile) un toggle visible :

```
[ ] Activer l'offre 200 €
```

Ce toggle contrôle l'état global `offerActive`. Quand actif :
- PAGE0 affiche le bloc offre vert et réordonne les CTAs (Souscrire en premier)
- WF5b navigue vers la version « citerne apparente » par défaut
- Quand inactif : PAGE0 affiche les CTAs dans l'ordre standard, WF5b gère l'état selon le type de citerne saisi en WF3

---

## Règles à ne pas enfreindre pendant cette mise à jour

1. Ne pas casser la logique de navigation existante entre WF1 et WF5b.
2. Ne pas réintroduire WF0 comme écran autonome.
3. Ne pas réintroduire WF4-sans-facture ou WF6-bonus.
4. Le toggle AVEC OFFRE est dans l'interface du prototype, pas dans le frame mobile.
5. PAGE0 n'a pas de header « Butagaz + Retour au site » (c'est une vraie page, pas un écran du tunnel).
6. PAGE0 n'apparaît pas dans la barre de progression (5 cercles, commence à WF1).
7. L'identifiant `encart-souscription` doit être attaché au div de l'encart pour que le scroll automatique fonctionne.
