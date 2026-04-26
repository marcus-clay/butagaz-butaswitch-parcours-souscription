/**
 * Butaswitch — Script de screenshots automatiques
 * Génère un PNG par écran, nommé et numéroté.
 *
 * Prérequis :
 *   npm install playwright
 *   npx playwright install chromium
 *
 * Usage :
 *   node screenshots.js
 *   node screenshots.js --url http://localhost:5173   (dev local)
 *   node screenshots.js --url https://mon-url.vercel.app
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────

const DEFAULT_URL = 'https://prototype-hnnylzzk1-hugos-projects-0ac0cf31.vercel.app';

const args = process.argv.slice(2);
const urlFlagIndex = args.indexOf('--url');
const BASE_URL = urlFlagIndex !== -1 ? args[urlFlagIndex + 1] : DEFAULT_URL;

const OUTPUT_DIR = path.join(__dirname, 'screenshots');

// ─── Liste des écrans — même ordre que GALLERY_ITEMS dans App.jsx ─────────────

const SCREENS = [
  { label: 'PAGE0 — Site Butagaz' },
  { label: 'WF1 — Qualification' },
  { label: 'WF1 — Propriétaire · Locataire' },
  { label: 'WF1bis — Prérequis' },
  { label: 'WF2 — Coordonnées' },
  { label: 'WF3 — Installation' },
  { label: 'WF4 — Factures' },
  { label: 'WF4 — Préparez votre facture' },
  { label: 'WF4 — C1 (facture reçue)' },
  { label: 'WF4 — C2 (photo illisible)' },
  { label: 'WF5 — Synthèse' },
  { label: 'WF5b — Confirmation avec offre' },
  { label: 'WF5b — Confirmation sans offre' },
  { label: 'Sortie 1 — Non éligible' },
  { label: 'Sortie 2 — Locataire' },
  { label: 'Sortie 3 — Pas de factures' },
];

// ─── Utilitaire : sanitize nom de fichier ─────────────────────────────────────

function toFilename(index, label) {
  const num = String(index + 1).padStart(2, '0');
  const slug = label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')         // retire accents
    .replace(/[^a-zA-Z0-9\s\-]/g, '')        // retire caractères spéciaux
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
  return `${num}_${slug}.png`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`\n📸 Butaswitch — ${SCREENS.length} écrans à capturer`);
  console.log(`   Source : ${BASE_URL}`);
  console.log(`   Destination : ${OUTPUT_DIR}\n`);

  const browser = await chromium.launch({ headless: true });

  for (let i = 0; i < SCREENS.length; i++) {
    const screen = SCREENS[i];
    const filename = toFilename(i, screen.label);
    const url = `${BASE_URL}?export=${i}`;

    const page = await browser.newPage();

    // Viewport 375px — largeur iPhone standard
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto(url, { waitUntil: 'networkidle' });

    // Attendre que le composant soit monté (attribut data-export-ready)
    await page.waitForSelector('[data-export-ready="true"]', { timeout: 8000 }).catch(() => {});

    // Laisser les animations CSS se terminer
    await page.waitForTimeout(600);

    await page.screenshot({
      path: path.join(OUTPUT_DIR, filename),
      fullPage: true,
    });

    console.log(`  ✓ ${filename}`);
    await page.close();
  }

  await browser.close();

  console.log(`\n✅ ${SCREENS.length} screenshots enregistrés dans :`);
  console.log(`   ${OUTPUT_DIR}\n`);
}

run().catch(err => {
  console.error('\n❌ Erreur :', err.message);
  process.exit(1);
});
