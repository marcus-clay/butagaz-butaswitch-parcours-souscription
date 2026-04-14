# Prompt Claude Code — Butaswitch v3
# Version couleur Butagaz + retours workshop du 13 avril + responsive desktop
# Ce prompt est un complément au fichier JSX existant. Applique ces changements sans recoder depuis zéro.

---

## 1. DESIGN SYSTEM BUTAGAZ — TOKENS À APPLIQUER

Remplace tous les styles CSS inline actuels par ces tokens. Déclare-les en variables CSS dans un bloc `:root` global en haut du fichier.

```css
:root {
  /* Couleurs primaires */
  --but-blue: #439fdb;
  --but-blue-pastel: #ecf5fb;
  --but-red: #ec3431;
  --but-yellow: #ffeb36;
  --but-green: #4ac77c;
  --but-grey: #8b9aa4;
  --but-solid-grey: #666f7c;
  --but-dark: #1a1b20;
  --but-dark-accent: #2d2d32;

  /* Dégradés */
  --but-grad-red: linear-gradient(180deg, #ff7c44, #ec3431);
  --but-grad-blue: linear-gradient(180deg, #8fd2e1, #1a86cc);
  --but-grad-green: linear-gradient(143deg, #88e7a3, #2aba5b);
  --but-grad-yellow: linear-gradient(177deg, #ffed48, #ffc42b);
  --but-grad-dark: linear-gradient(180deg, #2d2d32, #232429);

  /* Typographie */
  --font-main: 'Nunito', system-ui, -apple-system, sans-serif;
  /* Note : Urban Rounded est propriétaire. Utiliser Nunito via Google Fonts comme approximation correcte (formes arrondies, mêmes graisses). Charger via : https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap */

  /* Rayon */
  --radius-pill: 999px;
  --radius-card: 16px;
  --radius-input: 999px;

  /* Espacements */
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

### Correspondances wireframe → couleur Butagaz

| Élément wireframe | Style Butagaz |
|---|---|
| Fond page | `#ffffff` |
| Titre H1 | 28px, font-weight 700, color `#439fdb` |
| Titre H2 | 22px, font-weight 600, color `#439fdb` |
| Corps de texte | 15px, font-weight 400, color `#1a1b20` |
| Label champ | 13px, font-weight 500, color `#439fdb` |
| Placeholder | color `#8b9aa4` |
| Input (défaut) | border 1.5px solid `#439fdb`, border-radius `999px`, padding 12px 18px, bg white |
| Input (focus) | border 2px solid `#439fdb`, outline none |
| Input (erreur) | border 1.5px solid `#ec3431` + message rouge 11px sous le champ |
| Input (désactivé) | border 1.5px solid `#c8d4da`, bg `#f7f9fa` |
| **CTA primaire** | `background: linear-gradient(143deg,#88e7a3,#2aba5b); color: #0d4a23; border-radius: 999px; padding: 14px 24px; font-weight: 600; font-size: 15px` |
| **CTA secondaire** | `background: transparent; border: 1.5px solid #439fdb; color: #439fdb; border-radius: 999px; padding: 14px 24px` |
| **CTA danger / sortie** | `background: linear-gradient(180deg,#ff7c44,#ec3431); color: white; border-radius: 999px` |
| **CTA aide** | `background: linear-gradient(177deg,#ffed48,#ffc42b); color: #7a5800; border-radius: 999px` |
| Bloc réassurance (bleu) | bg `#ecf5fb`, border-left 3px solid `#439fdb`, border-radius 12px, padding 14px |
| Bloc infobulle | bg `#fffbe6`, border 1px solid `#ffc42b`, border-radius 10px, padding 12px, font-size 13px |
| Bloc infobulle biopropane (auto) | même style + border `#4ac77c`, bg `rgba(74,199,124,0.08)` |
| Bloc succès upload | bg `rgba(74,199,124,0.1)`, border 1.5px solid `#4ac77c`, border-radius 12px |
| Bloc erreur upload | bg `rgba(236,52,49,0.06)`, border 1.5px solid `#ec3431`, border-radius 12px |
| Bloc offre | bg `linear-gradient(135deg,#ecf5fb,#d4edff)`, border 1.5px solid `#439fdb`, border-radius 14px |
| Badge Biopropane | bg `rgba(74,199,124,0.15)`, color `#1c7a46`, border-radius 999px, padding 4px 12px, font-size 12px |
| Badge Offre | bg `rgba(255,235,54,0.25)`, color `#7a5800`, border-radius 999px |
| Footer bandeau | bg `#f7f9fa`, border-top `0.5px solid #e2e8ed` |
| Barre de progression — actif | bg `#439fdb`, color white |
| Barre de progression — passé | bg `#1a86cc`, color white |
| Barre de progression — futur | bg `#e2e8ed`, color `#8b9aa4` |
| Connecteur barre | bg `#e2e8ed` (futur) ou `#439fdb` (passé) |
| Checkbox cochée | border `#439fdb`, bg `#439fdb`, checkmark white |
| Radio sélectionné | border `#439fdb`, point central `#439fdb` |
| Bandeau conditionnel WF1 | bg `#fffbe6`, border 1px solid `#ffc42b`, border-radius 10px |

---

## 2. RESPONSIVE DESKTOP

### Breakpoints
- Mobile : < 768px → frame centré, pleine largeur
- Tablet : 768–1199px → frame centré max-width 480px sur fond `#f0f4f8`
- Desktop : ≥ 1200px → layout 3 colonnes (voir ci-dessous)

### Layout desktop (≥ 1200px)

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER DESKTOP (pleine largeur, fond blanc, border-bottom)          │
│  [Logo Butagaz] ← à gauche        [Besoin d'aide ?] [Retour site] →  │
├────────────────┬────────────────────────┬──────────────────────────┤
│                │                        │                          │
│  Panneau UX    │   Frame mobile centré  │  Panneau scénario        │
│  (annotations) │   max-width: 480px     │  (contexte)              │
│  320px         │   bg: white            │  320px                   │
│  bg: #f7f9fa   │   border-radius: 20px  │  bg: #f7f9fa             │
│  padding: 24px │   box-shadow: md       │  padding: 24px           │
│                │   padding: 0           │                          │
└────────────────┴────────────────────────┴──────────────────────────┘
```

Implémentation CSS :
```css
.prototype-wrapper {
  min-height: 100vh;
  background: #f0f4f8;
}

.prototype-layout {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 24px;
  align-items: flex-start;
}

.panel-left,
.panel-right {
  width: 300px;
  flex-shrink: 0;
  display: none; /* masqué sous 1200px */
}

@media (min-width: 1200px) {
  .panel-left,
  .panel-right {
    display: block;
  }
}

.mobile-frame {
  width: 100%;
  max-width: 480px;
  min-height: 812px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.12);
  overflow: hidden;
  flex-shrink: 0;
}

@media (max-width: 767px) {
  .mobile-frame {
    border-radius: 0;
    box-shadow: none;
    max-width: 100%;
  }
  .prototype-layout {
    padding: 0;
  }
}
```

### Header desktop

Sur desktop (≥ 768px), afficher un header pleine largeur au-dessus du layout :

```
┌──────────────────────────────────────────────────────────────────────┐
│  [Logo img]  Souscription gaz en citerne    [Besoin d'aide ?]  [× Retour au site] │
│  border-bottom: 1px solid #e2e8ed, padding: 12px 24px, bg: white    │
└──────────────────────────────────────────────────────────────────────┘
```

Sur mobile, le header reste interne au frame (comportement actuel).

Le bouton "Besoin d'aide ?" dans le header desktop :
- Au clic : affiche un tooltip/popover avec le numéro : « 01 XX XX XX XX — lun-ven 9h-18h »
- Style : `background: linear-gradient(177deg,#ffed48,#ffc42b); color: #7a5800; border-radius: 999px; padding: 8px 16px; font-size: 13px`

### Frame mobile sur desktop

Le frame mobile garde ses dimensions internes (375px de design, max-width 480px en rendu). Il scroll normalement en son sein. Pas de double scrollbar : `overflow-y: auto` sur le frame, `overflow: hidden` sur le wrapper.

---

## 3. RETOURS WORKSHOP — MODIFICATIONS FONCTIONNELLES

### 3.1 WF1 — Supprimer le bouton « Continuer »

Dans WF1 (Qualification), supprimer le bouton « Continuer ». Le clic sur un bloc déclenche directement la navigation :
- Bloc 1 (changer de fournisseur) → affiche le bandeau conditionnel jaune SOUS le bloc, puis naviguer automatiquement vers WF1bis après 400ms.
- Bloc 2 ou 3 → naviguer directement vers WF1-sortie.

Ne pas ajouter de bouton explicite. La progression est portée par le clic sur le bloc.

### 3.2 WF1-sortie — Rediriger vers WF0 (PAGE0)

WF1-sortie ne contient plus de formulaire inline de rappel. Le prospect n'a pas encore saisi ses coordonnées à cette étape.

Nouvelle structure WF1-sortie :
```
Titre : « Parlons de votre projet »
Corps : « Pour votre situation, nos conseillers vous accompagnent directement. »
CTA 1 (jaune) : « Aide et contact » → ouvre modale "Être rappelé"
CTA 2 (outline bleu) : « Retour au site butagaz.fr » → PAGE0
```
Supprimer : le récapitulatif pré-rempli, la checkbox RGPD et le bouton « Confirmer et Envoyer » de WF1-sortie.

### 3.3 Header — Lien « Besoin d'aide » révèle le numéro

Dans le header interne du tunnel (mobile frame), remplacer « Retour au site » par deux éléments :
- Gauche : « ← Retour au site » (lien texte, color `#439fdb`)
- Droite : bouton « Besoin d'aide ? » (style jaune gradient)

Au clic sur « Besoin d'aide ? » :
```jsx
// Afficher un mini-popover sous le bouton :
<div style={{
  position: 'absolute',
  top: '100%',
  right: 0,
  background: 'white',
  border: '1px solid #e2e8ed',
  borderRadius: 12,
  padding: '12px 16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  zIndex: 100,
  fontSize: 14,
  whiteSpace: 'nowrap'
}}>
  📞 <a href="tel:01XXXXXXXX" style={{color: '#439fdb', fontWeight: 600}}>01 XX XX XX XX</a>
  <div style={{fontSize: 12, color: '#8b9aa4', marginTop: 4}}>Lun-ven, 9h-17h</div>
</div>
```
Fermer le popover au clic en dehors.

### 3.4 « Appeler un conseiller » → lien tel:// simple

Partout dans le prototype où apparaît un CTA ou un bloc « Appeler un conseiller » qui déploie un contenu supplémentaire : le remplacer par un lien direct `<a href="tel:01XXXXXXXX">`. Pas de déplié, pas de bloc secondaire.

Style du bouton appel :
```jsx
<a href="tel:01XXXXXXXX" style={{
  display: 'block',
  padding: '14px 24px',
  background: 'linear-gradient(177deg,#ffed48,#ffc42b)',
  color: '#7a5800',
  borderRadius: 999,
  textAlign: 'center',
  fontWeight: 600,
  fontSize: 15,
  textDecoration: 'none'
}}>
  📞 Appeler le 01 XX XX XX XX
  <div style={{fontSize: 12, fontWeight: 400, marginTop: 2}}>Lun-ven, 9h-17h</div>
</a>
```

### 3.5 Créneau horaire sur WF0 et WF1-sortie

Le sélecteur de préférence horaire (Matin / Après-midi) doit apparaître :
- Dans WF0-step2 (formulaire de rappel) : déjà présent, vérifier qu'aucune option n'est pré-sélectionnée par défaut.
- Dans la modale « Être rappelé » (accessible depuis le footer et les écrans de sortie) : ajouter le sélecteur Matin / Après-midi après le champ Téléphone. Aucune option pré-sélectionnée par défaut.

```jsx
// Composant sélecteur créneaux - aucune valeur par défaut
const [creneau, setCreneau] = useState(null); // null = pas de sélection

<div style={{ display: 'flex', gap: 8 }}>
  {['Matin', 'Après-midi'].map(opt => (
    <button
      key={opt}
      onClick={() => setCreneau(opt)}
      style={{
        flex: 1,
        padding: '10px 16px',
        borderRadius: 999,
        border: `1.5px solid ${creneau === opt ? '#439fdb' : '#e2e8ed'}`,
        background: creneau === opt ? '#ecf5fb' : 'white',
        color: creneau === opt ? '#439fdb' : '#666f7c',
        fontWeight: creneau === opt ? 600 : 400,
        fontSize: 14,
        cursor: 'pointer'
      }}
    >
      {opt}
    </button>
  ))}
</div>
```

### 3.6 WF2 — Checkbox « citerne = domicile » fonctionnelle

La checkbox « La citerne est à la même adresse que mon domicile » doit être cochée par défaut. Quand elle est décochée, afficher le champ « Adresse de la citerne » avec une liste de suggestions simulée (autocomplete) :

```jsx
const [citerneMemeDomicile, setCiterneMemeDomicile] = useState(true);

// Champ conditionnel avec slide-down
{!citerneMemeDomicile && (
  <div style={{ animation: 'slideDown 200ms ease-out' }}>
    <label style={{ fontSize: 13, fontWeight: 500, color: '#439fdb' }}>
      Adresse de la citerne *
    </label>
    <input
      type="text"
      placeholder="Commencez à taper l'adresse..."
      style={{ /* styles input Butagaz */ }}
    />
    {/* Suggestions simulées */}
    <div style={{ border: '1px solid #e2e8ed', borderRadius: 12, marginTop: 4, overflow: 'hidden' }}>
      {['12 rue des Lilas, 44300 Nantes', '8 chemin du Lavoir, 35000 Rennes'].map(s => (
        <div key={s} style={{ padding: '10px 14px', borderBottom: '0.5px solid #f0f4f8', fontSize: 14, cursor: 'pointer' }}>{s}</div>
      ))}
    </div>
  </div>
)}
```

### 3.7 WF4 — Infobulle biopropane automatique si option sélectionnée

Quand l'utilisateur sélectionne « Oui, 20% biopropane » ou « Oui, 100% biopropane », afficher automatiquement l'infobulle (sans clic sur le ⓘ) :

```jsx
const [bioChoice, setBioChoice] = useState('non');
const showBioInfo = bioChoice !== 'non';

// Infobulle conditionnelle
{showBioInfo && (
  <div style={{
    background: 'rgba(74,199,124,0.08)',
    border: '1px solid #4ac77c',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    fontSize: 13,
    color: '#1c7a46',
    animation: 'slideDown 200ms ease-out'
  }}>
    ⓘ Cette option est payante. Le biopropane est une version du propane issue de ressources renouvelables. Son coût est supérieur au propane standard — ce surcoût sera précisé dans votre proposition de contrat.
  </div>
)}
```

### 3.8 WF4 — Ordre des boutons upload adaptatif desktop/mobile

Sur les sous-écrans Mode B (Étape A et B1), adapter l'ordre selon le contexte :

```jsx
// Détecter le contexte
const isMobile = window.innerWidth < 768; // ou utiliser un state via resize event

// Étape A - ordre des CTAs
{isMobile ? (
  <>
    <button /* Ma facture est prête → */ />
    <button /* Prendre une photo */ />
    <button /* Choisir un fichier sur mon appareil */ />
  </>
) : (
  <>
    <button /* Choisir un fichier sur mon appareil */ /> {/* Desktop : fichier en premier */}
    <button /* Ma facture est prête → */ />
  </>
)}
```

### 3.9 Harmoniser « 24h ouvrés » partout

Remplacer toutes les occurrences de :
- « sous 24 heures » → « sous 24h ouvrées »
- « sous 48h ouvrées » → remplacer UNIQUEMENT dans les messages de confirmation par « sous 24h ouvrées »

**Exception** : le wording « proposition de contrat personnalisée sous 48h ouvrées » dans WF5 et WF5b reste à 48h (délai réel de traitement du dossier complet). Seuls les messages de rappel téléphonique passent à 24h.

### 3.10 Validation upload — Rejeter les fichiers non PDF/JPG/PNG

Dans la simulation d'upload (Mode B et Mode A), vérifier le type MIME ou l'extension du fichier sélectionné :

```jsx
const handleFileSelect = (file) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const allowedExt = ['.pdf', '.jpg', '.jpeg', '.png'];
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!allowed.includes(file.type) && !allowedExt.includes(ext)) {
    // → Naviguer vers Étape C2 (erreur) avec message spécifique
    setUploadError('FORMAT');
    setUploadSubscreen('ERROR');
    return;
  }
  
  // Upload simulé normal
  simulateUpload(file);
};
```

Dans Étape C2, adapter le message selon le type d'erreur :
- `FORMAT` → « Ce type de fichier n'est pas accepté. Utilisez un PDF, JPG ou PNG. »
- `BLUR` (erreur photo) → « La photo est floue ou le format n'est pas reconnu. »

---

## 4. COMPOSANTS VISUELS DESKTOP — PANNEAUX LATÉRAUX

Les panneaux gauche (annotations UX) et droit (contexte scénario) sur desktop.

```jsx
// Panneau latéral - style commun
const PanelStyle = {
  background: 'white',
  borderRadius: 16,
  padding: 20,
  border: '0.5px solid #e2e8ed',
  fontSize: 13,
  color: '#2d2d32',
  lineHeight: 1.6,
  position: 'sticky',
  top: 24,
  maxHeight: 'calc(100vh - 48px)',
  overflowY: 'auto'
};

// Titre panneau
const PanelTitleStyle = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#439fdb',
  marginBottom: 12
};

// Badge friction
const FrictionBadge = ({ level }) => {
  const colors = {
    'FAIBLE': { bg: 'rgba(74,199,124,0.15)', color: '#1c7a46' },
    'MOYENNE': { bg: 'rgba(255,196,43,0.2)', color: '#7a5800' },
    'ÉLEVÉE': { bg: 'rgba(236,52,49,0.1)', color: '#b02624' },
    'MAXIMALE': { bg: 'rgba(236,52,49,0.2)', color: '#8a1a18' }
  };
  return (
    <span style={{
      padding: '3px 10px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      ...colors[level]
    }}>
      Friction : {level}
    </span>
  );
};
```

---

## 5. BARRE DE PROGRESSION — STYLE BUTAGAZ

```jsx
const ProgressBar = ({ currentStep }) => (
  <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', justifyContent: 'center', gap: 0 }}>
    {[1,2,3,4,5].map((step, i) => (
      <React.Fragment key={step}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 600,
          background: step < currentStep ? '#1a86cc'
                    : step === currentStep ? '#439fdb'
                    : '#e2e8ed',
          color: step <= currentStep ? 'white' : '#8b9aa4',
          flexShrink: 0,
          cursor: step < currentStep ? 'pointer' : 'default',
          transition: 'all 200ms'
        }}>
          {step < currentStep ? '✓' : step}
        </div>
        {i < 4 && (
          <div style={{
            flex: 1,
            height: 2,
            background: step < currentStep ? '#439fdb' : '#e2e8ed',
            minWidth: 24,
            transition: 'background 200ms'
          }} />
        )}
      </React.Fragment>
    ))}
  </div>
);
```

---

## 6. ANIMATIONS CSS

Ajouter dans le bloc `<style>` global :

```css
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* Classe utilitaire pour la transition d'écran */
.screen-enter { animation: slideInRight 250ms ease-out; }
.screen-exit  { animation: slideInLeft 250ms ease-out; }
```

---

## 7. PAGE0 — STYLE BUTAGAZ

L'encart souscription dans PAGE0 doit utiliser les tokens Butagaz :

```jsx
// Encart souscription - style Butagaz
<div
  id="encart-souscription"
  style={{
    background: 'white',
    border: '2px solid #439fdb',
    borderRadius: 20,
    padding: 24,
    margin: '0 16px',
    boxShadow: '0 4px 24px rgba(67,159,219,0.15)'
  }}
>
  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#439fdb', marginBottom: 4 }}>
    Zone active du prototype
  </div>
  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#439fdb', marginBottom: 16 }}>
    Vous souhaitez changer de fournisseur ?
  </h2>
  {/* CTAs dans l'ordre : Souscrire (vert) → Être rappelé (outline) → Appeler (jaune) */}
  <button style={{ /* CTA vert gradient */ }}>Souscrire en ligne →</button>
  <button style={{ /* CTA outline bleu */ }}>Être rappelé</button>
  <a href="tel:01XXXXXXXX" style={{ /* CTA jaune gradient */ }}>📞 Appeler un conseiller</a>
</div>
```

---

## 8. LOGO

Le logo Butagaz sera fourni par Victor comme fichier image (PNG ou SVG). Le placer dans le header ainsi :

```jsx
// Header du tunnel
<header style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderBottom: '0.5px solid #e2e8ed',
  background: 'white'
}}>
  <img
    src="./logo-butagaz.svg"  // ← Victor intègre le fichier
    alt="Butagaz"
    style={{ height: 32 }}
  />
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <button /* Besoin d'aide */ />
    <button /* Retour site */ />
  </div>
</header>
```

---

## 9. RÈGLES CRITIQUES DE CETTE MISE À JOUR

1. Tous les `#1A1A1A` (fond bouton primaire wireframe) → remplacer par le gradient vert Butagaz `linear-gradient(143deg,#88e7a3,#2aba5b)` pour les CTA principaux de progression (Continuer, Valider, C'est parti). Color: #0d4a23.
2. Les `#CC0000` (rouge erreur wireframe) → remplacer par `#ec3431`.
3. Les blocs bleus `#EFF6FF` (réassurance wireframe) → remplacer par `#ecf5fb`.
4. Les blocs jaunes `#FFF9E6` (infobulles wireframe) → remplacer par `#fffbe6` avec border `#ffc42b`.
5. Tous les border-radius `10px` sur les inputs → remplacer par `999px` (pill shape, standard Butagaz).
6. Ne pas toucher aux wordings validés par Pierre-Louis (RGPD, biopropane, contrat vs devis).
7. Le logo est une image externe — ne pas l'inliner, ne pas l'inventer.
8. Sur mobile, les panneaux gauche/droit sont masqués. Le bouton « Masquer les annotations » reste disponible sur desktop.
9. La charte Butagaz utilise Urban Rounded en propriétaire. Utiliser Nunito (Google Fonts) comme substitut — charger via `<link>` dans le head.
10. Garder le fichier en JSX unique. Ne pas créer de fichiers séparés pour les styles.
