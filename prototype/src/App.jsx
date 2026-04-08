// Butaswitch — Prototype interactif v2
// Fichier unique React JSX — Simon White / Victor Soussan Studio
// Avril 2026 — Intègre les décisions FigJam (Pierre-Louis du Chazaud, Élodie Jolly, Simon White)

import { useState, useEffect, useRef } from 'react';

// ─── CSS GLOBAL ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: #D8D8D8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  color: #1A1A1A;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
input, textarea, select, button { font-family: inherit; font-size: inherit; }
button { cursor: pointer; }

/* Screen animation */
.screen-anim { animation: screenIn 0.25s ease-out; }
@keyframes screenIn { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }

/* Tooltip */
.tooltip-anim { animation: ttIn 0.15s ease-out; }
@keyframes ttIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

/* Slide down for conditional fields */
.slide-down { animation: sdIn 0.2s ease-out; }
@keyframes sdIn { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 300px; } }

/* Upload progress bar */
.upbar-track { height: 4px; background: #E0E0E0; border-radius: 2px; margin-top: 10px; overflow: hidden; }
.upbar-fill { height: 100%; background: #1A1A1A; border-radius: 2px; transition: width 0.08s linear; }

/* Choice blocks */
.choice-block { border: 1px solid #E0E0E0; border-radius: 10px; padding: 16px; margin-bottom: 10px; cursor: pointer; transition: border-color 0.1s, background 0.1s; }
.choice-block:hover { border-color: #999; }
.choice-block.selected { border: 2px solid #1A1A1A !important; background: #F5F5F5; }

/* Upload zone */
.upload-empty { border: 2px dashed #D0D0D0; border-radius: 10px; padding: 20px; text-align: center; cursor: pointer; transition: border-color 0.1s; }
.upload-empty:hover { border-color: #999; }

/* Input focus */
.field-input { width: 100%; min-height: 40px; border: 1px solid #D0D0D0; border-radius: 8px; padding: 0 12px; font-size: 15px; color: #1A1A1A; background: #FFF; transition: border-color 0.1s; outline: none; }
.field-input:focus { border: 2px solid #1A1A1A; }
.field-input.err { border-color: #CC0000; }
textarea.field-input { padding: 10px 12px; resize: vertical; min-height: 80px; }

/* Buttons */
.btn-primary { display: block; width: 100%; padding: 14px; background: #1A1A1A; color: #FFF; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; text-align: center; transition: background 0.1s; }
.btn-primary:hover { background: #333; }
.btn-secondary { display: block; width: 100%; padding: 12px; background: transparent; color: #666; border: 1px solid #D0D0D0; border-radius: 10px; font-size: 15px; cursor: pointer; text-align: center; transition: border-color 0.1s; }
.btn-secondary:hover { border-color: #999; }
.btn-sm { display: inline-flex; align-items: center; padding: 6px 12px; background: #FFF; color: #666; border: 1px solid #D0D0D0; border-radius: 6px; font-size: 12px; cursor: pointer; transition: border-color 0.1s; gap: 4px; }
.btn-sm:hover { border-color: #999; }

/* Radio / Checkbox */
input[type="radio"], input[type="checkbox"] { accent-color: #1A1A1A; width: 16px; height: 16px; cursor: pointer; flex-shrink: 0; }
input[type="file"] { display: none; }

/* Link */
.lnk { text-decoration: underline; cursor: pointer; color: #1A1A1A; }
.lnk-gray { text-decoration: underline; cursor: pointer; color: #666; }

/* Scrollbars */
.scroll-h { overflow-x: auto; }
.scroll-h::-webkit-scrollbar { height: 5px; }
.scroll-h::-webkit-scrollbar-thumb { background: #BBB; border-radius: 3px; }
.mobile-scroll::-webkit-scrollbar { width: 3px; }
.mobile-scroll::-webkit-scrollbar-thumb { background: #DDD; border-radius: 2px; }

/* Thumbnail hover */
.screen-thumb:hover .thumb-frame { border-color: #888 !important; box-shadow: 0 3px 10px rgba(0,0,0,0.12); }

/* Tab active */
.tab-btn { padding: 6px 14px; border-radius: 6px; font-size: 13px; border: none; cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: background 0.1s, color 0.1s; }
.tab-btn.active { background: #1A1A1A; color: #FFF; font-weight: 600; }
.tab-btn:not(.active) { background: #F0F0F0; color: #666; }
.tab-btn:not(.active):hover { background: #E0E0E0; }

/* Panorama scenario row */
.pano-scenario-row { margin-bottom: 24px; background: #FFF; border-radius: 10px; overflow: hidden; }
.pano-scenario-header { padding: 12px 16px; border-bottom: 1px solid #F0F0F0; display: flex; align-items: center; gap: 12px; }
.panorama-row { display: flex; flex-direction: row; align-items: flex-start; gap: 0; padding: 16px; overflow-x: auto; }
.panorama-row::-webkit-scrollbar { height: 5px; }
.panorama-row::-webkit-scrollbar-thumb { background: #BBB; border-radius: 3px; }

/* Responsive */
@media (max-width: 700px) {
  .nav-panels { display: none !important; }
  .nav-main { padding: 8px !important; }
}
@media (max-width: 430px) {
  .mobile-frame-wrap { transform: scale(0.88); transform-origin: top center; }
}

/* Overlay */
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 16px; }

/* Badge */
.badge-ok { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; background: #DCFCE7; color: #166534; }
.badge-branch { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; background: #FEF3C7; color: #92400E; }
.badge-exit { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; background: #FEE2E2; color: #DC2626; }
`;

// ─── SCENARIO DATA ─────────────────────────────────────────────────────────────
const SCENARIOS = {
  A: {
    id: 'A', label: 'A. Calculateur', shortDesc: 'Jean Moreau — Nantes — Parcours complet',
    screens: ['PAGE0','WF1','WF1bis','WF2','WF3','WF4','WF5','WF5b'],
    screenChoices: { WF1: 'changer', WF2: 'proprietaire', WF3_type: 'apparente', WF3_conserver: 'oui' },
    form: {
      civilite: 'M.', prenom: 'Jean', nom: 'Moreau',
      adresse: '15 rue des Chênes, 44300 Nantes',
      telephone: '06 78 45 12 89', email: 'jean.moreau@orange.fr',
      statut: 'proprietaire', citerneMemeDomicile: true, adresseCiterne: '',
      preferenceAppel: 'indifferent', rgpd: true,
      citerneType: 'apparente', conserverType: 'oui',
      factures: [
        { name: 'facture_primagaz_jan.pdf', size: '245 Ko' },
        { name: 'facture_primagaz_avr.pdf', size: '312 Ko' },
        { name: 'facture_primagaz_juil.pdf', size: '289 Ko' },
      ],
      biopropane: '20', messageRappel: '', rgpdRappel: false,
    },
  },
  B: {
    id: 'B', label: 'B. Frustré pressé', shortDesc: 'Sophie Duval — Rennes — Sort sans factures',
    screens: ['PAGE0','WF1','WF1bis','WF2','WF3','WF4','WF4-sortie'],
    screenChoices: { WF1: 'changer', WF2: 'proprietaire', WF3_type: 'enfouie', WF3_conserver: 'oui' },
    form: {
      civilite: 'Mme', prenom: 'Sophie', nom: 'Duval',
      adresse: '8 chemin du Lavoir, 35000 Rennes',
      telephone: '07 65 23 41 98', email: 's.duval@gmail.com',
      statut: 'proprietaire', citerneMemeDomicile: true, adresseCiterne: '',
      preferenceAppel: 'indifferent', rgpd: true,
      citerneType: 'enfouie', conserverType: 'oui',
      factures: [null, null, null],
      biopropane: 'non', messageRappel: '', rgpdRappel: false,
    },
  },
  C: {
    id: 'C', label: 'C. Prudent méfiant', shortDesc: 'Françoise Petit — Poitiers — Sort via footer',
    screens: ['PAGE0','WF1','WF1bis','WF2','MODAL'],
    screenChoices: { WF1: 'changer', WF2: '' },
    form: {
      civilite: 'Mme', prenom: 'Françoise', nom: 'Petit',
      adresse: '3 impasse des Vignes, 86000 Poitiers',
      telephone: '', email: '',
      statut: '', citerneMemeDomicile: true, adresseCiterne: '',
      preferenceAppel: '', rgpd: false,
      citerneType: '', conserverType: '',
      factures: [null, null, null],
      biopropane: 'non', messageRappel: '', rgpdRappel: false,
    },
  },
  D: {
    id: 'D', label: 'D. Accompagné', shortDesc: 'Marcel Lefèvre — Bergerac — Être rappelé',
    screens: ['PAGE0','WF0-step2','WF0-step3'],
    screenChoices: {},
    form: {
      civilite: 'M.', prenom: 'Marcel', nom: 'Lefèvre',
      adresse: "2 route de l'Église, 24100 Bergerac",
      telephone: '05 53 12 34 56', email: '',
      statut: '', citerneMemeDomicile: true, adresseCiterne: '',
      preferenceAppel: '', rgpd: false,
      citerneType: '', conserverType: '',
      factures: [null, null, null],
      biopropane: 'non', messageRappel: '', rgpdRappel: false,
    },
  },
  E: {
    id: 'E', label: 'E. Non éligible', shortDesc: 'Succession — Sort en WF1',
    screens: ['PAGE0','WF1','WF1-sortie'],
    screenChoices: { WF1: 'succession' },
    form: {
      civilite: 'Mme', prenom: 'Marie', nom: 'Dupont',
      adresse: '', telephone: '06 12 34 56 78', email: 'marie.dupont@email.fr',
      statut: '', citerneMemeDomicile: true, adresseCiterne: '',
      preferenceAppel: '', rgpd: false,
      citerneType: '', conserverType: '',
      factures: [null, null, null],
      biopropane: 'non', messageRappel: '', rgpdRappel: false,
    },
  },
  F: {
    id: 'F', label: 'F. Locataire', shortDesc: 'Claire Martin — Bordeaux — Locataire',
    screens: ['PAGE0','WF1','WF1bis','WF2','WF2-sortie'],
    screenChoices: { WF1: 'changer', WF2: 'locataire' },
    form: {
      civilite: 'Mme', prenom: 'Claire', nom: 'Martin',
      adresse: '7 allée des Tilleuls, 33000 Bordeaux',
      telephone: '06 45 67 89 01', email: 'c.martin@gmail.com',
      statut: 'locataire', citerneMemeDomicile: true, adresseCiterne: '',
      preferenceAppel: 'indifferent', rgpd: true,
      citerneType: '', conserverType: '',
      factures: [null, null, null],
      biopropane: 'non', messageRappel: '', rgpdRappel: false,
    },
  },
};

const EMPTY_FORM = {
  civilite: '', prenom: '', nom: '', adresse: '', telephone: '', email: '',
  statut: '', citerneMemeDomicile: true, adresseCiterne: '', preferenceAppel: '',
  rgpd: false, citerneType: '', conserverType: '',
  factures: [null, null, null],
  biopropane: 'non', messageRappel: '', rgpdRappel: false,
};

const SCREEN_LABELS = {
  'PAGE0': 'Site butagaz.fr', 'WF0-step2': 'Formulaire rappel', 'WF0-step3': 'Confirmation rappel',
  'WF1': 'Qualification', 'WF1bis': 'Prérequis', 'WF1-sortie': 'Non éligible',
  'WF2': 'Coordonnées', 'WF2-sortie': 'Locataire',
  'WF3': 'Installation', 'WF4': 'Factures', 'WF4-sortie': 'Pas de factures',
  'WF5': 'Synthèse', 'WF5b': 'Confirmation', 'MODAL': 'Rappel (modale)',
};

const BADGE_TYPE = {
  'PAGE0': 'ok', 'WF0-step2': 'ok', 'WF0-step3': 'ok',
  'WF1': 'branch', 'WF1bis': 'ok', 'WF1-sortie': 'exit',
  'WF2': 'branch', 'WF2-sortie': 'exit',
  'WF3': 'ok', 'WF4': 'branch', 'WF4-sortie': 'exit',
  'WF5': 'ok', 'WF5b': 'ok', 'MODAL': 'exit',
};

const STEP_FOR_SCREEN = {
  'WF1': 1, 'WF1bis': 1, 'WF2': 2, 'WF3': 3, 'WF4': 4, 'WF5': 5, 'WF5b': 5,
};

const ANNOTATIONS = {
  'PAGE0': "Page d'offre butagaz.fr avec l'encart de souscription intégré. L'encart est le seul élément interactif du prototype à cette étape : les zones grisées représentent le contenu de la page hôte, non pertinent pour le test de ce parcours. Dans la vraie implémentation, l'encart est injectable (balise <section> indépendante) et peut être placé sur n'importe quelle page de butagaz.fr ou landing page SEA.",
  'WF0-step2': 'Flow de rappel hors tunnel. Collecte minimale. RGPD obligatoire car données commerciales.',
  'WF0-step3': 'Écran de confirmation. Rassure le prospect sur le délai et les horaires de rappel.',
  'WF1': "Étape 1 du tunnel. Le prospect a cliqué « Souscrire en ligne » depuis l'encart sur butagaz.fr. Blocs visuels cliquables. Seul le choix 1 continue dans le tunnel. Le bandeau info conditionnel apparaît directement sous le bloc sélectionné, pas en bas de page.",
  'WF1bis': "Écran de préparation, pas de collecte. Les 3 factures sont toutes obligatoires (décision Pierre-Louis du Chazaud). Bloc jaune pour aider à localiser les factures.",
  'WF1-sortie': "Ton bienveillant. Titre reformulé en positif. Formulaire inline avec données pré-remplies évite une redirection.",
  'WF2': "Prénom avant Nom. Checkbox citerne = domicile cochée par défaut (85 % des cas). Préférence d'appel facultative. RGPD wording validé par Pierre-Louis du Chazaud.",
  'WF2-sortie': "Le prospect locataire ne peut pas légalement changer de fournisseur. Ton orienté solution. Numéro dédié 09 70 81 80 65 (ligne contrats locataires).",
  'WF3': "Pas de filtre à cette étape. La checkbox adresse citerne a été déplacée en WF2 pour grouper toutes les informations de localisation.",
  'WF4': "WF4 Mode B — Parcours guidé en sous-étapes pour l'upload de chaque facture.\n\nÉtape A : Préparation avant caméra. L'illustration de main + facture posée sur table impose mentalement le geste. Le CTA « Ma facture est prête » donne le contrôle au prospect : c'est lui qui décide quand il est prêt, pas le système.\n\nÉtape B1 : Cadrage caméra. L'illustration du viseur prépare ce que le prospect va voir. Les conseils (flash, ombres, orientation) réduisent les prises ratées.\n\nÉtape C1 : « Bien reçu ! » clôture la micro-tâche. Le CTA vert encourage directement à uploader la facture suivante sans retour au menu.\n\nÉtape C2 : L'illustration facture floue + croix rouge identifie le problème sans texte d'erreur technique. Deux sorties : réessayer ou passer au PDF.",
  'WF4-sortie': "Sortie 3 (hard block). Orienté vers rappel. Lien de retour pour reprendre quand le prospect aura ses factures. Formulaire pré-rempli.",
  'WF5': "Chaque section est modifiable. Lien Modifier renvoie à l'étape, puis retour auto à WF5. Section Installation affiche l'adresse citerne si différente. Wording « proposition de contrat » (pas « devis »).",
  'WF5b': "Lead dans Salesforce. Contacts locaux nommés (Sabrina/Éric). Bloc offre 200 € conditionnel à la citerne apparente. Bloc enrichissement dossier supprimé : mauvais timing mobile.",
};

const CONTEXT_TEXT = {
  A: "Archétype : Le calculateur\n\nJean Moreau, Nantes\nPropriétaire 5+ ans, citerne Primagaz\nCompare les prix, arrive en sachant ce qu'il veut\n\nFriction globale : FAIBLE\nProfil le plus susceptible de compléter le tunnel intégralement.",
  B: "Archétype : Le frustré pressé\n\nSophie Duval, Rennes\nCiterne enfouie chez Antargaz\nProblème récent : panne hiver\n\nFriction WF4 : ÉLEVÉE\nN'a pas ses factures sous la main.\nSort via la Sortie 3 (formulaire rappel).",
  C: "Archétype : Le prudent méfiant\n\nFrançoise Petit, Poitiers\nContrat arrivant à échéance\nExplore sans être décidée\n\nFriction WF2 : ÉLEVÉE\nHésite à communiquer son téléphone.\nSort via le bandeau footer.",
  D: "Archétype : L'accompagné économique\n\nMarcel Lefèvre, Bergerac\nPropriétaire âgé, zone rurale\nSon fils lui a montré le site\n\nFriction globale : MAXIMALE\nLe tunnel n'existe pas pour ce profil.\nUtilise « Être rappelé » dès la lame d'entrée.",
  E: "Profil : Nouveau propriétaire (succession)\n\nChoisit « maison avec citerne » à l'étape 1\n→ Sortie 1 (non éligible)\n\nUtilise le formulaire inline pour demander un rappel.",
  F: "Profil : Locataire\n\nClaire Martin, Bordeaux\nRemplit l'étape 2, sélectionne « Locataire »\n→ Sortie 2 (locataire)\n\nNuméro dédié : 09 70 81 80 65",
};

// ─── INJECT CSS ───────────────────────────────────────────────────────────────
function InjectCSS() {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => { try { document.head.removeChild(el); } catch {} };
  }, []);
  return null;
}

// ─── BASE LAYOUT COMPONENTS ───────────────────────────────────────────────────
function TunnelHeader({ onHome }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', borderBottom:'1px solid #E0E0E0', position:'sticky', top:0, background:'#FFF', zIndex:50 }}>
      <span
        style={{ fontWeight:700, fontSize:18, letterSpacing:'-0.3px', cursor: onHome ? 'pointer' : 'default' }}
        onClick={onHome}
      >Butagaz</span>
      <span
        className="lnk-gray"
        style={{ fontSize:13, cursor: onHome ? 'pointer' : 'default' }}
        onClick={onHome}
      >Retour au site</span>
    </div>
  );
}

function ProgressBar({ step, onStepClick }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'12px 16px', gap:0 }}>
      {[1,2,3,4,5].map((n, i) => {
        const state = n < step ? 'done' : n === step ? 'active' : 'future';
        return (
          <div key={n} style={{ display:'flex', alignItems:'center' }}>
            {i > 0 && <div style={{ width:24, height:2, background: n <= step ? '#666' : '#E0E0E0', flexShrink:0 }} />}
            <div
              style={{
                width:28, height:28, borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:12, fontWeight:600, flexShrink:0,
                background: state==='active' ? '#1A1A1A' : state==='done' ? '#666' : '#E0E0E0',
                color: state==='future' ? '#999' : '#FFF',
                cursor: state==='done' ? 'pointer' : 'default',
              }}
              onClick={() => state === 'done' && onStepClick && onStepClick(n)}
            >{n}</div>
          </div>
        );
      })}
    </div>
  );
}

function FooterBanner({ onRecall }) {
  return (
    <div className="footer-fixed" style={{ background:'#F5F5F5', borderTop:'1px solid #E0E0E0', padding:'10px 16px', fontSize:13, color:'#666' }}>
      <span>Besoin d'aide ? </span>
      <strong>01 XX XX XX XX</strong>
      <span> ou </span>
      <span className="lnk" onClick={onRecall}>demandez à être rappelé</span>
    </div>
  );
}

function BackLink({ label = '← Précédent', onClick }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:13, color:'#666', marginBottom:16 }}>
      <span className="lnk-gray" onClick={onClick}>{label}</span>
    </div>
  );
}

// ─── CONTENT BLOCKS ───────────────────────────────────────────────────────────
function InfoBlock({ children }) {
  return <div style={{ background:'#EFF6FF', borderRadius:8, padding:12, fontSize:13, color:'#1A4D8C', marginBottom:16, lineHeight:1.6 }}>{children}</div>;
}
function OfferBlock({ children }) {
  return <div style={{ background:'#F0FFF4', border:'1px solid #22C55E', borderRadius:8, padding:12, fontSize:13, color:'#166534', marginBottom:16, lineHeight:1.6 }}>{children}</div>;
}
function WarningBlock({ children }) {
  return <div style={{ background:'#FFF9E6', border:'1px solid #E6D490', borderRadius:8, padding:12, fontSize:13, color:'#92400E', marginBottom:16, lineHeight:1.6 }}>{children}</div>;
}
function GrayBlock({ children }) {
  return <div style={{ background:'#F5F5F5', borderRadius:8, padding:12, fontSize:13, color:'#666', marginBottom:16, lineHeight:1.6 }}>{children}</div>;
}

// ─── FORM COMPONENTS ──────────────────────────────────────────────────────────
function Tooltip({ id, text, open, onToggle }) {
  return (
    <>
      <span
        onClick={() => onToggle(id)}
        style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:17, height:17, borderRadius:'50%', border:'1px solid #AAA', fontSize:10, color:'#888', cursor:'pointer', marginLeft:5, flexShrink:0, verticalAlign:'middle' }}
      >i</span>
      {open && (
        <div className="tooltip-anim" style={{ background:'#FFF9E6', border:'1px solid #E6D490', borderRadius:8, padding:10, fontSize:13, color:'#92400E', marginTop:6, lineHeight:1.5 }}>
          {text}
        </div>
      )}
    </>
  );
}

function FormField({ id, label, tooltipText, openTip, onToggleTip, error, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:'flex', alignItems:'center', marginBottom:5 }}>
        <label style={{ fontSize:13, color:'#666' }}>{label}</label>
        {tooltipText && <Tooltip id={id} text={tooltipText} open={openTip===id} onToggle={onToggleTip} />}
      </div>
      {children}
      {tooltipText && openTip===id && <div style={{ height:0 }} />}
      {error && <div style={{ fontSize:12, color:'#CC0000', marginTop:4 }}>{error}</div>}
    </div>
  );
}

function RadioGroup({ options, value, onChange }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
      {options.map(opt => (
        <label key={opt.value} style={{ display:'flex', alignItems:'center', gap:6, fontSize:14, cursor:'pointer' }}>
          <input type="radio" value={opt.value} checked={value===opt.value} onChange={() => onChange(opt.value)} />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function CheckboxField({ checked, onChange, children }) {
  return (
    <label style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer', marginBottom:14 }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ marginTop:2 }} />
      <span style={{ fontSize:13, color:'#666', lineHeight:1.5 }}>{children}</span>
    </label>
  );
}

// ─── UPLOAD ITEM (Mode B) ─────────────────────────────────────────────────────
// UploadItem simplifié — Mode B gère les sous-écrans.
// Phases supportées : 'empty' | 'loading' | 'success'
function UploadItem({ index, file, progress, phase, onZoneClick, onDelete }) {
  const label = ['Facture 1/3', 'Facture 2/3', 'Facture 3/3'][index];
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:12, fontWeight:600, color:'#999', marginBottom:6 }}>{label}</div>
      {phase === 'empty' && (
        <div className="upload-empty" onClick={() => onZoneClick(index)}>
          <div style={{ fontSize:28, marginBottom:6, color:'#CCC' }}>↑</div>
          <div style={{ fontSize:14, color:'#666', fontWeight:500 }}>Appuyez pour choisir un fichier ou prendre une photo</div>
          <div style={{ fontSize:12, color:'#999', marginTop:4 }}>PDF, JPG ou PNG · 10 Mo max</div>
        </div>
      )}
      {phase === 'loading' && (
        <div style={{ border:'1px solid #E0E0E0', borderRadius:10, padding:16, background:'#F5F5F5' }}>
          <div style={{ fontSize:14, color:'#666', marginBottom:4 }}>Envoi en cours…</div>
          <div style={{ fontSize:13, color:'#999', marginBottom:8 }}>{file?.name}</div>
          <div className="upbar-track"><div className="upbar-fill" style={{ width: progress + '%' }} /></div>
        </div>
      )}
      {phase === 'success' && (
        <div style={{ background:'#F0FFF0', border:'1px solid #22C55E', borderRadius:10, padding:14 }}>
          <div style={{ fontSize:14, fontWeight:600, color:'#166534', marginBottom:2 }}>✓ {file?.name}</div>
          <div style={{ fontSize:12, color:'#666', marginBottom:8 }}>{file?.size}</div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn-sm">Voir l'aperçu</button>
            <button className="btn-sm" onClick={() => onZoneClick(index)}>Remplacer</button>
            <button className="btn-sm" onClick={() => onDelete(index)}>Supprimer</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RECALL MODAL ─────────────────────────────────────────────────────────────
function RecallModal({ formData, onClose }) {
  const [f, setF] = useState({ nom: formData.prenom && formData.nom ? formData.prenom + ' ' + formData.nom : '', telephone: formData.telephone || '', email: formData.email || '', rgpd: false });
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!f.nom || !f.telephone || !f.rgpd) return;
    setSent(true);
    setTimeout(() => onClose(), 2000);
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div style={{ background:'#FFF', borderRadius:16, padding:24, width:'100%', maxWidth:340, position:'relative' }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={{ fontWeight:600, fontSize:16 }}>Être rappelé</div>
          <span style={{ fontSize:20, cursor:'pointer', color:'#666', lineHeight:1 }} onClick={onClose}>×</span>
        </div>
        {sent ? (
          <InfoBlock>Demande envoyée. Un conseiller vous contactera sous 24 h.</InfoBlock>
        ) : (
          <>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:13, color:'#666', display:'block', marginBottom:4 }}>Nom *</label>
              <input className="field-input" value={f.nom} onChange={e => setF({...f, nom: e.target.value})} placeholder="Votre nom" />
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:13, color:'#666', display:'block', marginBottom:4 }}>Téléphone *</label>
              <input className="field-input" value={f.telephone} onChange={e => setF({...f, telephone: e.target.value})} placeholder="06 ou 07..." />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:13, color:'#666', display:'block', marginBottom:4 }}>Email</label>
              <input className="field-input" value={f.email} onChange={e => setF({...f, email: e.target.value})} placeholder="votre@email.fr" />
            </div>
            <CheckboxField checked={f.rgpd} onChange={v => setF({...f, rgpd:v})}>
              J'accepte que les informations saisies soient utilisées dans le cadre de la relation commerciale avec Butagaz, pour me recontacter.
            </CheckboxField>
            <button className="btn-primary" onClick={handleSend}>Envoyer ma demande de rappel</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN: PAGE0 — SITE BUTAGAZ.FR ─────────────────────────────────────────
function ScreenPAGE0({ offerMode, navigate, showRecall }) {
  const [showPhone, setShowPhone] = useState(false);

  const grayStyle = { opacity: 0.35, pointerEvents: 'none', userSelect: 'none' };

  return (
    <div style={{ background: '#F4F4F4', minHeight: 1400 }}>

      {/* Header grisé */}
      <div style={grayStyle}>
        <div style={{ background: '#FFF', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E0E0E0' }}>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>Butagaz</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 22, height: 2, background: '#1A1A1A', borderRadius: 1 }} />)}
          </div>
        </div>

        {/* Breadcrumb */}
        <div style={{ padding: '8px 16px', background: '#FFF', borderBottom: '1px solid #F0F0F0' }}>
          <span style={{ fontSize: 12, color: '#999' }}>Offres</span>
          <span style={{ fontSize: 12, color: '#CCC', margin: '0 4px' }}>›</span>
          <span style={{ fontSize: 12, color: '#666' }}>Gaz en citerne</span>
        </div>

        {/* Contenu page intro */}
        <div style={{ padding: '20px 16px', background: '#FFF', marginBottom: 8 }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Gaz en citerne</div>
          <div style={{ height: 10, background: '#E0E0E0', borderRadius: 4, marginBottom: 8, width: '90%' }} />
          <div style={{ height: 10, background: '#E0E0E0', borderRadius: 4, marginBottom: 8, width: '80%' }} />
          <div style={{ height: 10, background: '#E0E0E0', borderRadius: 4, marginBottom: 14, width: '65%' }} />
          <span style={{ fontSize: 13, color: '#1A1A1A', textDecoration: 'underline' }}>En savoir plus ›</span>
        </div>
      </div>

      {/* ─── ENCART SOUSCRIPTION — ZONE ACTIVE ─── */}
      <div id="encart-souscription" style={{ margin: '0 12px 12px', background: '#FFF', border: '2px solid #1A1A1A', borderRadius: 12, overflow: 'hidden' }}>
        {/* Étiquette indicateur */}
        <div style={{ background: '#FFF9E6', borderBottom: '1px solid #E6D490', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#92400E', fontWeight: 500 }}>Zone active du prototype</span>
        </div>

        <div style={{ padding: '20px 16px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, lineHeight: 1.3 }}>
            Vous souhaitez changer de fournisseur ?
          </div>

          {offerMode && (
            <div style={{ background: '#F0FFF4', border: '1px solid #22C55E', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#166534', lineHeight: 1.5 }}>
              <strong>Jusqu'à 200 € d'avoir gaz offerts</strong> sur votre première commande*
            </div>
          )}

          {offerMode ? (
            <>
              <button className="btn-primary" style={{ marginBottom: 10 }} onClick={() => navigate('WF1')}>
                <div>Souscrire en ligne</div>
                <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>Devis personnalisé sous 48 h</div>
              </button>
              <button className="btn-secondary" style={{ marginBottom: 10 }} onClick={() => setShowPhone(!showPhone)}>
                <div style={{ fontWeight: 500 }}>Appeler un conseiller</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>01 XX XX XX XX · lun-ven 9h-18h</div>
              </button>
              {showPhone && (
                <div style={{ padding: '10px 14px', background: '#F5F5F5', borderRadius: 8, marginBottom: 10, fontSize: 14, fontWeight: 600 }}>
                  Appelez le 01 XX XX XX XX, du lundi au vendredi de 9h à 18h
                </div>
              )}
              <button className="btn-secondary" onClick={() => navigate('WF0-step2')}>
                <div style={{ fontWeight: 500 }}>Être rappelé</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>Un conseiller vous contacte sous 24 h</div>
              </button>
              <div style={{ fontSize: 11, color: '#999', lineHeight: 1.5, marginTop: 12 }}>
                *Offre réservée aux clients souscrivant à une citerne apparente. Le montant de l'avoir sera déterminé en fonction de la consommation annuelle estimée.
              </div>
            </>
          ) : (
            <>
              <button className="btn-secondary" style={{ marginBottom: 10 }} onClick={() => setShowPhone(!showPhone)}>
                <div style={{ fontWeight: 500 }}>Appeler un conseiller</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>01 XX XX XX XX · lun-ven 9h-18h</div>
              </button>
              {showPhone && (
                <div style={{ padding: '10px 14px', background: '#F5F5F5', borderRadius: 8, marginBottom: 10, fontSize: 14, fontWeight: 600 }}>
                  Appelez le 01 XX XX XX XX, du lundi au vendredi de 9h à 18h
                </div>
              )}
              <button className="btn-secondary" style={{ marginBottom: 10 }} onClick={() => navigate('WF0-step2')}>
                <div style={{ fontWeight: 500 }}>Être rappelé</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>Un conseiller vous contacte sous 24 h</div>
              </button>
              <button className="btn-primary" onClick={() => navigate('WF1')}>
                <div>Souscrire en ligne</div>
                <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>Devis personnalisé sous 48 h</div>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Contenu bas de page — grisé */}
      <div style={grayStyle}>
        <div style={{ background: '#FFF', padding: '20px 16px', margin: '0 0 8px' }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Nos engagements</div>
          {[80, 70, 90, 60].map((w, i) => (
            <div key={i} style={{ height: 10, background: '#E0E0E0', borderRadius: 4, marginBottom: 8, width: w + '%' }} />
          ))}
        </div>
        <div style={{ background: '#FFF', padding: '20px 16px', margin: '0 0 8px' }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Pourquoi Butagaz ?</div>
          {[75, 85, 55, 90].map((w, i) => (
            <div key={i} style={{ height: 10, background: '#E0E0E0', borderRadius: 4, marginBottom: 8, width: w + '%' }} />
          ))}
        </div>
        {/* Footer fictif */}
        <div style={{ background: '#F5F5F5', borderTop: '1px solid #E0E0E0', padding: '16px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 8 }}>
            {['Mentions légales', 'Contact', 'CGU'].map(l => (
              <span key={l} style={{ fontSize: 12, color: '#999', textDecoration: 'underline' }}>{l}</span>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#BBB' }}>© 2026 Butagaz</div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: WF0-step2 — FORMULAIRE RAPPEL ───────────────────────────────────
function ScreenWF0Step2({ formData, setFormData, navigate, showRecall, onHome }) {
  const [f, setF] = useState({ prenom: formData.prenom||'', nom: formData.nom||'', telephone: formData.telephone||'', email: formData.email||'', message: '', rgpd: false });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!f.prenom.trim()) e.prenom = 'Veuillez saisir votre prénom.';
    if (!f.nom.trim()) e.nom = 'Veuillez saisir votre nom.';
    if (!f.telephone.trim()) e.telephone = 'Veuillez saisir votre numéro de téléphone.';
    if (!f.email.trim()) e.email = 'Veuillez saisir votre adresse email.';
    if (!f.rgpd) e.rgpd = 'Veuillez accepter les conditions pour continuer.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (validate()) {
      setFormData({ ...formData, prenom: f.prenom, nom: f.nom, telephone: f.telephone, email: f.email });
      navigate('WF0-step3');
    }
  }

  return (
    <div className="screen-anim">
      <TunnelHeader onHome={onHome} />
      <div style={{ padding:'16px 16px 80px 16px' }}>
        <BackLink onClick={() => navigate('PAGE0')} />
        <div style={{ fontSize:22, fontWeight:700, marginBottom:20 }}>Vos coordonnées</div>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:13, color:'#666', display:'block', marginBottom:5 }}>Prénom *</label>
          <input className={`field-input${errors.prenom?' err':''}`} value={f.prenom} onChange={e => setF({...f,prenom:e.target.value})} onBlur={() => { if (!f.prenom.trim()) setErrors({...errors,prenom:'Veuillez saisir votre prénom.'}); else setErrors({...errors,prenom:null}); }} />
          {errors.prenom && <div style={{ fontSize:12, color:'#CC0000', marginTop:4 }}>{errors.prenom}</div>}
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:13, color:'#666', display:'block', marginBottom:5 }}>Nom *</label>
          <input className={`field-input${errors.nom?' err':''}`} value={f.nom} onChange={e => setF({...f,nom:e.target.value})} onBlur={() => { if (!f.nom.trim()) setErrors({...errors,nom:'Veuillez saisir votre nom.'}); else setErrors({...errors,nom:null}); }} />
          {errors.nom && <div style={{ fontSize:12, color:'#CC0000', marginTop:4 }}>{errors.nom}</div>}
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:13, color:'#666', display:'block', marginBottom:5 }}>Numéro de téléphone *</label>
          <input className={`field-input${errors.telephone?' err':''}`} value={f.telephone} onChange={e => setF({...f,telephone:e.target.value})} placeholder="06 ou 07..." />
          {errors.telephone && <div style={{ fontSize:12, color:'#CC0000', marginTop:4 }}>{errors.telephone}</div>}
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:13, color:'#666', display:'block', marginBottom:5 }}>Email *</label>
          <input className={`field-input${errors.email?' err':''}`} value={f.email} onChange={e => setF({...f,email:e.target.value})} placeholder="votre@email.fr" />
          {errors.email && <div style={{ fontSize:12, color:'#CC0000', marginTop:4 }}>{errors.email}</div>}
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:13, color:'#666', display:'block', marginBottom:5 }}>Message (facultatif)</label>
          <textarea className="field-input" value={f.message} onChange={e => setF({...f,message:e.target.value})} placeholder="Votre message..." />
        </div>

        <CheckboxField checked={f.rgpd} onChange={v => setF({...f,rgpd:v})}>
          J'accepte que les informations saisies soient utilisées dans le cadre de la relation commerciale avec Butagaz, pour me recontacter.
        </CheckboxField>
        {errors.rgpd && <div style={{ fontSize:12, color:'#CC0000', marginBottom:14 }}>{errors.rgpd}</div>}

        <button className="btn-primary" onClick={handleSubmit}>Envoyer ma demande</button>
      </div>
      <FooterBanner onRecall={showRecall} />
    </div>
  );
}

// ─── SCREEN: WF0-step3 — CONFIRMATION RAPPEL ─────────────────────────────────
function ScreenWF0Step3({ navigate, returnToSite }) {
  return (
    <div className="screen-anim">
      <TunnelHeader onHome={returnToSite} />
      <div style={{ padding:'32px 16px 80px 16px', textAlign:'center' }}>
        <div style={{ width:60, height:60, borderRadius:'50%', background:'#F0FFF4', border:'2px solid #22C55E', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:26 }}>✓</div>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:16 }}>Votre demande est bien reçue</div>
        <InfoBlock>
          Un conseiller vous contactera sous 24 h. Rappel entre 9h et 17h, du lundi au vendredi.
        </InfoBlock>
        <button className="btn-secondary" onClick={returnToSite}>Retour au site butagaz.fr</button>
      </div>
    </div>
  );
}

// ─── SCREEN: WF1 — QUALIFICATION ─────────────────────────────────────────────
function ScreenWF1({ navigate, showRecall, initChoice, onHome }) {
  const [choice, setChoice] = useState(initChoice || null);

  function handleChoice(c) {
    setChoice(c);
    if (c === 'succession' || c === 'energie') navigate('WF1-sortie');
  }

  return (
    <div className="screen-anim">
      <TunnelHeader onHome={onHome} />
      <ProgressBar step={1} />
      <div style={{ padding:'8px 16px 80px 16px' }}>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>Quel est votre projet aujourd'hui ?</div>
        <div style={{ fontSize:14, color:'#666', marginBottom:20 }}>Choisissez la situation qui vous correspond.</div>

        <div
          className={`choice-block${choice==='changer'?' selected':''}`}
          onClick={() => handleChoice('changer')}
        >
          <div style={{ fontWeight:600, fontSize:15 }}>Je souhaite changer de fournisseur de gaz en citerne</div>
        </div>

        {choice === 'changer' && (
          <div className="slide-down" style={{ background:'#FFF9E6', border:'1px solid #E6D490', borderRadius:8, padding:12, fontSize:13, color:'#92400E', marginBottom:10, lineHeight:1.5 }}>
            ✓ Ce parcours est réservé aux propriétaires qui souhaitent changer de fournisseur de gaz en citerne.
          </div>
        )}

        <div
          className={`choice-block${choice==='succession'?' selected':''}`}
          onClick={() => handleChoice('succession')}
        >
          <div style={{ fontWeight:600, fontSize:15 }}>J'ai acheté une maison avec une citerne de gaz</div>
        </div>

        <div
          className={`choice-block${choice==='energie'?' selected':''}`}
          onClick={() => handleChoice('energie')}
        >
          <div style={{ fontWeight:600, fontSize:15 }}>Je souhaite passer au gaz en citerne</div>
        </div>

        {choice === 'changer' && (
          <button className="btn-primary" style={{ marginTop:8 }} onClick={() => navigate('WF1bis')}>
            Continuer →
          </button>
        )}
      </div>
      <FooterBanner onRecall={showRecall} />
    </div>
  );
}

// ─── SCREEN: WF1bis — PRÉREQUIS ───────────────────────────────────────────────
function ScreenWF1bis({ navigate, showRecall, onHome }) {
  return (
    <div className="screen-anim">
      <TunnelHeader onHome={onHome} />
      <ProgressBar step={1} />
      <div style={{ padding:'8px 16px 80px 16px' }}>
        <BackLink onClick={() => navigate('WF1')} />
        <div style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>Avant de commencer</div>
        <div style={{ fontSize:13, color:'#666', marginBottom:16 }}>Parcours réservé aux propriétaires d'un logement avec citerne de gaz.</div>

        <InfoBlock>
          <strong>Vos 3 dernières factures de gaz seront nécessaires.</strong><br />
          Elles nous permettent d'estimer votre consommation réelle et de vous proposer un tarif compétitif. Les 3 factures sont obligatoires pour finaliser votre demande.
        </InfoBlock>

        <WarningBlock>
          <strong>Où trouver vos factures ?</strong><br />
          · Dans votre boîte aux lettres<br />
          · Dans votre espace client en ligne (Primagaz, Antargaz, Vitogaz)<br />
          · Sur l'appli de votre fournisseur
        </WarningBlock>

        <GrayBlock>
          Vous n'avez pas vos 3 factures ? Vous pouvez appeler un conseiller ou demander à être rappelé.
        </GrayBlock>

        <button className="btn-primary" style={{ marginBottom:12 }} onClick={() => navigate('WF2')}>
          C'est parti →
        </button>
        <div style={{ textAlign:'center', fontSize:13, color:'#666' }}>
          <span className="lnk-gray">Vous préférez être accompagné ? Appelez-nous ou soyez rappelé</span>
        </div>
      </div>
      <FooterBanner onRecall={showRecall} />
    </div>
  );
}

// ─── SCREEN: WF1-SORTIE — NON ÉLIGIBLE ───────────────────────────────────────
function ScreenWF1Sortie({ formData, navigate, returnToSite, onHome }) {
  const [submitted, setSubmitted] = useState(false);
  const [rgpd, setRgpd] = useState(false);

  const hasData = formData.prenom || formData.telephone;

  return (
    <div className="screen-anim">
      <TunnelHeader onHome={returnToSite || onHome} />
      <div style={{ padding:'24px 16px 32px 16px' }}>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:12 }}>Ce parcours ne correspond pas à votre situation</div>

        <div style={{ fontSize:14, color:'#666', marginBottom:8, lineHeight:1.6 }}>
          Le parcours en ligne est conçu pour les propriétaires souhaitant changer de fournisseur de gaz en citerne.
        </div>
        <div style={{ fontSize:14, color:'#666', marginBottom:20, lineHeight:1.6 }}>
          Votre situation est différente, mais nos conseillers peuvent tout à fait vous accompagner.
        </div>

        <button className="btn-secondary" style={{ marginBottom:12 }}>
          Appeler le 01 XX XX XX XX · lun-ven 9h-18h
        </button>

        <div style={{ border:'1px solid #E0E0E0', borderRadius:10, padding:16, marginBottom:16 }}>
          <div style={{ fontWeight:600, fontSize:15, marginBottom:4 }}>Demander à être rappelé</div>
          <div style={{ fontSize:13, color:'#666', marginBottom:12 }}>Un conseiller vous recontactera sous 24 h.</div>

          {hasData && (
            <div style={{ background:'#F5F5F5', borderRadius:8, padding:12, marginBottom:12, fontSize:13 }}>
              <div style={{ fontWeight:500, marginBottom:4 }}>Vos informations :</div>
              {formData.civilite && formData.prenom && <div>{formData.civilite} {formData.prenom} {formData.nom}</div>}
              {formData.telephone && <div>{formData.telephone}</div>}
              {formData.email && <div>{formData.email}</div>}
              <span className="lnk" style={{ fontSize:12, marginTop:6, display:'inline-block' }}>Modifier</span>
            </div>
          )}
          {!hasData && (
            <div style={{ fontSize:13, color:'#999', marginBottom:12, fontStyle:'italic' }}>
              Mme Marie Dupont · 06 12 34 56 78 · marie.dupont@email.fr
              <span className="lnk" style={{ fontSize:12, marginLeft:8 }}>Modifier</span>
            </div>
          )}

          {!submitted ? (
            <>
              <CheckboxField checked={rgpd} onChange={setRgpd}>
                J'accepte que les informations saisies soient utilisées dans le cadre de la relation commerciale avec Butagaz, pour me recontacter.
              </CheckboxField>
              <button className="btn-primary" onClick={() => setSubmitted(true)}>Confirmer et Envoyer</button>
            </>
          ) : (
            <InfoBlock>Votre demande est bien enregistrée. Un conseiller vous contactera sous 24 h.</InfoBlock>
          )}
        </div>

        <div style={{ textAlign:'center' }}>
          <span className="lnk-gray" style={{ fontSize:13 }} onClick={returnToSite}>Retour au site butagaz.fr</span>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: WF2 — COORDONNÉES ────────────────────────────────────────────────
function ScreenWF2({ formData, setFormData, navigate, showRecall, returnTo, setReturnTo, stepHistory, onHome }) {
  const [f, setF] = useState({ ...formData });
  const [errors, setErrors] = useState({});
  const [openTip, setOpenTip] = useState(null);

  function toggleTip(id) { setOpenTip(prev => prev === id ? null : id); }

  function blur(field) {
    const msgs = {
      prenom: !f.prenom.trim() ? 'Veuillez saisir votre prénom.' : null,
      nom: !f.nom.trim() ? 'Veuillez saisir votre nom.' : null,
      adresse: !f.adresse.trim() ? "Veuillez saisir l'adresse du logement." : null,
      telephone: !f.telephone.trim() ? 'Veuillez saisir votre numéro de téléphone.' : !/^0[67]\d{8}$/.test(f.telephone.replace(/\s/g,'')) ? 'Veuillez saisir un numéro valide (10 chiffres, commençant par 0).' : null,
      email: !f.email.trim() ? 'Veuillez saisir votre adresse email.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) ? 'Veuillez saisir une adresse email valide (ex. : nom@exemple.fr).' : null,
    };
    if (msgs[field] !== undefined) setErrors(prev => ({ ...prev, [field]: msgs[field] }));
  }

  function validate() {
    const e = {};
    if (!f.prenom.trim()) e.prenom = 'Veuillez saisir votre prénom.';
    if (!f.nom.trim()) e.nom = 'Veuillez saisir votre nom.';
    if (!f.adresse.trim()) e.adresse = "Veuillez saisir l'adresse du logement.";
    if (!f.telephone.trim()) e.telephone = 'Veuillez saisir votre numéro de téléphone.';
    else if (!/^0[0-9]\d{8}$/.test(f.telephone.replace(/\s/g,''))) e.telephone = 'Veuillez saisir un numéro valide (10 chiffres, commençant par 0).';
    if (!f.email.trim()) e.email = 'Veuillez saisir votre adresse email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Veuillez saisir une adresse email valide (ex. : nom@exemple.fr).';
    if (!f.rgpd) e.rgpd = 'Veuillez accepter les conditions pour continuer.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleContinue() {
    if (!validate()) return;
    setFormData({ ...formData, ...f });
    if (f.statut === 'locataire') { navigate('WF2-sortie'); return; }
    navigate(returnTo === 'WF5' ? 'WF5' : 'WF3');
    if (returnTo === 'WF5') setReturnTo(null);
  }

  function handleStepClick(n) {
    const screen = ['WF1','WF2','WF3','WF4','WF5'][n-1];
    if (stepHistory.includes(screen)) navigate(screen);
  }

  return (
    <div className="screen-anim">
      <TunnelHeader onHome={onHome} />
      <ProgressBar step={2} onStepClick={handleStepClick} />
      <div style={{ padding:'8px 16px 80px 16px' }}>
        <BackLink onClick={() => navigate('WF1bis')} />
        <div style={{ fontSize:22, fontWeight:700, marginBottom:20 }}>Vos coordonnées</div>

        {/* Prénom */}
        <FormField id="prenom" label="Prénom *" openTip={openTip} onToggleTip={toggleTip} error={errors.prenom}>
          <input className={`field-input${errors.prenom?' err':''}`} value={f.prenom} onChange={e => setF({...f,prenom:e.target.value})} onBlur={() => blur('prenom')} />
        </FormField>

        {/* Nom */}
        <FormField id="nom" label="Nom *" openTip={openTip} onToggleTip={toggleTip} error={errors.nom}>
          <input className={`field-input${errors.nom?' err':''}`} value={f.nom} onChange={e => setF({...f,nom:e.target.value})} onBlur={() => blur('nom')} />
        </FormField>

        {/* Adresse */}
        <FormField id="adresse" label="Adresse du logement *" openTip={openTip} onToggleTip={toggleTip} error={errors.adresse}>
          <input className={`field-input${errors.adresse?' err':''}`} value={f.adresse} onChange={e => setF({...f,adresse:e.target.value})} onBlur={() => blur('adresse')} placeholder="Commencez à taper votre adresse" />
        </FormField>

        {/* Téléphone */}
        <FormField id="telephone" label="Téléphone *" tooltipText="Un conseiller vous appellera pour vous transmettre votre proposition de contrat. Vous serez contacté depuis le 01 XX XX XX XX." openTip={openTip} onToggleTip={toggleTip} error={errors.telephone}>
          <input className={`field-input${errors.telephone?' err':''}`} value={f.telephone} onChange={e => setF({...f,telephone:e.target.value})} onBlur={() => blur('telephone')} placeholder="06 ou 07..." />
        </FormField>

        {/* Préférence d'appel */}
        <FormField id="pref" label="Préférence d'appel (facultatif)" tooltipText="Rappel entre 9h et 17h, du lundi au vendredi." openTip={openTip} onToggleTip={toggleTip}>
          <RadioGroup
            options={[{ value:'matin', label:'Matin' }, { value:'aprem', label:'Après-midi' }, { value:'indifferent', label:'Indifférent' }]}
            value={f.preferenceAppel}
            onChange={v => setF({...f, preferenceAppel:v})}
          />
        </FormField>

        {/* Email */}
        <FormField id="email" label="Email *" tooltipText="Votre proposition de contrat sera envoyée à cette adresse. Aucun spam, promis." openTip={openTip} onToggleTip={toggleTip} error={errors.email}>
          <input className={`field-input${errors.email?' err':''}`} value={f.email} onChange={e => setF({...f,email:e.target.value})} onBlur={() => blur('email')} placeholder="votre@email.fr" />
        </FormField>

        {/* Citerne = domicile */}
        <CheckboxField checked={f.citerneMemeDomicile} onChange={v => setF({...f, citerneMemeDomicile:v, adresseCiterne: v ? '' : f.adresseCiterne})}>
          La citerne est à la même adresse que mon domicile
        </CheckboxField>

        {!f.citerneMemeDomicile && (
          <div className="slide-down">
            <FormField id="adresse-citerne" label="Adresse de la citerne *" tooltipText="Résidence secondaire ? Indiquez l'adresse exacte de la citerne." openTip={openTip} onToggleTip={toggleTip}>
              <input className="field-input" value={f.adresseCiterne} onChange={e => setF({...f,adresseCiterne:e.target.value})} placeholder="Adresse de la citerne" />
            </FormField>
          </div>
        )}

        {/* Statut */}
        <FormField id="statut" label="Vous êtes *" tooltipText="Seul le propriétaire peut changer de fournisseur de gaz en citerne." openTip={openTip} onToggleTip={toggleTip} error={errors.statut}>
          <RadioGroup
            options={[{ value:'proprietaire', label:'Propriétaire' }, { value:'locataire', label:'Locataire' }]}
            value={f.statut}
            onChange={v => setF({...f, statut:v})}
          />
        </FormField>

        {/* RGPD */}
        <div style={{ height:1, background:'#F0F0F0', margin:'8px 0 14px' }} />
        <CheckboxField checked={f.rgpd} onChange={v => setF({...f,rgpd:v})}>
          J'accepte que les informations saisies soient utilisées dans le cadre de la relation commerciale avec Butagaz, pour me recontacter.
        </CheckboxField>
        {errors.rgpd && <div style={{ fontSize:12, color:'#CC0000', marginBottom:14 }}>{errors.rgpd}</div>}

        <button className="btn-primary" onClick={handleContinue}>
          {returnTo === 'WF5' ? 'Enregistrer et retourner à la synthèse' : 'Continuer →'}
        </button>
      </div>
      <FooterBanner onRecall={showRecall} />
    </div>
  );
}

// ─── SCREEN: WF2-SORTIE — LOCATAIRE ───────────────────────────────────────────
function ScreenWF2Sortie({ navigate, returnToSite }) {
  return (
    <div className="screen-anim">
      <TunnelHeader onHome={returnToSite} />
      <div style={{ padding:'24px 16px 32px 16px' }}>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:12 }}>Ce parcours est réservé aux propriétaires</div>

        <div style={{ fontSize:14, color:'#666', marginBottom:12, lineHeight:1.6 }}>
          En tant que locataire, c'est votre propriétaire qui décide du choix du fournisseur.
        </div>
        <div style={{ fontSize:14, color:'#666', marginBottom:20, lineHeight:1.6 }}>
          <strong>Ce que vous pouvez faire :</strong> Parlez-en à votre propriétaire. Nous pouvons lui envoyer une documentation par email. Si votre propriétaire est intéressé, il peut remplir ce formulaire lui-même.
        </div>

        <button className="btn-secondary" style={{ marginBottom:10 }}>
          Appeler un conseiller au 09 70 81 80 65 · lun-ven 9h-18h
        </button>
        <button className="btn-secondary" style={{ marginBottom:16 }}>
          Demander à être rappelé
        </button>

        <div style={{ textAlign:'center' }}>
          <span className="lnk-gray" style={{ fontSize:13 }} onClick={returnToSite}>Retour au site butagaz.fr</span>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: WF3 — INSTALLATION ───────────────────────────────────────────────
function ScreenWF3({ formData, setFormData, navigate, showRecall, returnTo, setReturnTo, stepHistory, onHome }) {
  const [citerneType, setCiterneType] = useState(formData.citerneType || '');
  const [conserverType, setConserverType] = useState(formData.conserverType || '');
  const [errors, setErrors] = useState({});
  const [openTip, setOpenTip] = useState(null);
  function toggleTip(id) { setOpenTip(prev => prev === id ? null : id); }

  function handleContinue() {
    const e = {};
    if (!citerneType) e.citerne = 'Veuillez indiquer si votre citerne est apparente ou enfouie.';
    if (!conserverType) e.conserver = 'Veuillez indiquer si vous souhaitez garder le même type.';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setFormData({ ...formData, citerneType, conserverType });
    navigate(returnTo === 'WF5' ? 'WF5' : 'WF4');
    if (returnTo === 'WF5') setReturnTo(null);
  }

  function handleStepClick(n) {
    const screens = ['WF1','WF2','WF3','WF4','WF5'];
    if (stepHistory.includes(screens[n-1])) navigate(screens[n-1]);
  }

  return (
    <div className="screen-anim">
      <TunnelHeader onHome={onHome} />
      <ProgressBar step={3} onStepClick={handleStepClick} />
      <div style={{ padding:'8px 16px 80px 16px' }}>
        <BackLink onClick={() => navigate('WF2')} />
        <div style={{ fontSize:22, fontWeight:700, marginBottom:20 }}>Votre installation actuelle</div>

        <FormField id="citerne-type" label="Votre citerne est-elle visible dans votre jardin ?" tooltipText="Apparente : vous la voyez dans votre jardin, posée au sol. Enfouie : enterrée sous terre. Seul un petit capot dépasse du sol." openTip={openTip} onToggleTip={toggleTip} error={errors.citerne}>
          <div style={{ display:'flex', gap:12, marginTop:4 }}>
            <div
              className={`choice-block${citerneType==='apparente'?' selected':''}`}
              style={{ flex:1, textAlign:'center', marginBottom:0 }}
              onClick={() => { setCiterneType('apparente'); setErrors({...errors,citerne:null}); }}
            >
              <div style={{ fontSize:28, marginBottom:4 }}>🪨</div>
              <div style={{ fontWeight:600, fontSize:14 }}>Apparente</div>
              <div style={{ fontSize:12, color:'#666' }}>Visible dans le jardin</div>
            </div>
            <div
              className={`choice-block${citerneType==='enfouie'?' selected':''}`}
              style={{ flex:1, textAlign:'center', marginBottom:0 }}
              onClick={() => { setCiterneType('enfouie'); setErrors({...errors,citerne:null}); }}
            >
              <div style={{ fontSize:28, marginBottom:4 }}>⬇</div>
              <div style={{ fontWeight:600, fontSize:14 }}>Enfouie</div>
              <div style={{ fontSize:12, color:'#666' }}>Enterrée sous terre</div>
            </div>
          </div>
        </FormField>

        <div style={{ height:1, background:'#F0F0F0', margin:'4px 0 16px' }} />

        <FormField id="conserver" label="Souhaitez-vous garder le même type de citerne ?" tooltipText="C'est votre préférence, pas un engagement. Un technicien vérifiera la faisabilité avant installation. Enfouir une citerne peut entraîner des frais précisés dans le devis." openTip={openTip} onToggleTip={toggleTip} error={errors.conserver}>
          <RadioGroup
            options={[{ value:'oui', label:'Oui' }, { value:'non', label:'Non' }]}
            value={conserverType}
            onChange={v => { setConserverType(v); setErrors({...errors,conserver:null}); }}
          />
        </FormField>

        <button className="btn-primary" style={{ marginTop:8 }} onClick={handleContinue}>
          {returnTo === 'WF5' ? 'Enregistrer et retourner à la synthèse' : 'Continuer →'}
        </button>
      </div>
      <FooterBanner onRecall={showRecall} />
    </div>
  );
}

// ─── WF4 MODE B — ILLUSTRATIONS SVG ──────────────────────────────────────────
function IllustrationFactureMain() {
  return (
    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" style={{ width:200, height:140 }}>
      <rect x="0" y="110" width="200" height="30" fill="#F0F0F0"/>
      <g transform="rotate(-3, 100, 70)">
        <rect x="50" y="20" width="100" height="130" fill="white" stroke="#D0D0D0" strokeWidth="1.5" rx="2"/>
        <rect x="62" y="32" width="76" height="4" fill="#E0E0E0" rx="1"/>
        <rect x="62" y="42" width="60" height="3" fill="#E8E8E8" rx="1"/>
        <rect x="62" y="50" width="70" height="3" fill="#E8E8E8" rx="1"/>
        <rect x="62" y="60" width="50" height="3" fill="#E8E8E8" rx="1"/>
        <rect x="62" y="68" width="80" height="3" fill="#E8E8E8" rx="1"/>
      </g>
      <rect x="72" y="108" width="14" height="28" fill="#999" rx="4"/>
      <rect x="90" y="112" width="14" height="24" fill="#999" rx="4"/>
      <rect x="108" y="110" width="14" height="26" fill="#999" rx="4"/>
    </svg>
  );
}
function IllustrationViseur() {
  return (
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" style={{ width:200, height:160 }}>
      <rect x="0" y="0" width="200" height="160" fill="#1A1A1A" rx="4"/>
      <rect x="50" y="20" width="100" height="120" fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.2" strokeWidth="1"/>
      <rect x="40" y="15" width="120" height="130" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="6 3" rx="2"/>
      <path d="M40,35 L40,15 L60,15" fill="none" stroke="white" strokeWidth="3"/>
      <path d="M160,35 L160,15 L140,15" fill="none" stroke="white" strokeWidth="3"/>
      <path d="M40,125 L40,145 L60,145" fill="none" stroke="white" strokeWidth="3"/>
      <path d="M160,125 L160,145 L140,145" fill="none" stroke="white" strokeWidth="3"/>
      <circle cx="100" cy="152" r="6" fill="white" fillOpacity="0.7"/>
    </svg>
  );
}
function IllustrationViseurPleinEcran() {
  return (
    <svg viewBox="0 0 280 320" xmlns="http://www.w3.org/2000/svg" style={{ width:240, height:274 }}>
      <rect x="20" y="20" width="240" height="280" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="8 4" rx="3" opacity="0.6"/>
      <path d="M20,60 L20,20 L60,20" fill="none" stroke="white" strokeWidth="4"/>
      <path d="M260,60 L260,20 L220,20" fill="none" stroke="white" strokeWidth="4"/>
      <path d="M20,260 L20,300 L60,300" fill="none" stroke="white" strokeWidth="4"/>
      <path d="M260,260 L260,300 L220,300" fill="none" stroke="white" strokeWidth="4"/>
      <rect x="60" y="70" width="160" height="180" fill="white" fillOpacity="0.06"/>
    </svg>
  );
}
function IllustrationFactureFloue() {
  return (
    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" style={{ width:200, height:140 }}>
      <rect x="20" y="10" width="160" height="120" fill="#FFF0F0" stroke="#CC0000" strokeWidth="2" rx="4"/>
      <rect x="30" y="22" width="90" height="5" fill="#D0D0D0" rx="1" opacity="0.7"/>
      <rect x="30" y="32" width="70" height="4" fill="#C8C8C8" rx="1" opacity="0.6"/>
      <rect x="30" y="41" width="110" height="5" fill="#D8D8D8" rx="1" opacity="0.7"/>
      <rect x="30" y="51" width="60" height="4" fill="#C0C0C0" rx="1" opacity="0.5"/>
      <rect x="30" y="60" width="95" height="5" fill="#D0D0D0" rx="1" opacity="0.6"/>
      <rect x="30" y="70" width="75" height="4" fill="#C8C8C8" rx="1" opacity="0.7"/>
      <rect x="30" y="80" width="100" height="5" fill="#D0D0D0" rx="1" opacity="0.6"/>
      <line x1="65" y1="45" x2="135" y2="105" stroke="#CC0000" strokeWidth="5" strokeLinecap="round"/>
      <line x1="135" y1="45" x2="65" y2="105" stroke="#CC0000" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
}

// ─── WF4 MODE B — HEADER ─────────────────────────────────────────────────────
function WF4ModeBHeader({ factureNum, handleBack }) {
  return (
    <div style={{ display:'flex', alignItems:'center', padding:'12px 16px', borderBottom:'1px solid #E0E0E0', position:'sticky', top:0, background:'#FFF', zIndex:50 }}>
      <button onClick={handleBack} style={{ background:'none', border:'none', cursor:'pointer', fontSize:14, color:'#1A1A1A', padding:0 }}>← Retour</button>
      <span style={{ marginLeft:'auto', fontSize:13, color:'#666', fontWeight:500 }}>Ajout facture {factureNum}/3</span>
    </div>
  );
}

// ─── WF4 MODE B — ÉTAPE A ────────────────────────────────────────────────────
function WF4ModeB_Prepare({ factureNum, onReady, onFileClick, onNoFacture, onBack }) {
  return (
    <div style={{ minHeight:'100%' }}>
      <WF4ModeBHeader factureNum={factureNum} handleBack={onBack} />
      <div style={{ padding:'20px 16px 80px 16px' }}>
        <div style={{ fontSize:20, fontWeight:700, marginBottom:16 }}>Préparez votre facture</div>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}><IllustrationFactureMain /></div>
        <div style={{ background:'#FFF9E6', border:'1px solid #E6D490', borderRadius:8, padding:12, marginBottom:24, fontSize:13, color:'#92400E', lineHeight:1.6 }}>
          ⓘ Conseils : photo bien éclairée, pas de reflet, facture entièrement visible.
        </div>
        <button className="btn-primary" style={{ marginBottom:12 }} onClick={onReady}>Ma facture est prête →</button>
        <button className="btn-secondary" style={{ marginBottom:24 }} onClick={onFileClick}>↑ Choisir un fichier sur mon appareil</button>
        <div style={{ textAlign:'center' }}>
          <button onClick={onNoFacture} style={{ background:'none', border:'none', color:'#999', fontSize:13, cursor:'pointer', textDecoration:'underline' }}>
            Pas de facture ? Continuer →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── WF4 MODE B — ÉTAPE B1 ───────────────────────────────────────────────────
function WF4ModeB_Frame({ factureNum, onCapture, onFileClick, onNoFacture, onBack }) {
  return (
    <div style={{ minHeight:'100%' }}>
      <WF4ModeBHeader factureNum={factureNum} handleBack={onBack} />
      <div style={{ padding:'20px 16px 80px 16px' }}>
        <div style={{ fontSize:20, fontWeight:700, marginBottom:16 }}>Prenez la photo</div>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}><IllustrationViseur /></div>
        <div style={{ background:'#FFF9E6', border:'1px solid #E6D490', borderRadius:8, padding:12, marginBottom:24, fontSize:13, color:'#92400E', lineHeight:1.6 }}>
          ⓘ Conseils : pas de flash, évitez les ombres, tenez le téléphone bien droit.
        </div>
        <button className="btn-primary" style={{ marginBottom:12 }} onClick={onCapture}>Prendre la photo</button>
        <button className="btn-secondary" style={{ marginBottom:24 }} onClick={onFileClick}>↑ Choisir un fichier sur mon appareil</button>
        <div style={{ textAlign:'center' }}>
          <button onClick={onNoFacture} style={{ background:'none', border:'none', color:'#999', fontSize:13, cursor:'pointer', textDecoration:'underline' }}>
            Pas de facture ? Continuer →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── WF4 MODE B — ÉTAPE B2 ───────────────────────────────────────────────────
function WF4ModeB_Camera({ factureNum, onCapture, onBack }) {
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <WF4ModeBHeader factureNum={factureNum} handleBack={onBack} />
      <div style={{ flex:1, background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', minHeight:500 }}>
        <div style={{ position:'absolute', top:16, left:16, right:16, background:'rgba(255,255,255,0.92)', borderRadius:8, padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:13, zIndex:10 }}>
          <span>Autorisation d'utiliser l'appareil photo</span>
          <button onClick={onCapture} style={{ background:'#1A1A1A', color:'white', border:'none', borderRadius:6, padding:'6px 12px', fontSize:12, cursor:'pointer', flexShrink:0, marginLeft:8 }}>
            Accepter
          </button>
        </div>
        <IllustrationViseurPleinEcran />
        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginTop:12 }}>Appareil photo natif — S'ouvre en plein écran</div>
        <button onClick={onCapture} style={{ position:'absolute', bottom:24, width:56, height:56, borderRadius:'50%', background:'white', border:'3px solid rgba(255,255,255,0.5)', cursor:'pointer' }} />
      </div>
    </div>
  );
}

// ─── WF4 MODE B — LOADING ────────────────────────────────────────────────────
function WF4ModeB_Loading({ factureNum, fileName, progress }) {
  return (
    <div style={{ minHeight:'100%' }}>
      <WF4ModeBHeader factureNum={factureNum} handleBack={() => {}} />
      <div style={{ padding:'60px 24px', textAlign:'center' }}>
        <div style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>Envoi en cours…</div>
        <div style={{ fontSize:13, color:'#999', marginBottom:24 }}>{fileName}</div>
        <div className="upbar-track" style={{ maxWidth:280, margin:'0 auto' }}>
          <div className="upbar-fill" style={{ width: progress + '%' }} />
        </div>
        <div style={{ fontSize:12, color:'#BBB', marginTop:12 }}>{progress} %</div>
      </div>
    </div>
  );
}

// ─── WF4 MODE B — ÉTAPE C1 ───────────────────────────────────────────────────
function WF4ModeB_Success({ factureNum, file, factures, onAddNext, onReturn, onFinish, onContinue }) {
  const uploadedCount = factures.filter(Boolean).length;
  const allUploaded = uploadedCount === 3;
  const isLast = factureNum === 3;
  return (
    <div style={{ minHeight:'100%' }}>
      <WF4ModeBHeader factureNum={factureNum} handleBack={onReturn} />
      <div style={{ padding:'20px 16px 80px 16px' }}>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:4 }}>Bien reçu !</div>
        <div style={{ fontSize:14, color:'#666', marginBottom:20 }}>
          {uploadedCount}/3 facture{uploadedCount > 1 ? 's' : ''} ajoutée{uploadedCount > 1 ? 's' : ''}
        </div>
        <div style={{ background:'#F0FFF4', border:'1px solid #22C55E', borderRadius:8, padding:14, marginBottom:24 }}>
          <div style={{ fontSize:14, fontWeight:600, color:'#166534', marginBottom:6 }}>✓ {file?.name}</div>
          <div style={{ fontSize:12, color:'#666', marginBottom:10 }}>{file?.size}</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <button className="btn-sm">Voir l'aperçu</button>
            <button className="btn-sm">✓ Remplacer</button>
            <button className="btn-sm">Supprimer</button>
          </div>
        </div>
        {(isLast || allUploaded) ? (
          <button className="btn-primary" style={{ marginBottom:12 }} onClick={onContinue}>Continuer →</button>
        ) : (
          <button
            style={{ display:'block', width:'100%', padding:14, background:'#22C55E', color:'white', border:'none', borderRadius:10, fontSize:15, fontWeight:600, cursor:'pointer', marginBottom:12 }}
            onClick={onAddNext}
          >
            Ajouter une {factureNum + 1 === 2 ? '2e' : '3e'} facture
          </button>
        )}
        <button className="btn-secondary" style={{ marginBottom:20 }} onClick={onReturn}>Retour WF4</button>
        <div style={{ textAlign:'center' }}>
          <button onClick={onFinish} style={{ background:'none', border:'none', color:'#999', fontSize:13, cursor:'pointer', textDecoration:'underline' }}>
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── WF4 MODE B — ÉTAPE C2 ───────────────────────────────────────────────────
function WF4ModeB_Error({ factureNum, onRetry, onFileClick, onFinish }) {
  return (
    <div style={{ minHeight:'100%' }}>
      <WF4ModeBHeader factureNum={factureNum} handleBack={onRetry} />
      <div style={{ padding:'20px 16px 80px 16px' }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}><IllustrationFactureFloue /></div>
        <div style={{ fontSize:15, fontWeight:500, textAlign:'center', color:'#1A1A1A', marginBottom:24 }}>
          La photo est floue ou le format n'est pas reconnu.
        </div>
        <button className="btn-primary" style={{ marginBottom:12 }} onClick={onRetry}>Reprendre la photo</button>
        <button className="btn-secondary" style={{ marginBottom:24 }} onClick={onFileClick}>Choisir un PDF sur mon appareil</button>
        <div style={{ textAlign:'center' }}>
          <button onClick={onFinish} style={{ background:'none', border:'none', color:'#999', fontSize:13, cursor:'pointer', textDecoration:'underline' }}>
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: WF4 — FACTURES + BIOPROPANE (MODE B) ────────────────────────────
function ScreenWF4({ formData, setFormData, navigate, showRecall, returnTo, setReturnTo, stepHistory, onHome, simulateError, setSimulateError }) {
  const initFacture = (idx) => formData.factures?.[idx] || null;
  const [uploadState, setUploadState] = useState({
    currentFacture: 1,
    factures: [initFacture(0), initFacture(1), initFacture(2)],
    subscreen: null,        // null | 'PREPARE'|'FRAME'|'CAMERA'|'LOADING'|'SUCCESS'|'ERROR'
    pendingFile: null,
    progress: 0,
  });
  const [biopropane, setBiopropane] = useState(formData.biopropane || 'non');
  const [openTip, setOpenTip] = useState(null);
  const fileRef = useRef(null);

  function setSubscreen(sub, extra = {}) {
    setUploadState(prev => ({ ...prev, subscreen: sub, ...extra }));
  }

  function openModeB(factureIdx) {
    setSubscreen('PREPARE', { currentFacture: factureIdx + 1 });
  }

  function deleteFacture(factureIdx) {
    setUploadState(prev => {
      const f = [...prev.factures]; f[factureIdx] = null;
      return { ...prev, factures: f };
    });
  }

  function handleFileInput(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    // Reset input so the same file can be re-selected
    e.target.value = '';
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const tooLarge = f.size > 10 * 1024 * 1024;
    if (!validTypes.includes(f.type) || tooLarge) {
      setSubscreen('ERROR');
      return;
    }
    const fileData = { name: f.name, size: Math.round(f.size / 1024) + ' Ko' };
    setUploadState(prev => ({ ...prev, subscreen: 'LOADING', pendingFile: fileData, progress: 0 }));
    let p = 0;
    const iv = setInterval(() => {
      p += 5;
      setUploadState(prev => ({ ...prev, progress: p }));
      if (p >= 100) {
        clearInterval(iv);
        const shouldError = simulateError;
        if (shouldError && setSimulateError) setSimulateError(false);
        if (shouldError) {
          setUploadState(prev => ({ ...prev, subscreen: 'ERROR', progress: 0 }));
        } else {
          setUploadState(prev => {
            const newFactures = [...prev.factures];
            newFactures[prev.currentFacture - 1] = prev.pendingFile;
            return { ...prev, subscreen: 'SUCCESS', factures: newFactures, progress: 0 };
          });
        }
      }
    }, 100);
  }

  function triggerFilePicker() {
    fileRef.current && fileRef.current.click();
  }

  function handleStepClick(n) {
    const screens = ['WF1','WF2','WF3','WF4','WF5'];
    if (stepHistory.includes(screens[n-1])) navigate(screens[n-1]);
  }

  function handleContinueToWF5() {
    setFormData({ ...formData, factures: uploadState.factures, biopropane });
    if (returnTo === 'WF5') setReturnTo(null);
    navigate('WF5');
  }

  const { subscreen, currentFacture, factures, pendingFile, progress } = uploadState;
  const allUploaded = factures.every(Boolean);

  // ── Sous-écrans Mode B ────────────────────────────────────────────────────
  if (subscreen === 'PREPARE') {
    return (
      <WF4ModeB_Prepare
        factureNum={currentFacture}
        onReady={() => setSubscreen('FRAME')}
        onFileClick={triggerFilePicker}
        onNoFacture={() => navigate('WF4-sortie')}
        onBack={() => setSubscreen(null)}
      />
    );
  }
  if (subscreen === 'FRAME') {
    return (
      <WF4ModeB_Frame
        factureNum={currentFacture}
        onCapture={() => setSubscreen('CAMERA')}
        onFileClick={triggerFilePicker}
        onNoFacture={() => navigate('WF4-sortie')}
        onBack={() => setSubscreen('PREPARE')}
      />
    );
  }
  if (subscreen === 'CAMERA') {
    return (
      <WF4ModeB_Camera
        factureNum={currentFacture}
        onCapture={triggerFilePicker}
        onBack={() => setSubscreen('FRAME')}
      />
    );
  }
  if (subscreen === 'LOADING') {
    return <WF4ModeB_Loading factureNum={currentFacture} fileName={pendingFile?.name} progress={progress} />;
  }
  if (subscreen === 'SUCCESS') {
    return (
      <WF4ModeB_Success
        factureNum={currentFacture}
        file={factures[currentFacture - 1]}
        factures={factures}
        onAddNext={() => setSubscreen('PREPARE', { currentFacture: currentFacture + 1 })}
        onReturn={() => setSubscreen(null)}
        onFinish={() => setSubscreen(null)}
        onContinue={handleContinueToWF5}
      />
    );
  }
  if (subscreen === 'ERROR') {
    return (
      <WF4ModeB_Error
        factureNum={currentFacture}
        onRetry={() => setSubscreen('FRAME')}
        onFileClick={triggerFilePicker}
        onFinish={() => setSubscreen(null)}
      />
    );
  }

  // ── WF4 Principal ─────────────────────────────────────────────────────────
  return (
    <div className="screen-anim">
      <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,image/*" onChange={handleFileInput} />
      <TunnelHeader onHome={onHome} />
      <ProgressBar step={4} onStepClick={handleStepClick} />
      <div style={{ padding:'8px 16px 16px 16px' }}>
        <BackLink onClick={() => navigate('WF3')} />
        <div style={{ fontSize:22, fontWeight:700, marginBottom:12 }}>Vos factures de gaz</div>
        <InfoBlock>
          Avec vos factures, nous estimons votre consommation réelle et vous proposons le tarif le plus adapté. Les 3 factures sont nécessaires pour finaliser votre demande.
        </InfoBlock>
        <WarningBlock>
          <strong>Où trouver vos factures ?</strong><br />
          Chez vous : dans vos courriers. En ligne : espace client de votre fournisseur (Primagaz, Antargaz, Vitogaz) &gt; rubrique « Mes factures ».
        </WarningBlock>

        {[0,1,2].map(idx => (
          <UploadItem
            key={idx}
            index={idx}
            file={factures[idx]}
            phase={factures[idx] ? 'success' : 'empty'}
            progress={0}
            onZoneClick={openModeB}
            onDelete={deleteFacture}
          />
        ))}

        <div style={{ fontSize:13, color:'#666', marginBottom:16, textAlign:'center' }}>
          <span className="lnk-gray" onClick={() => navigate('WF4-sortie')}>
            Vous n'avez pas vos 3 factures ? Un conseiller peut vous rappeler pour vous aider.
          </span>
        </div>

        <div style={{ height:1, background:'#F0F0F0', margin:'4px 0 16px' }} />

        <FormField
          id="biopropane"
          label="Souhaitez-vous souscrire à l'option Biopropane ? (option payante)"
          tooltipText="Le biopropane est une version du propane issue de ressources renouvelables. Cette option entraîne un coût supplémentaire par rapport au propane standard."
          openTip={openTip}
          onToggleTip={id => setOpenTip(prev => prev === id ? null : id)}
        >
          <RadioGroup
            options={[{ value:'non', label:'Non merci' }, { value:'20', label:'Oui, 20 % biopropane' }, { value:'100', label:'Oui, 100 % biopropane' }]}
            value={biopropane}
            onChange={setBiopropane}
          />
        </FormField>

        <button
          className="btn-primary"
          style={{ marginTop:8, opacity: allUploaded ? 1 : 0.5 }}
          onClick={allUploaded ? handleContinueToWF5 : undefined}
          title={allUploaded ? '' : 'Veuillez uploader les 3 factures pour continuer'}
        >
          {returnTo === 'WF5' ? 'Enregistrer et retourner à la synthèse' : 'Continuer →'}
        </button>
        {!allUploaded && (
          <div style={{ fontSize:12, color:'#CC0000', marginTop:6, textAlign:'center' }}>
            Les 3 factures sont obligatoires pour continuer.
          </div>
        )}

        <div style={{ marginTop:20, padding:12, background:'#F9F9F9', borderRadius:8, fontSize:11, color:'#999', lineHeight:1.6 }}>
          Les factures transmises sont utilisées exclusivement pour analyser votre consommation énergétique et estimer votre budget, afin de vous proposer une offre adaptée. Ces données sont traitées par Butagaz, dans le cadre de l'étude de votre projet, conformément au RGPD. Seules les informations nécessaires sont collectées et accessibles aux services internes concernés. Elles sont conservées uniquement le temps nécessaire à l'analyse de votre projet. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données à l'adresse suivante : protectiondesdonnees@butagaz.com. Vous pouvez également introduire une réclamation auprès de la CNIL.
        </div>
        <div style={{ height:40 }} />
      </div>
      <FooterBanner onRecall={showRecall} />
    </div>
  );
}

// ─── SCREEN: WF4-SORTIE — PAS DE FACTURES ────────────────────────────────────
function ScreenWF4Sortie({ formData, navigate, returnToSite, onHome }) {
  const [submitted, setSubmitted] = useState(false);
  const [rgpd, setRgpd] = useState(false);

  return (
    <div className="screen-anim">
      <TunnelHeader onHome={returnToSite || onHome} />
      <div style={{ padding:'24px 16px 32px 16px' }}>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:12 }}>Nous avons besoin de vos factures pour continuer</div>

        <div style={{ fontSize:14, color:'#666', marginBottom:16, lineHeight:1.6 }}>
          Les 3 factures sont indispensables pour analyser votre consommation et vous proposer un tarif personnalisé. Sans elles, nous ne pouvons pas finaliser votre demande en ligne.
        </div>

        <WarningBlock>
          <strong>Où trouver vos factures ?</strong><br />
          · Dans votre boîte aux lettres<br />
          · Dans votre espace client en ligne (Primagaz, Antargaz, Vitogaz)<br />
          · Sur l'appli de votre fournisseur<br />
          · Sur votre téléphone si vous les avez photographiées
        </WarningBlock>

        <div style={{ border:'1px solid #E0E0E0', borderRadius:10, padding:16, marginBottom:16 }}>
          <div style={{ fontWeight:600, fontSize:15, marginBottom:4 }}>Un conseiller peut vous aider</div>
          <div style={{ fontSize:13, color:'#666', marginBottom:12 }}>Vos informations :</div>
          <div style={{ background:'#F5F5F5', borderRadius:8, padding:12, marginBottom:12, fontSize:13 }}>
            {formData.prenom && <div>{formData.civilite} {formData.prenom} {formData.nom}</div>}
            {formData.telephone && <div>{formData.telephone}</div>}
            {formData.email && <div>{formData.email}</div>}
          </div>
          {!submitted ? (
            <>
              <CheckboxField checked={rgpd} onChange={setRgpd}>
                J'accepte que les informations saisies soient utilisées dans le cadre de la relation commerciale avec Butagaz, pour me recontacter.
              </CheckboxField>
              <button className="btn-primary" onClick={() => setSubmitted(true)}>Confirmer et Envoyer</button>
            </>
          ) : (
            <InfoBlock>Votre demande est bien enregistrée. Un conseiller vous contactera sous 24 h.</InfoBlock>
          )}
        </div>

        <div style={{ marginBottom:16 }}>
          <span className="lnk" style={{ fontSize:14 }} onClick={() => navigate('WF4')}>
            ← J'ai retrouvé mes factures, reprendre ma démarche
          </span>
        </div>

        <div style={{ textAlign:'center' }}>
          <span className="lnk-gray" style={{ fontSize:13 }} onClick={returnToSite}>Retour au site butagaz.fr</span>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: WF5 — SYNTHÈSE ───────────────────────────────────────────────────
function ScreenWF5({ formData, navigate, showRecall, setReturnTo, stepHistory, onHome }) {
  function handleModify(target) {
    setReturnTo('WF5');
    navigate(target);
  }

  function handleStepClick(n) {
    const screens = ['WF1','WF2','WF3','WF4','WF5'];
    if (stepHistory.includes(screens[n-1])) navigate(screens[n-1]);
  }

  const factureCount = (formData.factures || []).filter(Boolean).length;
  const bioPropaneLabel = formData.biopropane === '20' ? '20 % biopropane' : formData.biopropane === '100' ? '100 % biopropane' : 'Non';

  return (
    <div className="screen-anim">
      <TunnelHeader onHome={onHome} />
      <ProgressBar step={5} onStepClick={handleStepClick} />
      <div style={{ padding:'8px 16px 80px 16px' }}>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:4 }}>Vérifiez vos informations</div>
        <div style={{ fontSize:14, color:'#666', marginBottom:20, lineHeight:1.5 }}>Relisez bien avant d'envoyer. Vous pouvez modifier chaque section si besoin.</div>

        {/* Section 1 : Coordonnées */}
        <div style={{ border:'1px solid #E0E0E0', borderRadius:10, padding:16, marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <div style={{ fontWeight:600, fontSize:15 }}>Coordonnées</div>
            <span className="lnk" style={{ fontSize:13 }} onClick={() => handleModify('WF2')}>Modifier &gt;</span>
          </div>
          {[
            formData.civilite && `${formData.civilite} ${formData.prenom} ${formData.nom}`,
            formData.adresse,
            formData.telephone,
            formData.email,
            formData.statut === 'proprietaire' ? 'Propriétaire' : 'Locataire',
            formData.preferenceAppel === 'indifferent' ? 'Rappel : indifférent' : formData.preferenceAppel === 'matin' ? 'Rappel : matin' : formData.preferenceAppel === 'aprem' ? 'Rappel : après-midi' : null,
          ].filter(Boolean).map((v,i) => (
            <div key={i} style={{ fontSize:13, color:'#666', marginBottom:4 }}>{v}</div>
          ))}
        </div>

        {/* Section 2 : Installation */}
        <div style={{ border:'1px solid #E0E0E0', borderRadius:10, padding:16, marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <div style={{ fontWeight:600, fontSize:15 }}>Installation</div>
            <span className="lnk" style={{ fontSize:13 }} onClick={() => handleModify('WF3')}>Modifier &gt;</span>
          </div>
          <div style={{ fontSize:13, color:'#666', marginBottom:4 }}>
            Citerne : {formData.citerneType === 'apparente' ? 'Apparente' : formData.citerneType === 'enfouie' ? 'Enfouie' : 'Non précisé'}
          </div>
          <div style={{ fontSize:13, color:'#666', marginBottom:4 }}>
            Garder le même type : {formData.conserverType === 'oui' ? 'Oui' : formData.conserverType === 'non' ? 'Non' : 'Non précisé'}
          </div>
          <div style={{ fontSize:13, color:'#666' }}>
            {formData.citerneMemeDomicile ? 'Même adresse que le domicile' : formData.adresseCiterne}
          </div>
        </div>

        {/* Section 3 : Factures */}
        <div style={{ border:'1px solid #E0E0E0', borderRadius:10, padding:16, marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <div style={{ fontWeight:600, fontSize:15 }}>Factures</div>
            <span className="lnk" style={{ fontSize:13 }} onClick={() => handleModify('WF4')}>Modifier &gt;</span>
          </div>
          <div style={{ fontSize:13, color:'#666', marginBottom:4 }}>{factureCount} facture{factureCount > 1 ? 's' : ''} envoyée{factureCount > 1 ? 's' : ''}</div>
          {(formData.factures || []).filter(Boolean).map((f, i) => (
            <div key={i} style={{ fontSize:12, color:'#999', marginBottom:2 }}>· {f.name}</div>
          ))}
          <div style={{ fontSize:13, color:'#666', marginTop:6 }}>Biopropane : {bioPropaneLabel}</div>
        </div>

        <InfoBlock>
          En validant, vous recevrez une proposition de contrat personnalisée sous 48 h ouvrées. Aucun engagement à ce stade.
        </InfoBlock>

        <button className="btn-primary" onClick={() => navigate('WF5b')}>
          Valider et envoyer ma demande
        </button>

        <div style={{ textAlign:'center', marginTop:16, fontSize:13, color:'#666' }}>
          Une question avant d'envoyer ? <strong>01 XX XX XX XX</strong>
        </div>
      </div>
      <FooterBanner onRecall={showRecall} />
    </div>
  );
}

// ─── SCREEN: WF5b — CONFIRMATION ─────────────────────────────────────────────
function ScreenWF5b({ formData, navigate, returnToSite, onHome }) {
  const refNumber = useRef('BSWT-2026-' + String(Math.floor(1000 + Math.random() * 9000)));
  const isApparente = formData.citerneType === 'apparente';

  return (
    <div className="screen-anim">
      <TunnelHeader onHome={returnToSite || onHome} />
      <div style={{ padding:'24px 16px 32px 16px', textAlign:'center' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'#F0FFF4', border:'2px solid #22C55E', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:28, color:'#166534' }}>✓</div>

        <div style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>Votre demande est envoyée</div>
        <div style={{ fontSize:13, color:'#999', marginBottom:20 }}>Référence : {refNumber.current}</div>

        <div style={{ textAlign:'left' }}>
          <InfoBlock>
            Vous recevrez une proposition de contrat personnalisée sous 48 h ouvrées. Aucun engagement de votre part.
          </InfoBlock>

          {isApparente && (
            <OfferBlock>
              <strong>Offre de bienvenue : 200 € d'avoir gaz offerts</strong> sur votre première commande. Détails dans votre proposition de contrat.
            </OfferBlock>
          )}

          <div style={{ border:'1px solid #E0E0E0', borderRadius:10, padding:16, marginBottom:16 }}>
            <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:8 }}>
              <div style={{ width:44, height:44, borderRadius:'50%', background:'#F0F0F0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>👤</div>
              <div>
                <div style={{ fontWeight:600, fontSize:14 }}>Sabrina et Éric</div>
                <div style={{ fontSize:13, color:'#666' }}>Vos contacts locaux</div>
                <div style={{ fontSize:13, color:'#666' }}>Appel depuis le 01 XX XX XX XX</div>
              </div>
              <span style={{ marginLeft:'auto', display:'inline-flex', alignItems:'center', justifyContent:'center', width:17, height:17, borderRadius:'50%', border:'1px solid #AAA', fontSize:10, color:'#888', cursor:'pointer' }}
                title="Si vous avez une question, vous pouvez les contacter directement. Ils connaissent déjà votre dossier."
              >i</span>
            </div>
          </div>
        </div>

        <button className="btn-secondary" onClick={returnToSite}>← Retour au site butagaz.fr</button>
      </div>
    </div>
  );
}

// ─── SCREEN ROUTER ────────────────────────────────────────────────────────────
function ScreenRouter({ screen, formData, setFormData, navigate, showRecall, returnTo, setReturnTo, stepHistory, offerMode, returnToSite, onHome, simulateError, setSimulateError }) {
  switch (screen) {
    case 'PAGE0':       return <ScreenPAGE0 offerMode={offerMode} navigate={navigate} showRecall={showRecall} />;
    case 'WF0-step2':   return <ScreenWF0Step2 formData={formData} setFormData={setFormData} navigate={navigate} showRecall={showRecall} onHome={onHome} />;
    case 'WF0-step3':   return <ScreenWF0Step3 navigate={navigate} returnToSite={returnToSite} />;
    case 'WF1':         return <ScreenWF1 navigate={navigate} showRecall={showRecall} initChoice={formData._wf1Choice} onHome={onHome} />;
    case 'WF1bis':      return <ScreenWF1bis navigate={navigate} showRecall={showRecall} onHome={onHome} />;
    case 'WF1-sortie':  return <ScreenWF1Sortie formData={formData} navigate={navigate} returnToSite={returnToSite} onHome={onHome} />;
    case 'WF2':         return <ScreenWF2 formData={formData} setFormData={setFormData} navigate={navigate} showRecall={showRecall} returnTo={returnTo} setReturnTo={setReturnTo} stepHistory={stepHistory} onHome={onHome} />;
    case 'WF2-sortie':  return <ScreenWF2Sortie navigate={navigate} returnToSite={returnToSite} />;
    case 'WF3':         return <ScreenWF3 formData={formData} setFormData={setFormData} navigate={navigate} showRecall={showRecall} returnTo={returnTo} setReturnTo={setReturnTo} stepHistory={stepHistory} onHome={onHome} />;
    case 'WF4':         return <ScreenWF4 formData={formData} setFormData={setFormData} navigate={navigate} showRecall={showRecall} returnTo={returnTo} setReturnTo={setReturnTo} stepHistory={stepHistory} onHome={onHome} simulateError={simulateError} setSimulateError={setSimulateError} />;
    case 'WF4-sortie':  return <ScreenWF4Sortie formData={formData} navigate={navigate} returnToSite={returnToSite} onHome={onHome} />;
    case 'WF5':         return <ScreenWF5 formData={formData} navigate={navigate} showRecall={showRecall} setReturnTo={setReturnTo} stepHistory={stepHistory} onHome={onHome} />;
    case 'WF5b':        return <ScreenWF5b formData={formData} navigate={navigate} returnToSite={returnToSite} onHome={onHome} />;
    default:            return <div style={{padding:24,color:'#999'}}>Écran non trouvé : {screen}</div>;
  }
}

// ─── PANORAMA THUMBNAILS ──────────────────────────────────────────────────────
function ThumbContent({ screen, scenario }) {
  const bg = { ok:'#DCFCE7', branch:'#FEF3C7', exit:'#FEE2E2' };
  const type = BADGE_TYPE[screen] || 'ok';
  const f = scenario?.form || {};

  const lines = {
    'PAGE0': ['Site butagaz.fr', '░ Header + breadcrumb', '░ Texte intro page', '[ Zone active ]', '[ Souscrire ]', '[ Appeler ]', '[ Être rappelé ]', '░ Footer'],
    'WF0-step2': ['Formulaire rappel', '_ Prénom', '_ Nom', '_ Téléphone', '_ Email', '[ Envoyer ]'],
    'WF0-step3': ['✓ Demande reçue', 'Rappel sous 24h', '[ Retour au site ]'],
    'WF1': ['Qualification', f._wf1Choice === 'changer' ? '✓ Changer fournisseur' : '— Changer fournisseur', '— Maison avec citerne', '— Changer d\'énergie'],
    'WF1bis': ['Prérequis', '[ Info ] 3 factures requises', '[ Aide ] Où trouver ?', '[ C\'est parti ]'],
    'WF1-sortie': ['⚠ Non éligible', '[ Appeler ]', '[ Formulaire rappel ]', '[ Retour site ]'],
    'WF2': ['Coordonnées', f.prenom ? `_ ${f.prenom} ${f.nom}` : '_ Prénom / Nom', f.adresse ? `_ ${f.adresse.substring(0,20)}…` : '_ Adresse', f.telephone||'_ Téléphone', f.email||'_ Email'],
    'WF2-sortie': ['⚠ Locataire', 'Parcours réservé propriétaires', '[ 09 70 81 80 65 ]', '[ Être rappelé ]'],
    'WF3': ['Installation', f.citerneType === 'apparente' ? '✓ Apparente' : f.citerneType === 'enfouie' ? '✓ Enfouie' : '○ Apparente / ○ Enfouie', f.conserverType ? `✓ Conserver : ${f.conserverType}` : '○ Conserver : oui / non'],
    'WF4': ['Factures', ...(f.factures||[null,null,null]).map((ff,i) => ff ? `✓ Facture ${i+1}` : `□ Facture ${i+1}`),'_ Biopropane'],
    'WF4-sortie': ['⚠ Pas de factures', '[ Info aide ]', '[ Formulaire rappel ]', '← Reprendre'],
    'WF5': ['Synthèse', '— Coordonnées [Modifier]', '— Installation [Modifier]', '— Factures [Modifier]', '[ Valider et envoyer ]'],
    'WF5b': ['✓ Demande envoyée', 'Réf. BSWT-2026-XXXX', '[ Bloc offre ]', 'Contact : Sabrina & Éric'],
    'MODAL': ['[ Modale rappel ]', '_ Nom', '_ Téléphone', '[ Envoyer ]'],
  };

  const content = lines[screen] || [screen];

  return (
    <div style={{ padding:'6px 8px', height:'100%' }}>
      <div style={{ background: bg[type], borderRadius:4, padding:'3px 6px', fontSize:9, fontWeight:700, marginBottom:6, display:'inline-block' }}>
        {SCREEN_LABELS[screen] || screen}
      </div>
      {content.map((line, i) => (
        <div key={i} style={{ fontSize:9, color: i===0 ? '#1A1A1A' : '#666', fontWeight: i===0 ? 600 : 400, marginBottom:3, lineHeight:1.3 }}>{line}</div>
      ))}
    </div>
  );
}

function ScreenThumb({ screen, scenario, onClick }) {
  return (
    <div className="screen-thumb" style={{ width:140, flexShrink:0 }} onClick={onClick}>
      <div className="thumb-frame" style={{ width:140, height:220, background:'#FFF', borderRadius:8, border:'1px solid #E0E0E0', overflow:'hidden', marginBottom:6, transition:'border-color 0.1s, box-shadow 0.1s' }}>
        {/* Mini header */}
        <div style={{ height:18, background:'#FFF', borderBottom:'1px solid #E8E8E8', display:'flex', alignItems:'center', padding:'0 6px', justifyContent:'space-between' }}>
          <span style={{ fontSize:8, fontWeight:700 }}>Butagaz</span>
          <span style={{ fontSize:7, color:'#999' }}>Retour</span>
        </div>
        <ThumbContent screen={screen} scenario={scenario} />
      </div>
      <div style={{ fontSize:10, fontWeight:600, color:'#1A1A1A', marginBottom:2 }}>{SCREEN_LABELS[screen]}</div>
      <span className={`badge-${BADGE_TYPE[screen]||'ok'}`} style={{ fontSize:9 }}>
        {BADGE_TYPE[screen]==='ok' ? 'Étape' : BADGE_TYPE[screen]==='branch' ? 'Branchement' : 'Sortie'}
      </span>
    </div>
  );
}

function ArrowBetween() {
  return <div style={{ display:'flex', alignItems:'center', paddingTop:80, flexShrink:0 }}><span style={{ fontSize:18, color:'#CCC' }}>→</span></div>;
}

function ScenarioRow({ scenarioId, scenario, onThumbClick }) {
  return (
    <div className="pano-scenario-row">
      <div className="pano-scenario-header">
        <span style={{ fontWeight:700, fontSize:14 }}>{scenario.label}</span>
        <span style={{ fontSize:12, color:'#999' }}>{scenario.shortDesc}</span>
      </div>
      <div className="panorama-row scroll-h">
        {scenario.screens.map((screen, i) => (
          <div key={screen} style={{ display:'flex', alignItems:'flex-start', gap:0 }}>
            {i > 0 && <ArrowBetween />}
            <div style={{ marginLeft: i > 0 ? 0 : 0 }}>
              <ScreenThumb
                screen={screen}
                scenario={scenario}
                onClick={() => onThumbClick(scenarioId, screen, i)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WELCOME SCREEN ───────────────────────────────────────────────────────────
function ScreenWelcome({ onStart }) {
  const qrUrl = typeof window !== 'undefined'
    ? `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(window.location.href)}&color=FFFFFF&bgcolor=1A1A1A`
    : '';

  return (
    <div style={{ minHeight:'100vh', background:'#111', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 20px' }}>
      <div style={{ maxWidth:520, width:'100%' }}>
        {/* Header */}
        <div style={{ marginBottom:6, fontSize:11, color:'#555', textTransform:'uppercase', letterSpacing:'2px' }}>Prototype interactif v2.1</div>
        <h1 style={{ fontSize:48, fontWeight:800, color:'#FFF', letterSpacing:'-2px', lineHeight:1, marginBottom:8 }}>Butaswitch</h1>
        <div style={{ fontSize:16, color:'#666', marginBottom:40, lineHeight:1.5 }}>
          Parcours de souscription GPL en ligne — Butagaz
        </div>

        {/* Stats grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:24 }}>
          {[
            { n:'6', label:'scénarios' },
            { n:'13', label:'écrans' },
            { n:'3', label:'modes de vue' },
          ].map(item => (
            <div key={item.n} style={{ background:'#1A1A1A', borderRadius:10, padding:'14px 12px', textAlign:'center' }}>
              <div style={{ fontSize:28, fontWeight:800, color:'#FFF', lineHeight:1 }}>{item.n}</div>
              <div style={{ fontSize:11, color:'#666', marginTop:4 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{ background:'#1A1A1A', borderRadius:10, padding:'16px 20px', marginBottom:24, lineHeight:1.7, fontSize:13, color:'#888' }}>
          Prototype du tunnel Butaswitch — de la page butagaz.fr jusqu'à la confirmation de demande. Conçu pour tester la lisibilité du parcours, la cohérence des sorties, et la charge perçue des étapes de qualification.
        </div>

        {/* CTAs */}
        <div style={{ display:'flex', gap:10, marginBottom:24 }}>
          <button
            onClick={() => onStart('panorama')}
            style={{ flex:1, padding:'14px 20px', background:'#FFF', color:'#1A1A1A', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', letterSpacing:'-0.2px' }}
          >
            ⊞ Vue Panorama
          </button>
          <button
            onClick={() => onStart('navigation')}
            style={{ flex:1, padding:'14px 20px', background:'transparent', color:'#FFF', border:'2px solid #333', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', letterSpacing:'-0.2px' }}
          >
            ▶ Navigation interactive
          </button>
        </div>

        {/* QR code */}
        <div style={{ display:'flex', alignItems:'center', gap:16, background:'#1A1A1A', borderRadius:10, padding:'14px 16px' }}>
          {qrUrl ? (
            <img src={qrUrl} alt="QR code" style={{ width:80, height:80, borderRadius:6, flexShrink:0 }} />
          ) : (
            <div style={{ width:80, height:80, background:'#222', borderRadius:6, flexShrink:0 }} />
          )}
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:'#FFF', marginBottom:4 }}>Tester sur mobile</div>
            <div style={{ fontSize:12, color:'#666', lineHeight:1.6 }}>
              Scannez ce QR code pour ouvrir le prototype sur votre téléphone et tester le parcours en contexte réel, en viewport 375px.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PANORAMA VIEW ────────────────────────────────────────────────────────────
function PanoramaView({ activeScenario, setActiveScenario, onThumbClick }) {
  const tabs = ['A','B','C','D','E','F','Tous'];

  return (
    <div style={{ minHeight:'100vh', background:'#D8D8D8' }}>
      {/* Tabs */}
      <div style={{ background:'#FFF', borderBottom:'1px solid #E0E0E0', padding:'10px 16px', display:'flex', gap:8, position:'sticky', top:0, zIndex:100, overflowX:'auto' }}>
        <span style={{ fontSize:13, fontWeight:600, color:'#666', display:'flex', alignItems:'center', marginRight:8, flexShrink:0 }}>Scénario :</span>
        {tabs.map(t => (
          <button key={t} className={`tab-btn${activeScenario===t?' active':''}`} onClick={() => setActiveScenario(t)}>
            {t === 'Tous' ? 'Tous' : SCENARIOS[t]?.label}
          </button>
        ))}
      </div>

      <div style={{ padding:'16px' }}>
        {activeScenario === 'Tous' ? (
          Object.entries(SCENARIOS).map(([id, sc]) => (
            <ScenarioRow key={id} scenarioId={id} scenario={sc} onThumbClick={onThumbClick} />
          ))
        ) : (
          SCENARIOS[activeScenario] && (
            <>
              <div style={{ fontSize:13, color:'#666', marginBottom:12 }}>
                {SCENARIOS[activeScenario].shortDesc}
              </div>
              <ScenarioRow scenarioId={activeScenario} scenario={SCENARIOS[activeScenario]} onThumbClick={onThumbClick} />
            </>
          )
        )}
      </div>
    </div>
  );
}

// ─── NAVIGATION VIEW ─────────────────────────────────────────────────────────
function NavigationView({
  scenario, setScenario, currentScreen, setCurrentScreen,
  formData, setFormData, showAnnotations, setShowAnnotations,
  returnTo, setReturnTo, stepHistory, setStepHistory,
  offerMode, setOfferMode, onSwitchToPanorama, isLibre,
}) {
  const [showRecallModal, setShowRecallModal] = useState(false);
  const [screenKey, setScreenKey] = useState(0);
  const [simulateError, setSimulateError] = useState(false);
  const mobileFrameRef = useRef(null);

  const sc = scenario && SCENARIOS[scenario];
  const screenList = isLibre ? null : sc?.screens;
  const currentIdx = screenList ? screenList.indexOf(currentScreen) : -1;

  function navigate(screen) {
    if (!isLibre && screen !== currentScreen) {
      setStepHistory(prev => prev.includes(screen) ? prev : [...prev, screen]);
    }
    setCurrentScreen(screen);
    setScreenKey(k => k + 1);
    // Scroll back to top of mobile frame on navigation
    setTimeout(() => {
      if (mobileFrameRef.current) mobileFrameRef.current.scrollTop = 0;
    }, 50);
  }

  function returnToSite() {
    navigate('PAGE0');
    setTimeout(() => {
      const encart = document.getElementById('encart-souscription');
      if (encart) encart.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
  }

  function handlePrev() {
    if (currentIdx > 0) navigate(screenList[currentIdx - 1]);
  }
  function handleNext() {
    if (currentIdx < screenList.length - 1) navigate(screenList[currentIdx + 1]);
  }

  const annText = ANNOTATIONS[currentScreen];
  const ctxText = scenario && CONTEXT_TEXT[scenario];

  const isTunnelScreen = STEP_FOR_SCREEN[currentScreen] !== undefined;

  return (
    <div style={{ minHeight:'100vh', background:'#D8D8D8', display:'flex', flexDirection:'column' }}>
      {/* Nav top bar */}
      <div style={{ background:'#FFF', borderBottom:'1px solid #E0E0E0', padding:'8px 16px', display:'flex', alignItems:'center', gap:12, position:'sticky', top:0, zIndex:200, flexWrap:'wrap' }}>
        {!isLibre && (
          <select
            value={scenario || ''}
            onChange={e => {
              const id = e.target.value;
              setScenario(id);
              const sc = SCENARIOS[id];
              setFormData({ ...sc.form, _wf1Choice: sc.screenChoices?.WF1 });
              setCurrentScreen(sc.screens[0]);
              setStepHistory([sc.screens[0]]);
              setReturnTo(null);
              setScreenKey(k => k + 1);
            }}
            style={{ padding:'4px 8px', border:'1px solid #D0D0D0', borderRadius:6, fontSize:13, background:'#FFF' }}
          >
            {Object.entries(SCENARIOS).map(([id, sc]) => (
              <option key={id} value={id}>{sc.label}</option>
            ))}
          </select>
        )}

        <div style={{ flex:1, fontSize:13, color:'#666' }}>
          {currentScreen ? (
            <span><strong>{SCREEN_LABELS[currentScreen]}</strong> {currentIdx >= 0 && screenList ? `· ${currentIdx+1}/${screenList.length}` : ''}</span>
          ) : null}
        </div>

        {!isLibre && (
          <button
            style={{ padding:'4px 10px', border:'1px solid #D0D0D0', borderRadius:6, fontSize:12, background: showAnnotations ? '#1A1A1A' : '#FFF', color: showAnnotations ? '#FFF' : '#666', cursor:'pointer' }}
            onClick={() => setShowAnnotations(!showAnnotations)}
          >
            {showAnnotations ? 'Masquer annotations' : 'Annotations'}
          </button>
        )}

        <button
          style={{ padding:'4px 10px', border:'1px solid #D0D0D0', borderRadius:6, fontSize:12, background:'#FFF', color:'#666', cursor:'pointer' }}
          onClick={onSwitchToPanorama}
        >
          Vue panorama
        </button>
      </div>

      {/* Main content */}
      <div className="nav-main" style={{ flex:1, display:'flex', gap:16, padding:'16px', justifyContent:'center', alignItems:'flex-start' }}>
        {/* Annotations panel */}
        {!isLibre && showAnnotations && (
          <div className="nav-panels" style={{ width:220, background:'#FFF', borderRadius:10, padding:16, fontSize:12, lineHeight:1.7, color:'#333', flexShrink:0, position:'sticky', top:72 }}>
            <div style={{ fontWeight:700, fontSize:13, marginBottom:10, color:'#1A1A1A', borderBottom:'1px solid #E8E8E8', paddingBottom:8 }}>Annotations UX</div>
            <div style={{ color:'#555', lineHeight:1.7 }}>{annText || 'Aucune annotation pour cet écran.'}</div>
          </div>
        )}

        {/* Mobile frame */}
        <div className="mobile-frame-wrap" style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
          <div
            key={screenKey}
            ref={mobileFrameRef}
            style={{ width:375, height:812, background:'#FFF', borderRadius:12, overflowY:'auto', overflowX:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.15)', position:'relative' }}
            className="mobile-scroll"
          >
            <ScreenRouter
              screen={currentScreen}
              formData={formData}
              setFormData={setFormData}
              navigate={navigate}
              showRecall={() => setShowRecallModal(true)}
              returnTo={returnTo}
              setReturnTo={setReturnTo}
              stepHistory={stepHistory}
              offerMode={offerMode}
              returnToSite={returnToSite}
              onHome={returnToSite}
              simulateError={simulateError}
              setSimulateError={setSimulateError}
            />
          </div>
          {/* Simuler erreur — mode libre uniquement */}
          {isLibre && (
            <button
              onClick={() => setSimulateError(v => !v)}
              style={{
                padding:'5px 12px', fontSize:12, cursor:'pointer', borderRadius:6,
                background: simulateError ? '#FFF0F0' : '#FFF',
                border: simulateError ? '1px solid #CC0000' : '1px solid #D0D0D0',
                color: simulateError ? '#CC0000' : '#999',
              }}
            >
              {simulateError ? '✗ Erreur activée — prochain upload → C2' : 'Simuler erreur upload'}
            </button>
          )}
        </div>

        {/* Context panel */}
        {!isLibre && showAnnotations && (
          <div className="nav-panels" style={{ width:220, background:'#FFF', borderRadius:10, padding:16, fontSize:12, lineHeight:1.7, color:'#333', flexShrink:0, position:'sticky', top:72 }}>
            <div style={{ fontWeight:700, fontSize:13, marginBottom:10, color:'#1A1A1A', borderBottom:'1px solid #E8E8E8', paddingBottom:8 }}>Contexte scénario</div>
            <div style={{ whiteSpace:'pre-wrap', color:'#555' }}>{ctxText || '—'}</div>
          </div>
        )}
      </div>

      {/* Prev / Next buttons */}
      {screenList && screenList.length > 1 && (
        <div style={{ background:'#FFF', borderTop:'1px solid #E0E0E0', padding:'10px 16px', display:'flex', justifyContent:'center', gap:16 }}>
          <button className="btn-sm" onClick={handlePrev} style={{ opacity: currentIdx > 0 ? 1 : 0.35 }} disabled={currentIdx <= 0}>
            ← Étape précédente
          </button>
          <div style={{ display:'flex', gap:4, alignItems:'center' }}>
            {screenList.map((s, i) => (
              <div key={s} style={{ width:6, height:6, borderRadius:'50%', background: i === currentIdx ? '#1A1A1A' : '#DDD', flexShrink:0 }} />
            ))}
          </div>
          <button className="btn-sm" onClick={handleNext} style={{ opacity: currentIdx < screenList.length-1 ? 1 : 0.35 }} disabled={currentIdx >= screenList.length-1}>
            Étape suivante →
          </button>
        </div>
      )}

      {showRecallModal && (
        <RecallModal formData={formData} onClose={() => setShowRecallModal(false)} />
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [isWelcome, setIsWelcome] = useState(true);
  const [mode, setMode] = useState('panorama'); // 'panorama' | 'navigation' | 'libre'
  const [panoramaScenario, setPanoramaScenario] = useState('A');
  const [scenario, setScenario] = useState('A');
  const [currentScreen, setCurrentScreen] = useState('PAGE0');
  const [formData, setFormData] = useState(() => ({
    ...SCENARIOS.A.form,
    _wf1Choice: SCENARIOS.A.screenChoices?.WF1,
  }));
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [returnTo, setReturnTo] = useState(null);
  const [stepHistory, setStepHistory] = useState(['PAGE0']);
  const [offerMode, setOfferMode] = useState(false);

  function handleStart(startMode) {
    setIsWelcome(false);
    setMode(startMode);
  }

  function handleThumbClick(scenarioId, screen, idx) {
    const sc = SCENARIOS[scenarioId];
    setScenario(scenarioId);
    setFormData({ ...sc.form, _wf1Choice: sc.screenChoices?.WF1 });
    setCurrentScreen(screen);
    setStepHistory(sc.screens.slice(0, idx + 1));
    setReturnTo(null);
    setMode('navigation');
  }

  function handleModeChange(newMode) {
    if (newMode === 'libre') {
      setFormData({ ...EMPTY_FORM });
      setCurrentScreen('PAGE0');
      setStepHistory(['PAGE0']);
      setReturnTo(null);
    }
    setMode(newMode);
  }

  if (isWelcome) {
    return (
      <>
        <InjectCSS />
        <ScreenWelcome onStart={handleStart} />
      </>
    );
  }

  return (
    <>
      <InjectCSS />

      {/* Top mode bar */}
      <div style={{ background:'#1A1A1A', padding:'8px 16px', display:'flex', alignItems:'center', gap:16, position:'sticky', top:0, zIndex:300 }}>
        <span
          style={{ color:'#FFF', fontWeight:700, fontSize:14, marginRight:8, cursor:'pointer' }}
          onClick={() => setIsWelcome(true)}
          title="Retour à l'accueil"
        >Butaswitch</span>
        <span style={{ color:'#555', fontSize:12, marginRight:8 }}>v2.1</span>
        {['panorama','navigation','libre'].map(m => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            style={{
              padding:'4px 12px', borderRadius:6, fontSize:12, border:'none', cursor:'pointer',
              background: mode===m ? '#FFF' : 'transparent',
              color: mode===m ? '#1A1A1A' : '#999',
              fontWeight: mode===m ? 600 : 400,
            }}
          >
            {m === 'panorama' ? '⊞ Panorama' : m === 'navigation' ? '▶ Navigation' : '✎ Mode libre'}
          </button>
        ))}
        <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#AAA', cursor:'pointer', marginLeft:'auto', userSelect:'none' }}>
          <input
            type="checkbox"
            checked={offerMode}
            onChange={e => setOfferMode(e.target.checked)}
            style={{ accentColor:'#FFF', cursor:'pointer' }}
          />
          Activer l'offre 200 €
        </label>
      </div>

      {mode === 'panorama' && (
        <PanoramaView
          activeScenario={panoramaScenario}
          setActiveScenario={setPanoramaScenario}
          onThumbClick={handleThumbClick}
        />
      )}

      {(mode === 'navigation' || mode === 'libre') && (
        <NavigationView
          scenario={mode === 'libre' ? null : scenario}
          setScenario={setScenario}
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          formData={formData}
          setFormData={setFormData}
          showAnnotations={showAnnotations}
          setShowAnnotations={setShowAnnotations}
          returnTo={returnTo}
          setReturnTo={setReturnTo}
          stepHistory={stepHistory}
          setStepHistory={setStepHistory}
          offerMode={offerMode}
          setOfferMode={setOfferMode}
          onSwitchToPanorama={() => setMode('panorama')}
          isLibre={mode === 'libre'}
        />
      )}
    </>
  );
}
