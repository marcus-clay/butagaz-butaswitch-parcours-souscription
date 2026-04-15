// Butaswitch — Prototype interactif v2
// Fichier unique React JSX — Simon White / Victor Soussan Studio
// Avril 2026 — Intègre les décisions FigJam (Pierre-Louis du Chazaud, Élodie Jolly, Simon White)

import { useState, useEffect, useRef } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

// ─── CSS GLOBAL ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
:root {
  --but-blue: #439fdb;
  --but-blue-dark: #1a86cc;
  --but-blue-pastel: #ecf5fb;
  --but-red: #ec3431;
  --but-green: #4ac77c;
  --but-yellow: #ffeb36;
  --but-grey: #8b9aa4;
  --but-solid-grey: #666f7c;
  --but-dark: #1a1b20;
  --but-grad-green: linear-gradient(143deg,#88e7a3,#2aba5b);
  --but-grad-yellow: linear-gradient(177deg,#ffed48,#ffc42b);
  --but-grad-blue: linear-gradient(180deg,#8fd2e1,#1a86cc);
  --but-grad-red: linear-gradient(180deg,#ff7c44,#ec3431);
  --font-main: 'Nunito', system-ui, -apple-system, sans-serif;
  --radius-pill: 999px;
  --radius-card: 16px;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: #f0f4f8;
  font-family: var(--font-main);
  color: #1a1b20;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
input, textarea, select, button { font-family: inherit; font-size: inherit; }
button { cursor: pointer; }

/* Courbes d'easing custom — plus punchées que les built-in */
:root {
  --ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out-strong: cubic-bezier(0.77, 0, 0.175, 1);
}

/* Screen animation — direction-aware */
.screen-anim { animation: screenIn 200ms var(--ease-out-strong); }
@keyframes screenIn { from { opacity: 0; transform: translateX(var(--screen-dir, 16px)); } to { opacity: 1; transform: translateX(0); } }
.screen-anim-back { animation: screenInBack 200ms var(--ease-out-strong); }
@keyframes screenInBack { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }

/* Choice block stagger */
.choice-block { animation: cbIn 220ms var(--ease-out-strong) both; }
.choice-block:nth-child(1) { animation-delay: 0ms; }
.choice-block:nth-child(2) { animation-delay: 40ms; }
.choice-block:nth-child(3) { animation-delay: 80ms; }
.choice-block:nth-child(4) { animation-delay: 120ms; }
.choice-block:nth-child(5) { animation-delay: 160ms; }
@keyframes cbIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

/* Tooltip */
.tooltip-anim { animation: ttIn 140ms var(--ease-out-strong); }
@keyframes ttIn { from { opacity: 0; transform: scale(0.95) translateY(-4px); } to { opacity: 1; transform: scale(1) translateY(0); } }

/* Slide down for conditional fields */
.slide-down { animation: sdIn 220ms var(--ease-out-strong); }
@keyframes sdIn { from { opacity: 0; transform: translateY(-6px); max-height: 0; } to { opacity: 1; transform: translateY(0); max-height: 400px; } }

/* Upload progress bar */
.upbar-track { height: 4px; background: #E0E0E0; border-radius: 2px; margin-top: 10px; overflow: hidden; }
.upbar-fill { height:100%; background:linear-gradient(90deg,#88e7a3,#2aba5b); border-radius:2px; transition:width 0.5s cubic-bezier(0.23,1,0.32,1); }

/* Choice blocks */
.choice-block { border: 1.5px solid #dde6ed; border-radius: 14px; padding: 16px; margin-bottom: 10px; cursor: pointer; transition: border-color 0.15s ease-out, background 0.12s ease-out, transform 0.12s var(--ease-out-strong), box-shadow 0.18s ease-out; }
@media (hover: hover) and (pointer: fine) { .choice-block:hover { border-color: #439fdb; background: #f5f9fd; } }
.choice-block:active { transform: scale(0.99); }
.choice-block.selected { border: 2px solid #439fdb !important; background: #ecf5fb; box-shadow: 0 0 0 3px rgba(67,159,219,0.14); }

/* Upload zone */
.upload-empty { border: 2px dashed #439fdb; border-radius: 14px; padding: 24px; text-align: center; cursor: pointer; transition: border-color 0.1s, background 0.1s; background: #f9fcff; }
.upload-empty:hover { border-color: #1a86cc; background: #ecf5fb; }

/* Input focus */
.field-input { width: 100%; min-height: 44px; border: 1.5px solid #439fdb; border-radius: 999px; padding: 0 18px; font-size: 14px; color: #1a1b20; background: #fff; transition: border-color 0.1s, box-shadow 0.1s; outline: none; font-family: var(--font-main); }
.field-input:focus { border-color: #1a86cc; box-shadow: 0 0 0 3px rgba(67,159,219,0.15); }
.field-input.err { border-color: #ec3431; }
textarea.field-input { padding: 12px 18px; resize: vertical; min-height: 90px; border-radius: 16px; }

/* Buttons */
.btn-primary { display: block; width: 100%; padding: 14px 24px; background: linear-gradient(143deg,#88e7a3,#2aba5b); color: #0d4a23; border: none; border-radius: 999px; font-size: 15px; font-weight: 700; cursor: pointer; text-align: center; transition: filter 0.15s ease-out, transform 0.12s ease-out; font-family: var(--font-main); }
.btn-primary:active { transform: scale(0.97); filter: brightness(0.96); }
@media (hover: hover) and (pointer: fine) { .btn-primary:hover { filter: brightness(1.06); } }
.btn-secondary { display: block; width: 100%; padding: 12px 24px; background: transparent; color: #439fdb; border: 1.5px solid #439fdb; border-radius: 999px; font-size: 15px; font-weight: 600; cursor: pointer; text-align: center; transition: background 0.15s ease-out, transform 0.12s ease-out; font-family: var(--font-main); }
.btn-secondary:active { transform: scale(0.97); }
@media (hover: hover) and (pointer: fine) { .btn-secondary:hover { background: #ecf5fb; } }
.btn-sm { display: inline-flex; align-items: center; padding: 8px 16px; background: #fff; color: #439fdb; border: 1.5px solid #439fdb; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; gap: 5px; min-height: 36px; transition: background 0.15s ease-out, transform 0.1s ease-out; }
.btn-sm:hover { background: #ecf5fb; }
.btn-sm:active { transform: scale(0.97); }

/* Welcome screen */
.welcome-mode-btn { width:100%; padding:18px 20px; border-radius:14px; cursor:pointer; text-align:left; display:block; background:linear-gradient(135deg,#ecf5fb,#dceefa); color:#0079c0; border:1.5px solid #c2dcf0; transition:border-color 0.15s, transform 0.12s, box-shadow 0.15s; font-family:var(--font-main); }
.welcome-mode-btn:active { transform:scale(0.98); }
@media (hover:hover) and (pointer:fine) { .welcome-mode-btn:hover { border-color:#439fdb; box-shadow:0 4px 16px rgba(67,159,219,0.18); } }
.welcome-scenario-chip { padding:10px 14px; border-radius:10px; cursor:pointer; text-align:left; display:block; background:white; color:#1a1b20; border:1.5px solid #dde6ed; transition:border-color 0.15s, transform 0.1s; width:100%; font-family:var(--font-main); }
.welcome-scenario-chip:active { transform:scale(0.97); }
@media (hover:hover) and (pointer:fine) { .welcome-scenario-chip:hover { border-color:#439fdb; background:#f5f9fd; } }
.welcome-collapse-trigger { width:100%; display:flex; align-items:center; justify-content:space-between; background:none; border:none; cursor:pointer; padding:0; text-align:left; color:inherit; }
.welcome-collapse-trigger:active { opacity: 0.7; }
.welcome-collapse-content { overflow:hidden; transition:max-height 0.28s cubic-bezier(0.23,1,0.32,1), opacity 0.22s ease-out; }
.welcome-collapse-content.wc-open { max-height:800px; opacity:1; }
.welcome-collapse-content.wc-closed { max-height:0; opacity:0; }
.welcome-chevron { transition:transform 0.22s cubic-bezier(0.23,1,0.32,1); color:#666; font-size:14px; flex-shrink:0; }
.welcome-chevron.wc-open { transform:rotate(180deg); }
@keyframes welcomeCardIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
.welcome-card-stagger { animation:welcomeCardIn 0.32s cubic-bezier(0.23,1,0.32,1) both; }
.welcome-card-stagger:nth-child(1) { animation-delay:0ms; }
.welcome-card-stagger:nth-child(2) { animation-delay:65ms; }
.welcome-card-stagger:nth-child(3) { animation-delay:130ms; }
.welcome-copy-btn { padding:6px 12px; border-radius:7px; font-size:12px; font-weight:500; cursor:pointer; border:1px solid #c2dcf0; background:#ecf5fb; color:#439fdb; transition:border-color 0.15s, background 0.15s, transform 0.1s; white-space:nowrap; }
.welcome-copy-btn:active { transform:scale(0.96); }
@media (hover:hover) and (pointer:fine) { .welcome-copy-btn:hover { border-color:#439fdb; background:#dceefa; } }

/* Radio / Checkbox */
input[type="radio"], input[type="checkbox"] { accent-color: #439fdb; width: 17px; height: 17px; cursor: pointer; flex-shrink: 0; }
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

/* Thumbnail */
.screen-thumb { flex: 1; min-width: 170px; max-width: 240px; flex-shrink: 0; cursor: pointer; padding: 0 2px; }
.thumb-frame { width:100%; height:270px; background:#fff; border-radius:14px; border:1.5px solid #dde6ed; overflow:hidden; margin-bottom:8px; transition:border-color 0.15s, box-shadow 0.15s; }
.screen-thumb:hover .thumb-frame { border-color:#439fdb !important; box-shadow:0 4px 20px rgba(67,159,219,0.2); transform:translateY(-2px); }
.screen-thumb:hover { transition: transform 0.15s ease-out; }

/* Tab active */
.tab-btn { padding:6px 14px; border-radius:6px; font-size:13px; border:none; cursor:pointer; white-space:nowrap; flex-shrink:0; transition:background 0.15s, color 0.15s, transform 0.1s; }
.tab-btn.active { background:#439fdb; color:#fff; font-weight:700; }
.tab-btn:not(.active) { background:#f0f4f8; color:#666f7c; }
.tab-btn:not(.active):hover { background:#e2e8ed; }

/* Panorama scenario row */
.pano-scenario-row { margin-bottom: 16px; background: #FFF; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.pano-scenario-header { padding: 14px 20px; border-bottom: 1px solid #F0F0F0; display: flex; align-items: center; gap: 12px; }
.panorama-row { display: flex; flex-direction: row; align-items: flex-start; gap: 0; padding: 20px 16px; overflow-x: auto; }
.panorama-row::-webkit-scrollbar { height: 6px; }
.panorama-row::-webkit-scrollbar-track { background: #F0F0F0; border-radius: 3px; }
.panorama-row::-webkit-scrollbar-thumb { background: #BBB; border-radius: 3px; }

/* ── APP SHELL ───────────────────────────────────────────────────────────── */
/* Desktop : flex column minimal, body scrolls, sticky works naturally */
.app-shell { display: flex; flex-direction: column; min-height: 100dvh; }
/* Mobile : hauteur fixe, zéro scroll body */
@media (max-width: 640px) {
  .app-shell { height: 100dvh; min-height: unset; overflow: hidden; }
}

/* ── MODE DESCRIPTOR BAR ─────────────────────────────────────────────────── */
.mode-descriptor-bar {
  background: #ecf5fb; border-bottom: 1px solid #c8dff0;
  padding: 8px 18px; font-size: 13px; color: #1a6fa3; line-height: 1.5;
  flex-shrink: 0;
}
.mode-descriptor-bar strong { color: #0079c0; font-weight: 700; }
.mode-descriptor-icon { margin-right: 6px; opacity: 0.5; }
@media (max-width: 640px) { .mode-descriptor-bar { display: none; } }

/* ── NAV VIEW ────────────────────────────────────────────────────────────── */
/* Desktop : flux normal, body scrolle, pas d'overflow clip */
.nav-view { flex: 1; }
/* Mobile seulement : contenu scrolle en interne */
@media (max-width: 640px) {
  .nav-view { min-height: 0; overflow: hidden; display: flex; flex-direction: column; }
}

/* Panorama view root — scrollable sur mobile */
.pano-view-root { background: #f0f4f8; min-height: 100dvh; }
@media (max-width: 640px) {
  .pano-view-root { min-height: 0; flex: 1; overflow-y: auto; }
}

/* ── TOPBAR SHELL ────────────────────────────────────────────────────────── */
.shell-topbar {
  background: linear-gradient(180deg,#0079c0,#439fdb);
  position: sticky;
  top: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 52px;
  gap: 8px;
  flex-shrink: 0;
}
.shell-logo { color:#fff; font-weight:800; font-size:16px; cursor:pointer; white-space:nowrap; letter-spacing:-0.3px; font-family:var(--font-main); }
.shell-version { color:rgba(255,255,255,0.55); font-size:12px; white-space:nowrap; }
.shell-modes { display:flex; gap:3px; flex-shrink:0; background:rgba(255,255,255,0.15); border-radius:9px; padding:3px; }
.shell-mode-btn {
  padding:6px 12px; border-radius:7px; font-size:13px; border:none;
  cursor:pointer; white-space:nowrap; background:transparent; color:rgba(255,255,255,0.75); font-weight:500;
  transition:background 0.15s, color 0.15s, transform 0.1s;
  min-height:34px; display:flex; align-items:center; font-family:var(--font-main);
}
.shell-mode-btn:active { transform: scale(0.96); }
.shell-mode-btn.active { background:#fff; color:#0079c0; font-weight:700; }
.shell-offer-chip {
  display:inline-flex; align-items:center; justify-content:center;
  padding:5px 12px; border-radius:20px; font-size:12px; font-weight:600;
  border:1px solid rgba(255,255,255,0.4); background:transparent; color:rgba(255,255,255,0.8);
  cursor:pointer; white-space:nowrap; margin-left:auto; flex-shrink:0;
  transition:background 0.15s, color 0.15s, border-color 0.15s, transform 0.1s;
  user-select:none; min-height:30px; min-width:120px;
}
.shell-offer-chip.on { background:linear-gradient(177deg,#ffed48,#ffc42b); color:#7a5800; border-color:transparent; }
.shell-offer-chip:active { transform: scale(0.94); }
.shell-mobile-btn {
  display:inline-flex; align-items:center; gap:5px;
  padding:5px 12px; border-radius:7px; font-size:12px; font-weight:600;
  border:1px solid rgba(255,255,255,0.35); background:rgba(255,255,255,0.12); color:rgba(255,255,255,0.85);
  cursor:pointer; white-space:nowrap; flex-shrink:0;
  transition:background 0.15s, color 0.15s, border-color 0.15s, transform 0.1s;
  min-height:30px;
}
.shell-mobile-btn:hover { background:rgba(255,255,255,0.2); color:#fff; }
.shell-mobile-btn.active { background:rgba(255,255,255,0.25); color:#fff; }
.shell-mobile-btn:active { transform: scale(0.96); }
@media (max-width: 640px) {
  .shell-mobile-btn { padding: 5px 9px; }
  .shell-mobile-btn .mob-label { display: none; }
}
@media (max-width: 640px) {
  .shell-offer-chip { min-width: 80px; }
}
/* Switch toggle annotations */
.ann-switch {
  display: inline-flex; align-items: center; gap: 8px;
  cursor: pointer; flex-shrink: 0; user-select: none;
}
.ann-switch-label { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.9); white-space: nowrap; }
.ann-switch-track {
  width: 36px; height: 20px; border-radius: 10px; border: none;
  cursor: pointer; position: relative; flex-shrink: 0; padding: 0;
  transition: background 0.2s ease;
}
.ann-switch-track[data-on="true"]  { background: #fff; }
.ann-switch-track[data-on="false"] { background: rgba(255,255,255,0.25); }
.ann-switch-track:active { transform: scale(0.93); transition: transform 0.1s ease-out, background 0.2s ease; }
.ann-switch-thumb {
  position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%;
  transition: transform 0.18s cubic-bezier(0.23,1,0.32,1), background 0.18s ease;
}
.ann-switch-track[data-on="true"]  .ann-switch-thumb { transform: translateX(16px); background: #0079c0; }
.ann-switch-track[data-on="false"] .ann-switch-thumb { transform: translateX(0);    background: rgba(255,255,255,0.55); }

@media (max-width: 768px) {
  .shell-topbar {
    position: relative;
    padding: 0 12px; height: 52px; gap: 6px; flex-shrink: 0;
    flex-wrap: nowrap; overflow: hidden;
  }
  .shell-logo { font-size: 15px; }
  .shell-version { display: none; }
  .shell-modes { gap: 2px; padding: 2px; }
  .shell-mode-btn { padding: 5px 8px; font-size: 11px; min-height: 30px; }
  .shell-offer-chip { padding: 4px 8px; font-size: 11px; min-height: 26px; min-width: unset; }
  .shell-label-long { display: none; }
  .shell-label-short { display: inline !important; }
  /* Masquer view-toggles et annotations sur mobile — pas pertinent sur petit écran */
  .shell-view-toggles { display: none !important; }
  .shell-ann-toggle { display: none !important; }
  .shell-separator { display: none !important; }
}
@media (min-width: 769px) {
  .shell-label-short { display: none !important; }
}

/* ── NAV SCENARIO BAR ────────────────────────────────────────────────────── */
.nav-scenario-bar {
  background:#fff; border-bottom:1px solid #e2e8ed;
  padding:8px 16px; display:flex; align-items:center;
  gap:10px; position:sticky; top:93px; z-index:200; flex-shrink:0;
  min-height:48px;
}
.nav-scenario-bar select {
  padding: 6px 10px; border: 1px solid #D8D8D8; border-radius: 8px;
  font-size: 13px; font-weight: 500; background: #F8F8F8; color: #1A1A1A;
  cursor: pointer; min-height: 34px; flex-shrink: 0;
  -webkit-appearance: auto;
}
@media (max-width: 640px) {
  .nav-scenario-bar {
    position: relative; top: auto; /* plus de sticky — flex item dans nav-view */
    padding: 8px 12px; gap: 8px; overflow-x: auto; min-height: 52px; flex-shrink: 0;
  }
  .nav-scenario-bar::-webkit-scrollbar { display: none; }
  .nav-scenario-bar select { font-size: 13px; min-height: 36px; max-width: 160px; }
}

/* ── PANORAMA MOBILE LIST ────────────────────────────────────────────────── */
.pano-mobile-list { display:none; }
.pano-desktop-thumbs { display:block; }
@media (max-width: 640px) {
  .pano-mobile-list { display:block; }
  .pano-desktop-thumbs { display:none; }
  .pano-tabs-bar { top: 52px !important; }
}

/* ── NAVIGATION FRAME ────────────────────────────────────────────────────── */
.nav-frame-desktop {
  width:390px; min-height:812px; background:#fff;
  border-radius:20px; overflow-y:auto; overflow-x:hidden;
  box-shadow:0 8px 40px rgba(26,133,204,0.15);
  /* Transition fluide quand les panneaux apparaissent/disparaissent */
  transition: width 250ms var(--ease-out-strong), border-radius 250ms var(--ease-out-strong);
}
.nav-frame-wrap-desktop { flex-shrink:0; display:flex; flex-direction:column; align-items:center; gap:10px; }

/* Desktop large — panneaux toujours visibles */
@media (min-width: 1100px) {
  .nav-panels { display: flex !important; }
}
/* Intermédiaire 700-1099px */
@media (min-width: 701px) and (max-width: 1099px) {
  .nav-panels { max-width: 260px; }
}

/* ── PANNEAUX ANNOTATIONS ──────────────────────────────────────────────────── */
.ann-panel {
  display: block;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  font-size: 13px;
  line-height: 1.7;
  color: #444;
  flex-shrink: 0;
  width: 260px;
  position: sticky;
  top: 0;
  align-self: flex-start;
}
@media (max-width: 700px) {
  .ann-panel { display: none !important; }
}
.ann-panel-title {
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8b9aa4;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8edf2;
}

/* Contenu form centré dans le navigateur desktop */
.browser-inner-content {
  max-width: 640px;
  margin: 0 auto;
  background: #fff;
  min-height: 100%;
}

/* ── BOTTOM NAV ─────────────────────────────────────────────────────────── */
.nav-bottom-bar {
  background:#fff; border-top:1.5px solid #e2e8ed;
  padding:10px 16px; display:flex; justify-content:center; gap:16px;
  flex-shrink:0; align-items:center;
}
@media (max-width: 640px) {
  .nav-frame-desktop { width:100% !important; height:100% !important; border-radius:0 !important; box-shadow:none !important; flex:1; min-height:0; overflow-y:auto; }
  .nav-frame-wrap-desktop { flex:1; width:100%; display:flex; flex-direction:column; min-height:0; align-items:stretch !important; overflow:hidden; }
  .nav-main-layout { flex:1; padding:0 !important; display:flex; flex-direction:column; align-items:stretch !important; min-height:0; overflow:hidden; }
  .nav-panels { display:none !important; }
  .nav-bottom-bar { padding: 12px 16px; gap: 12px; }
  .nav-bottom-bar .btn-sm { padding: 10px 18px; font-size: 14px; min-height: 44px; border-radius: 10px; }
}
@media (min-width: 641px) and (max-width: 700px) {
  .nav-panels { display:none !important; }
}

/* Overlay */
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 16px; }

/* ── IMMERSIVE MODE ──────────────────────────────────────────────────────── */
/* Desktop: full-screen overlay with phone frame */
.immersive-overlay { position: fixed; inset: 0; background: #0A0A0A; z-index: 500; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 16px; }
.immersive-phone-shell { display: flex; flex-direction: column; width: 393px; height: 852px; background: #000; border-radius: 52px; overflow: hidden; box-shadow: 0 0 0 2px #333, 0 40px 100px rgba(0,0,0,0.8); position: relative; }
.immersive-phone-content { flex: 1; overflow-y: auto; overflow-x: hidden; background: #FFF; scroll-behavior: smooth; }
.immersive-phone-content::-webkit-scrollbar { width: 3px; }
.immersive-phone-content::-webkit-scrollbar-thumb { background: #CCC; border-radius: 2px; }
/* iOS Status bar */
.ios-status { height: 59px; background: #FFF; display: flex; align-items: flex-end; justify-content: space-between; padding: 0 28px 10px; flex-shrink: 0; }
.ios-status-time { font-size: 15px; font-weight: 700; color: #1A1A1A; letter-spacing: -0.4px; }
.ios-status-icons { display: flex; align-items: center; gap: 7px; }
/* iOS Safari address bar */
.ios-address { height: 52px; background: #FFF; display: flex; align-items: center; padding: 0 16px; gap: 14px; border-bottom: 0.5px solid #E0E0E0; flex-shrink: 0; }
.ios-url-pill { flex: 1; background: #EBEBEB; border-radius: 12px; height: 36px; display: flex; align-items: center; justify-content: center; gap: 6px; }
.ios-url-text { font-size: 14px; color: #1A1A1A; font-weight: 400; }
.ios-nav-icon { font-size: 18px; color: #0A84FF; padding: 6px; cursor: default; line-height: 1; }
.ios-nav-icon.disabled { opacity: 0.28; }
/* iOS Safari bottom bar */
.ios-bottom { height: 49px; background: rgba(249,249,249,0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-top: 0.5px solid #D1D1D6; display: flex; align-items: center; justify-content: space-around; padding: 0 16px; flex-shrink: 0; }
.ios-bottom-icon { font-size: 20px; color: #0A84FF; padding: 6px; cursor: default; line-height: 1; }
.ios-bottom-icon.disabled { opacity: 0.28; }
/* iOS Dynamic Island */
.ios-dynamic-island { position: absolute; top: 12px; left: 50%; transform: translateX(-50%); width: 126px; height: 37px; background: #000; border-radius: 20px; z-index: 10; }
/* Exit pill — desktop, visible sous le frame */
.immersive-exit-pill { background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.25); color: #FFF; font-size: 13px; font-weight: 600; padding: 10px 22px; border-radius: 22px; cursor: pointer; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); transition: background 0.18s ease-out, transform 0.12s ease-out; white-space: nowrap; letter-spacing: -0.1px; }
.immersive-exit-pill:hover { background: rgba(255,255,255,0.28); }
.immersive-exit-pill:active { transform: scale(0.97); }
@media (max-width: 640px) { .immersive-exit-pill { display: none; } }
/* Exit button inside Safari bottom bar — mobile only */
.ios-exit-btn { background: none; border: none; cursor: pointer; color: #0A84FF; font-size: 11px; font-weight: 700; padding: 4px 6px; line-height: 1.3; white-space: nowrap; letter-spacing: -0.2px; }
.ios-exit-btn:active { opacity: 0.55; }
@media (min-width: 641px) { .ios-exit-btn { display: none; } }
@media (max-width: 640px) {
  .ios-bottom-desktop { display: none !important; }
  .ios-bottom { justify-content: center; }
  .ios-exit-btn { font-size: 13px; padding: 6px 12px; }
}
/* Mobile: fixed overlays */
@media (max-width: 640px) {
  .immersive-overlay { background: #FFF; align-items: stretch; justify-content: flex-start; }
  .immersive-phone-shell { width: 100%; height: 100%; border-radius: 0; box-shadow: none; border: none; }
  .ios-status { height: 52px; position: sticky; top: 0; z-index: 50; }
  .ios-dynamic-island { display: none; }
}
/* Toggle button in nav-scenario-bar */
.btn-immersive { padding: 6px 10px; border-radius: 8px; font-size: 12px; font-weight: 500; cursor: pointer; border: 1px solid #D0D0D0; background: #FFF; color: #555; transition: border-color 0.15s ease-out, background 0.15s ease-out, transform 0.1s ease-out; white-space: nowrap; display: flex; align-items: center; gap: 5px; min-height: 34px; }
.btn-immersive:hover { border-color: #999; background: #F8F8F8; }
.btn-immersive:active { transform: scale(0.97); }

/* Badge */
.badge-ok { display:inline-block; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:600; background:rgba(74,199,124,0.15); color:#1c7a46; }
.badge-branch { display:inline-block; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:600; background:rgba(255,196,43,0.2); color:#7a5800; }
.badge-exit { display:inline-block; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:600; background:rgba(236,52,49,0.1); color:#b02624; }

/* Btn jaune — aide et appel */
.btn-aide { display:block; width:100%; padding:14px 24px; background:linear-gradient(177deg,#ffed48,#ffc42b); color:#7a5800; border:none; border-radius:999px; font-size:15px; font-weight:700; cursor:pointer; text-align:center; text-decoration:none; transition:filter 0.15s, transform 0.12s; font-family:var(--font-main); }
.btn-aide:hover { filter:brightness(1.05); }
.btn-aide:active { transform:scale(0.98); }

/* Sélecteur créneau */
.btn-creneau { flex:1; padding:10px 16px; border-radius:999px; border:1.5px solid #dde6ed; background:white; color:#666f7c; font-size:14px; cursor:pointer; transition:border-color 0.15s, background 0.1s, color 0.1s, transform 0.1s ease-out; font-family:var(--font-main); font-weight:500; }
.btn-creneau.active { border-color:#439fdb; background:#ecf5fb; color:#439fdb; font-weight:700; }
.btn-creneau:active { transform: scale(0.97); }
@media (hover: hover) and (pointer: fine) { .btn-creneau:not(.active):hover { border-color:#439fdb; background:#f5f9fd; color:#439fdb; } }

/* Popover aide */
.help-popover { position:absolute; top:calc(100% + 8px); right:0; background:white; border:1px solid #e2e8ed; border-radius:14px; padding:14px 18px; box-shadow:0 8px 32px rgba(0,0,0,0.12); z-index:200; font-size:14px; white-space:nowrap; min-width:220px; }

/* Nouvelles keyframes */
@keyframes slideDown { from { opacity:0; transform:translateY(-8px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes popIn { from { opacity:0; transform:scale(0.93) translateY(-6px); } to { opacity:1; transform:scale(1) translateY(0); } }
.slide-down-anim { animation:slideDown 180ms var(--ease-out-strong); }
.fade-in-anim { animation:fadeIn 160ms ease-out; }

/* Caméra — force le plein écran dans le frame */
.camera-fullscreen { position:absolute; inset:0; width:100%; height:100%; overflow:hidden; }

/* ── ANIMATIONS UI POLISH ──────────────────────────────────────────────────── */
/* Overlay backdrop */
@keyframes overlayFadeIn { from { opacity:0; } to { opacity:1; } }
.overlay-anim { animation: overlayFadeIn 200ms ease-out; }

/* Modal slide-up */
@keyframes modalSlideUp { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
.modal-anim { animation: modalSlideUp 260ms var(--ease-out-strong); transform-origin: bottom center; }

/* Dropdown suggestions */
@keyframes dropdownIn { from { opacity:0; transform:translateY(-6px) scaleY(0.95); transform-origin:top; } to { opacity:1; transform:translateY(0) scaleY(1); } }
.dropdown-anim { animation: dropdownIn 160ms var(--ease-out-strong); transform-origin: top center; }

/* Upload success */
@keyframes uploadSuccess { 0% { opacity:0; transform:scale(0.96); } 60% { transform:scale(1.02); } 100% { opacity:1; transform:scale(1); } }
.upload-success-anim { animation: uploadSuccess 280ms var(--ease-out-strong); }

/* Error shake */
@keyframes errorShake { 0%,100% { transform:translateX(0); } 20% { transform:translateX(-5px); } 60% { transform:translateX(4px); } 80% { transform:translateX(-3px); } }
.error-anim { animation: errorShake 280ms ease-out; }

/* UploadItem entry stagger */
@keyframes uploadItemIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
.upload-item-anim { animation: uploadItemIn 240ms var(--ease-out-strong) both; }

/* Checkbox check bounce */
@keyframes checkBounce { 0% { transform:scale(0.8); } 60% { transform:scale(1.15); } 100% { transform:scale(1); } }

/* Loading pulse */
@keyframes loadingPulse { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
.loading-pulse { animation: loadingPulse 1.4s ease-in-out infinite; }

/* Success check */
@keyframes successIn { 0% { opacity:0; transform:scale(0.5); } 70% { transform:scale(1.2); } 100% { opacity:1; transform:scale(1); } }
.success-icon-anim { animation: successIn 350ms var(--ease-out-strong); display:inline-block; }

/* Popover aide — scale depuis le coin supérieur droit */
.help-popover { transform-origin: top right; animation: popIn 180ms var(--ease-out-strong); }

/* Choice block — active feedback */
.choice-block:active { transform: scale(0.985); transition: transform 100ms ease-out, border-color 0.15s, background 0.1s; }

/* Prefers reduced motion */
@media (prefers-reduced-motion: reduce) {
  .screen-anim { animation: fadeIn 150ms ease-out; }
  .slide-down { animation: fadeIn 150ms ease-out; }
  .tooltip-anim { animation: fadeIn 100ms ease-out; }
  .slide-down-anim { animation: fadeIn 100ms ease-out; }
  .fade-in-anim { animation: none; }
  * { transition-duration: 0.01ms !important; }
}
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
      factures: [null, null, null],
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
    // Police Nunito
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap';
    document.head.appendChild(link);
    // CSS global
    const el = document.createElement('style');
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => {
      try { document.head.removeChild(el); } catch {}
      try { document.head.removeChild(link); } catch {}
    };
  }, []);
  return null;
}

// ─── BASE LAYOUT COMPONENTS ───────────────────────────────────────────────────
function TunnelHeader({ onHome }) {
  const [showHelp, setShowHelp] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!showHelp) return;
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setShowHelp(false); }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showHelp]);

  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 16px', borderBottom:'1px solid #e2e8ed', position:'sticky', top:0, background:'#fff', zIndex:50 }}>
      <div onClick={onHome} style={{ cursor:onHome?'pointer':'default', display:'flex', alignItems:'center', gap:8 }}>
        {/* Logo Butagaz — PNG officiel */}
        <img src="/logo-butagaz.png" alt="Butagaz" style={{ height:32, width:'auto', display:'block', flexShrink:0 }} />
        <span style={{ height:14, width:1, background:'#e2e8ed', flexShrink:0 }} />
        <span style={{ fontSize:11, color:'#8b9aa4', fontWeight:500 }}>Souscription gaz en citerne</span>
      </div>
      <div ref={ref} style={{ position:'relative' }}>
        <button
          onClick={() => setShowHelp(v => !v)}
          style={{ background:'linear-gradient(177deg,#ffed48,#ffc42b)', color:'#7a5800', border:'none', borderRadius:999, padding:'7px 14px', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Nunito,system-ui,sans-serif' }}
        >Besoin d'aide ?</button>
        {showHelp && (
          <div className="help-popover fade-in-anim">
            <div style={{ fontWeight:700, color:'#1a1b20', marginBottom:4 }}>09 70 81 80 65</div>
            <div style={{ fontSize:12, color:'#8b9aa4' }}>Lun-ven, 9h-17h</div>
            <div style={{ fontSize:12, color:'#8b9aa4', marginTop:2 }}>Rappel sous 24h ouvres</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ step, onStepClick }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'14px 16px', gap:0 }}>
      {[1,2,3,4,5].map((n, i) => {
        const state = n < step ? 'done' : n === step ? 'active' : 'future';
        return (
          <div key={n} style={{ display:'flex', alignItems:'center' }}>
            {i > 0 && <div style={{ width:28, height:2, background: n <= step ? '#439fdb' : '#e2e8ed', flexShrink:0, transition:'background 250ms' }} />}
            <div
              style={{
                width:32, height:32, borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13, fontWeight:700, flexShrink:0,
                background: state==='active' ? '#439fdb' : state==='done' ? '#1a86cc' : '#e2e8ed',
                color: state==='future' ? '#8b9aa4' : '#fff',
                cursor: state==='done' ? 'pointer' : 'default',
                transition:'background 250ms',
                boxShadow: state==='active' ? '0 0 0 4px rgba(67,159,219,0.2)' : 'none',
              }}
              onClick={() => state === 'done' && onStepClick && onStepClick(n)}
            >{state === 'done' ? '\u2713' : n}</div>
          </div>
        );
      })}
    </div>
  );
}

function FooterBanner({ onRecall }) {
  return (
    <div className="footer-fixed" style={{ background:'#f7f9fa', borderTop:'0.5px solid #e2e8ed', padding:'10px 16px', fontSize:13, color:'#666f7c' }}>
      <span>Besoin d'aide ? </span>
      <a href="tel:0970818065" style={{ color:'#ec3431', fontWeight:700, textDecoration:'none' }}>09 70 81 80 65</a>
      <span> ou </span>
      <span style={{ textDecoration:'underline', cursor:'pointer', color:'#439fdb', fontWeight:600 }} onClick={onRecall}>être rappelé</span>
    </div>
  );
}

function BackLink({ label = '\u2190 Precedent', onClick }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:13, marginBottom:16 }}>
      <span style={{ textDecoration:'underline', cursor:'pointer', color:'#439fdb', fontWeight:600 }} onClick={onClick}>{label}</span>
    </div>
  );
}

// ─── CONTENT BLOCKS ───────────────────────────────────────────────────────────
function InfoBlock({ children }) {
  return <div style={{ background:'#ecf5fb', borderLeft:'3px solid #439fdb', borderRadius:12, padding:'12px 14px', fontSize:13, color:'#1a6fa3', marginBottom:16, lineHeight:1.6 }}>{children}</div>;
}
function OfferBlock({ children }) {
  return <div style={{ background:'rgba(74,199,124,0.08)', border:'1.5px solid #4ac77c', borderRadius:12, padding:'12px 14px', fontSize:13, color:'#1c7a46', marginBottom:16, lineHeight:1.6 }}>{children}</div>;
}
function WarningBlock({ children }) {
  return <div style={{ background:'#fffbe6', border:'1px solid #ffc42b', borderRadius:12, padding:'12px 14px', fontSize:13, color:'#7a5800', marginBottom:16, lineHeight:1.6 }}>{children}</div>;
}
function GrayBlock({ children }) {
  return <div style={{ background:'#f7f9fa', border:'0.5px solid #e2e8ed', borderRadius:12, padding:'12px 14px', fontSize:13, color:'#666f7c', marginBottom:16, lineHeight:1.6 }}>{children}</div>;
}

// ─── FAKE DATA ─────────────────────────────────────────────────────────────────
const FAKE_ADDRESSES = [
  '15 rue des Chênes, 44300 Nantes',
  '8 chemin du Lavoir, 35000 Rennes',
  '3 impasse des Vignes, 86000 Poitiers',
  "2 route de l'Église, 24100 Bergerac",
  '7 allée des Tilleuls, 33000 Bordeaux',
  '22 avenue Jean Jaurès, 31000 Toulouse',
  '14 rue du Moulin, 69100 Villeurbanne',
  '5 boulevard Victor Hugo, 06000 Nice',
  '18 chemin des Prés, 67000 Strasbourg',
  '42 rue de la Fontaine, 63000 Clermont-Ferrand',
  '6 rue du Port, 56100 Lorient',
  '11 allée des Roses, 13100 Aix-en-Provence',
  '30 rue des Marronniers, 76000 Rouen',
  '9 chemin de la Croix, 37000 Tours',
  '17 rue Saint-Nicolas, 51100 Reims',
  '25 avenue du Général de Gaulle, 59000 Lille',
  '4 impasse du Bois, 47000 Agen',
  '33 rue des Lilas, 77000 Melun',
  '16 chemin des Oliviers, 30000 Nîmes',
  '7 rue de la Paix, 64000 Pau',
];

const FAKE_FACTURE_NAMES = [
  { name: 'facture_primagaz_jan.pdf', size: '245 Ko' },
  { name: 'facture_primagaz_fev.pdf', size: '231 Ko' },
  { name: 'facture_primagaz_mar.pdf', size: '258 Ko' },
];

// ─── FORM COMPONENTS ──────────────────────────────────────────────────────────
function TooltipBtn({ id, onToggle }) {
  return (
    <span
      onClick={() => onToggle(id)}
      style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:17, height:17, borderRadius:'50%', border:'1px solid #AAA', fontSize:10, color:'#888', cursor:'pointer', marginLeft:5, flexShrink:0, verticalAlign:'middle' }}
    >i</span>
  );
}

function FormField({ id, label, tooltipText, openTip, onToggleTip, error, children }) {
  const tipOpen = openTip === id;
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:'flex', alignItems:'center', marginBottom: tipOpen ? 6 : 5 }}>
        <label style={{ fontSize:13, color:'#666' }}>{label}</label>
        {tooltipText && <TooltipBtn id={id} onToggle={onToggleTip} />}
      </div>
      {tooltipText && tipOpen && (
        <div className="tooltip-anim" style={{ background:'#fffbe6', border:'1px solid #ffc42b', borderRadius:12, padding:10, fontSize:13, color:'#7a5800', marginBottom:8, lineHeight:1.5, width:'100%' }}>
          {tooltipText}
        </div>
      )}
      {children}
      {error && <div key={error} className="error-anim" style={{ fontSize:12, color:'#ec3431', marginTop:4, fontWeight:500 }}>{error}</div>}
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

function AddressInput({ value, onChange, onBlur, hasError, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  function showFakeSuggestions(v) {
    const filtered = v.trim().length === 0
      ? FAKE_ADDRESSES.slice(0, 5)
      : FAKE_ADDRESSES.filter(a => a.toLowerCase().includes(v.toLowerCase())).slice(0, 5);
    setSuggestions(filtered);
    setOpen(filtered.length > 0);
  }

  function handleFocus() {
    if (!open) showFakeSuggestions(value);
  }

  function handleChange(e) {
    const v = e.target.value;
    onChange(v);
    clearTimeout(debounceRef.current);
    if (v.trim().length < 3) {
      showFakeSuggestions(v);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(v)}&limit=5&autocomplete=1`);
        const json = await res.json();
        const addrs = (json.features || []).map(f => f.properties.label);
        if (addrs.length > 0) {
          setSuggestions(addrs);
          setOpen(true);
        } else {
          showFakeSuggestions(v);
        }
      } catch {
        showFakeSuggestions(v);
      } finally {
        setLoading(false);
      }
    }, 250);
  }

  function handleSelect(addr) {
    onChange(addr);
    setOpen(false);
    setSuggestions([]);
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        className={`field-input${hasError ? ' err' : ''}`}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={() => { setTimeout(() => setOpen(false), 200); onBlur && onBlur(); }}
        placeholder={placeholder || "Commencez à taper votre adresse"}
        autoComplete="off"
      />
      {loading && (
        <div style={{ fontSize:12, color:'#999', marginTop:4, paddingLeft:4 }}>Recherche…</div>
      )}
      {open && suggestions.length > 0 && (
        <div className="dropdown-anim" style={{ position:'absolute', left:0, right:0, zIndex:100, background:'#FFF', border:'1px solid #D0D0D0', borderRadius:8, boxShadow:'0 4px 16px rgba(0,0,0,0.12)', overflow:'hidden', marginTop:4 }}>
          {suggestions.map((addr, i) => (
            <div
              key={i}
              onMouseDown={() => handleSelect(addr)}
              onTouchStart={() => handleSelect(addr)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', fontSize:14, color:'#1a1b20', cursor:'pointer', borderBottom: i < suggestions.length - 1 ? '1px solid #F0F0F0' : 'none', background:'#FFF', lineHeight:1.4 }}
              onMouseEnter={e => e.currentTarget.style.background = '#F5F5F5'}
              onMouseLeave={e => e.currentTarget.style.background = '#FFF'}
            >
              <svg width="12" height="16" viewBox="0 0 12 16" fill="none" style={{ flexShrink:0 }}><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5zm0 7.5C4.62 7.5 3.5 6.38 3.5 5S4.62 2.5 6 2.5 8.5 3.62 8.5 5 7.38 7.5 6 7.5z" fill="#999"/></svg>
              {addr}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── UPLOAD ITEM (Mode B) ─────────────────────────────────────────────────────
// UploadItem simplifié — Mode B gère les sous-écrans.
// Phases supportées : 'empty' | 'loading' | 'success'
function UploadItem({ index, file, progress, phase, onZoneClick, onDelete }) {
  const label = ['Facture 1/3', 'Facture 2/3', 'Facture 3/3'][index];
  return (
    <div className="upload-item-anim" style={{ marginBottom:14, animationDelay: `${index * 80}ms` }}>
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
        <div className="upload-success-anim" style={{ background:'rgba(74,199,124,0.08)', border:'1px solid #4ac77c', borderRadius:10, padding:14 }}>
          <div style={{ fontSize:14, fontWeight:600, color:'#1c7a46', marginBottom:2 }}>✓ {file?.name}</div>
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
  const [creneau, setCreneau] = useState(null);

  function handleSend() {
    if (!f.nom || !f.telephone || !f.rgpd) return;
    setSent(true);
    setTimeout(() => onClose(), 2000);
  }

  return (
    <div className="overlay overlay-anim" onClick={onClose}>
      <div className="modal-anim" style={{ background:'#FFF', borderRadius:16, padding:24, width:'100%', maxWidth:340, position:'relative' }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={{ fontWeight:600, fontSize:16 }}>Être rappelé</div>
          <span style={{ fontSize:20, cursor:'pointer', color:'#666', lineHeight:1 }} onClick={onClose}>×</span>
        </div>
        {sent ? (
          <InfoBlock>Demande envoyée. Un conseiller vous contactera sous 24h ouvres.</InfoBlock>
        ) : (
          <>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:13, color:'#666', display:'block', marginBottom:4 }}>Nom *</label>
              <input className="field-input" value={f.nom} onChange={e => setF({...f, nom: e.target.value})} placeholder="Votre nom" />
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:13, color:'#666', display:'block', marginBottom:4 }}>Telephone *</label>
              <input className="field-input" value={f.telephone} onChange={e => setF({...f, telephone: e.target.value})} placeholder="06 ou 07..." type="tel" inputMode="tel" />
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, color:'#439fdb', fontWeight:600, display:'block', marginBottom:6 }}>Preference d'appel</label>
              <div style={{ display:'flex', gap:8 }}>
                {['Matin', 'Apres-midi'].map(opt => (
                  <button key={opt} type="button" onClick={() => setCreneau(creneau === opt ? null : opt)}
                    className={`btn-creneau${creneau === opt ? ' active' : ''}`}>{opt}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:13, color:'#666', display:'block', marginBottom:4 }}>Email</label>
              <input className="field-input" value={f.email} onChange={e => setF({...f, email: e.target.value})} placeholder="votre@email.fr" type="email" inputMode="email" />
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
  const grayStyle = { opacity: 0.35, pointerEvents: 'none', userSelect: 'none' };

  return (
    <div style={{ background: '#F4F4F4', minHeight: 1400 }}>

      {/* Header branded — logo + nav simulés sur fond blanc */}
      <div style={{ background:'#fff', borderBottom:'1px solid #e8edf2', padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <img src="/logo-butagaz.png" alt="Butagaz" style={{ height:28, width:'auto' }} />
        <div style={{ display:'flex', gap:14 }}>
          {['Offres','Particuliers','Pro'].map(l => (
            <span key={l} style={{ fontSize:13, color:'#1a1b20', fontWeight:500, opacity:0.5 }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Hero photo pleine largeur */}
      <div style={{ position:'relative', height:200, overflow:'hidden' }}>
        <img
          src="/cover-citerne.webp"
          alt="Citerne de gaz Butagaz"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 60%' }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(0,121,192,0.35) 0%,rgba(0,0,0,0.5) 100%)' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'16px' }}>
          <div style={{ fontSize:22, fontWeight:800, color:'#fff', lineHeight:1.2, marginBottom:4, textShadow:'0 1px 4px rgba(0,0,0,0.4)' }}>Gaz en citerne</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.85)', fontWeight:500 }}>Chauffez votre maison avec le gaz propane en citerne</div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ padding:'8px 16px', background:'#fff', borderBottom:'1px solid #f0f0f0' }}>
        <span style={{ fontSize:12, color:'#999' }}>Offres</span>
        <span style={{ fontSize:12, color:'#ccc', margin:'0 4px' }}>›</span>
        <span style={{ fontSize:12, color:'#666' }}>Gaz en citerne</span>
      </div>

      {/* ─── ENCART SOUSCRIPTION — ZONE ACTIVE ─── */}
      <div id="encart-souscription" style={{ margin: '0 12px 12px', background: '#fff', border: '2px solid #439fdb', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(67,159,219,0.15)' }}>
        {/* Etiquette indicateur */}
        <div style={{ background: '#ecf5fb', borderBottom: '1px solid #c2dcf0', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#1a6fa3', fontWeight: 600, letterSpacing: '0.04em' }}>↗ Zone active du prototype</span>
        </div>

        <div style={{ padding: '20px 16px' }}>
          <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 16, lineHeight: 1.3, color: '#1a1b20' }}>
            Vous souhaitez changer de fournisseur ?
          </div>

          {offerMode && (
            <div style={{ background: 'linear-gradient(135deg,#ecf5fb,#dceefa)', border: '1.5px solid #439fdb', borderRadius: 14, padding: '12px 14px', marginBottom: 14, fontSize: 13, color: '#0079c0', lineHeight: 1.5 }}>
              <strong>Jusqu'a 200 € d'avoir gaz offerts</strong> sur votre premiere commande*
            </div>
          )}

          <>
            <button className="btn-primary" style={{ marginBottom: 10 }} onClick={() => navigate('WF1')}>
              <div>Souscrire en ligne</div>
              <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>Devis personnalise sous 24h ouvres</div>
            </button>
            <a href="tel:0970818065" className="btn-aide" style={{ display:'block', marginBottom:10, textDecoration:'none' }}>
              Appeler un conseiller<br/>
              <span style={{ fontSize:12, fontWeight:400, opacity:0.8 }}>09 70 81 80 65, Lun-ven 9h-18h</span>
            </a>
            <button className="btn-secondary" onClick={() => navigate('WF0-step2')}>
              <div style={{ fontWeight: 500 }}>Être rappelé</div>
              <div style={{ fontSize: 12, color: '#8b9aa4', marginTop: 2 }}>Un conseiller vous contacte sous 24h ouvres</div>
            </button>
            {offerMode && (
              <div style={{ fontSize: 11, color: '#999', lineHeight: 1.5, marginTop: 12 }}>
                *Offre réservée aux clients souscrivant à une citerne apparente. Le montant de l'avoir sera déterminé en fonction de la consommation annuelle estimée.
              </div>
            )}
          </>
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
  const [creneau, setCreneau] = useState(null);

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
          {errors.prenom && <div style={{ fontSize:12, color:'#ec3431', marginTop:4 }}>{errors.prenom}</div>}
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:13, color:'#666', display:'block', marginBottom:5 }}>Nom *</label>
          <input className={`field-input${errors.nom?' err':''}`} value={f.nom} onChange={e => setF({...f,nom:e.target.value})} onBlur={() => { if (!f.nom.trim()) setErrors({...errors,nom:'Veuillez saisir votre nom.'}); else setErrors({...errors,nom:null}); }} />
          {errors.nom && <div style={{ fontSize:12, color:'#ec3431', marginTop:4 }}>{errors.nom}</div>}
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:13, color:'#666', display:'block', marginBottom:5 }}>Numéro de téléphone *</label>
          <input className={`field-input${errors.telephone?' err':''}`} value={f.telephone} onChange={e => setF({...f,telephone:e.target.value})} placeholder="06 ou 07..." />
          {errors.telephone && <div style={{ fontSize:12, color:'#ec3431', marginTop:4 }}>{errors.telephone}</div>}
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:13, color:'#439fdb', fontWeight:600, display:'block', marginBottom:6 }}>Preference d'appel (facultatif)</label>
          <div style={{ display:'flex', gap:8 }}>
            {['Matin', 'Apres-midi'].map(opt => (
              <button key={opt} type="button" onClick={() => setCreneau(creneau === opt ? null : opt)}
                className={`btn-creneau${creneau === opt ? ' active' : ''}`}>{opt}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:13, color:'#666', display:'block', marginBottom:5 }}>Email *</label>
          <input className={`field-input${errors.email?' err':''}`} value={f.email} onChange={e => setF({...f,email:e.target.value})} placeholder="votre@email.fr" />
          {errors.email && <div style={{ fontSize:12, color:'#ec3431', marginTop:4 }}>{errors.email}</div>}
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:13, color:'#666', display:'block', marginBottom:5 }}>Message (facultatif)</label>
          <textarea className="field-input" value={f.message} onChange={e => setF({...f,message:e.target.value})} placeholder="Votre message..." />
        </div>

        <CheckboxField checked={f.rgpd} onChange={v => setF({...f,rgpd:v})}>
          J'accepte que les informations saisies soient utilisées dans le cadre de la relation commerciale avec Butagaz, pour me recontacter.
        </CheckboxField>
        {errors.rgpd && <div style={{ fontSize:12, color:'#ec3431', marginBottom:14 }}>{errors.rgpd}</div>}

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
        <div style={{ width:60, height:60, borderRadius:'50%', background:'rgba(74,199,124,0.08)', border:'2px solid #4ac77c', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:26 }}>✓</div>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:16 }}>Votre demande est bien reçue</div>
        <InfoBlock>
          Un conseiller vous contactera sous 24h ouvres. Rappel entre 9h et 17h, du lundi au vendredi.
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
    if (c === 'succession' || c === 'energie') {
      navigate('WF1-sortie');
    } else if (c === 'changer') {
      setTimeout(() => navigate('WF1bis'), 450);
    }
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
          <div className="slide-down" style={{ background:'#fffbe6', border:'1px solid #ffc42b', borderRadius:12, padding:12, fontSize:13, color:'#7a5800', marginBottom:10, lineHeight:1.5 }}>
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
          · Dans votre boîte mail<br />
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
          <span className="lnk-gray" onClick={() => navigate('WF0-step2')}>Vous préférez être accompagné ? Demandez à être rappelé</span>
        </div>
      </div>
      <FooterBanner onRecall={showRecall} />
    </div>
  );
}

// ─── SCREEN: WF1-SORTIE — NON ÉLIGIBLE ───────────────────────────────────────
function ScreenWF1Sortie({ navigate, showRecall, returnToSite, onHome }) {
  return (
    <div className="screen-anim">
      <TunnelHeader onHome={returnToSite || onHome} />
      <div style={{ padding:'32px 16px 80px', textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:16 }}>👋</div>
        <div style={{ fontSize:22, fontWeight:700, color:'#1a1b20', marginBottom:12, lineHeight:1.3 }}>Parlons de votre projet</div>
        <div style={{ fontSize:14, color:'#666f7c', lineHeight:1.7, marginBottom:28, maxWidth:320, margin:'0 auto 28px' }}>
          Pour votre situation, nos conseillers vous accompagnent directement. Aucun justificatif de fournisseur actuel n'est necessaire.
        </div>
        <button className="btn-primary" style={{ marginBottom:12 }} onClick={() => showRecall && showRecall()}>Être rappelé →</button>
        <button className="btn-secondary" onClick={() => navigate('PAGE0')}>← Retour au site butagaz.fr</button>
        <div style={{ marginTop:20 }}>
          <a href="tel:0970818065" style={{ fontSize:13, color:'#439fdb', fontWeight:600, textDecoration:'none' }}>09 70 81 80 65, Lun-ven 9h-17h</a>
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
          <AddressInput value={f.adresse} onChange={v => setF({...f,adresse:v})} onBlur={() => blur('adresse')} hasError={!!errors.adresse} />
        </FormField>

        {/* Téléphone */}
        <FormField id="telephone" label="Téléphone *" tooltipText="ℹ️ Un conseiller vous appellera pour vous transmettre votre proposition de contrat. Vous serez contacté depuis le 09 70 81 80 65." openTip={openTip} onToggleTip={toggleTip} error={errors.telephone}>
          <input className={`field-input${errors.telephone?' err':''}`} value={f.telephone} onChange={e => setF({...f,telephone:e.target.value})} onBlur={() => blur('telephone')} placeholder="06 ou 07..." type="tel" inputMode="tel" />
        </FormField>

        {/* Préférence d'appel */}
        <FormField id="pref" label="Préférence d'appel (facultatif)" tooltipText="ℹ️ Rappel entre 9h et 17h, du lundi au vendredi." openTip={openTip} onToggleTip={toggleTip}>
          <RadioGroup
            options={[{ value:'matin', label:'Matin' }, { value:'aprem', label:'Après-midi' }, { value:'indifferent', label:'Indifférent' }]}
            value={f.preferenceAppel}
            onChange={v => setF({...f, preferenceAppel:v})}
          />
        </FormField>

        {/* Email */}
        <FormField id="email" label="Email *" tooltipText="ℹ️ Votre proposition de contrat sera envoyée à cette adresse. Aucun spam, promis." openTip={openTip} onToggleTip={toggleTip} error={errors.email}>
          <input className={`field-input${errors.email?' err':''}`} value={f.email} onChange={e => setF({...f,email:e.target.value})} onBlur={() => blur('email')} placeholder="votre@email.fr" type="email" inputMode="email" />
        </FormField>

        {/* Citerne = domicile */}
        <CheckboxField checked={f.citerneMemeDomicile} onChange={v => setF({...f, citerneMemeDomicile:v, adresseCiterne: v ? '' : f.adresseCiterne})}>
          La citerne est à la même adresse que mon domicile
        </CheckboxField>

        {!f.citerneMemeDomicile && (
          <div className="slide-down-anim" style={{ marginBottom:14 }}>
            <label style={{ fontSize:13, color:'#439fdb', fontWeight:600, display:'block', marginBottom:5 }}>
              Adresse de la citerne *
            </label>
            <AddressInput
              value={f.adresseCiterne || ''}
              onChange={v => setF({...f, adresseCiterne: v})}
              placeholder="Commencez a taper l'adresse de la citerne"
            />
          </div>
        )}

        {/* Statut */}
        <FormField id="statut" label="Vous êtes *" tooltipText="ℹ️ Seul le propriétaire peut changer de fournisseur de gaz en citerne." openTip={openTip} onToggleTip={toggleTip} error={errors.statut}>
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
        {errors.rgpd && <div style={{ fontSize:12, color:'#ec3431', marginBottom:14 }}>{errors.rgpd}</div>}

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
  const [showPhone, setShowPhone] = useState(false);
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

        <button className="btn-secondary" style={{ marginBottom:10 }} onClick={() => setShowPhone(v => !v)}>
          Appeler un conseiller au 09 70 81 80 65 · lun-ven 9h-18h
        </button>
        {showPhone && (
          <div style={{ padding:'10px 14px', background:'#F5F5F5', borderRadius:8, marginBottom:10, fontSize:14, fontWeight:600 }}>
            Appelez le 09 70 81 80 65, du lundi au vendredi de 9h à 18h
          </div>
        )}
        <button className="btn-secondary" style={{ marginBottom:16 }} onClick={() => navigate('WF0-step2')}>
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

        <FormField id="citerne-type" label="Votre citerne est-elle visible dans votre jardin ?" tooltipText="ℹ️ Apparente : vous la voyez dans votre jardin, posée au sol. Enfouie : enterrée sous terre. Seul un petit capot dépasse du sol." openTip={openTip} onToggleTip={toggleTip} error={errors.citerne}>
          <div style={{ display:'flex', gap:12, marginTop:4 }}>
            <div
              className={`choice-block${citerneType==='apparente'?' selected':''}`}
              style={{ flex:1, textAlign:'center', marginBottom:0, padding:'12px 8px' }}
              onClick={() => { setCiterneType('apparente'); setErrors({...errors,citerne:null}); }}
            >
              <div style={{ borderRadius:10, overflow:'hidden', marginBottom:8, height:80, background:'#f0f4f8' }}>
                <img src="/citerne-apparente.png" alt="Citerne apparente" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
              <div style={{ fontWeight:700, fontSize:14 }}>Apparente</div>
              <div style={{ fontSize:12, color:'#666' }}>Visible dans le jardin</div>
            </div>
            <div
              className={`choice-block${citerneType==='enfouie'?' selected':''}`}
              style={{ flex:1, textAlign:'center', marginBottom:0, padding:'12px 8px' }}
              onClick={() => { setCiterneType('enfouie'); setErrors({...errors,citerne:null}); }}
            >
              <div style={{ borderRadius:10, overflow:'hidden', marginBottom:8, height:80, background:'#f0f4f8' }}>
                <img src="/citerne-enfouie.png" alt="Citerne enfouie" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
              <div style={{ fontWeight:700, fontSize:14 }}>Enfouie</div>
              <div style={{ fontSize:12, color:'#666' }}>Enterrée sous terre</div>
            </div>
          </div>
        </FormField>

        <div style={{ height:1, background:'#F0F0F0', margin:'4px 0 16px' }} />

        <FormField id="conserver" label="Souhaitez-vous garder le même type de citerne ?" tooltipText="ℹ️ Votre réponse est indicative, pas définitive. Un technicien vérifie la faisabilité avant l'installation. Si vous souhaitez changer de type, des frais éventuels vous seront communiqués dans votre contrat, avant toute décision." openTip={openTip} onToggleTip={toggleTip} error={errors.conserver}>
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
      <rect x="20" y="10" width="160" height="120" fill="#FFF0F0" stroke="#ec3431" strokeWidth="2" rx="4"/>
      <rect x="30" y="22" width="90" height="5" fill="#D0D0D0" rx="1" opacity="0.7"/>
      <rect x="30" y="32" width="70" height="4" fill="#C8C8C8" rx="1" opacity="0.6"/>
      <rect x="30" y="41" width="110" height="5" fill="#D8D8D8" rx="1" opacity="0.7"/>
      <rect x="30" y="51" width="60" height="4" fill="#C0C0C0" rx="1" opacity="0.5"/>
      <rect x="30" y="60" width="95" height="5" fill="#D0D0D0" rx="1" opacity="0.6"/>
      <rect x="30" y="70" width="75" height="4" fill="#C8C8C8" rx="1" opacity="0.7"/>
      <rect x="30" y="80" width="100" height="5" fill="#D0D0D0" rx="1" opacity="0.6"/>
      <line x1="65" y1="45" x2="135" y2="105" stroke="#ec3431" strokeWidth="5" strokeLinecap="round"/>
      <line x1="135" y1="45" x2="65" y2="105" stroke="#ec3431" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
}

// ─── WF4 MODE B — HEADER ─────────────────────────────────────────────────────
function WF4ModeBHeader({ factureNum, handleBack }) {
  return (
    <div style={{ display:'flex', alignItems:'center', padding:'12px 16px', borderBottom:'1px solid #E0E0E0', position:'sticky', top:0, background:'#FFF', zIndex:50 }}>
      <button onClick={handleBack} style={{ background:'none', border:'none', cursor:'pointer', fontSize:14, color:'#1a1b20', padding:0 }}>← Retour</button>
      <span style={{ marginLeft:'auto', fontSize:13, color:'#666', fontWeight:500 }}>Ajout facture {factureNum}/3</span>
    </div>
  );
}

// ─── WF4 MODE B — ÉTAPE A ────────────────────────────────────────────────────
function WF4ModeB_Prepare({ factureNum, onReady, onFileClick, onNoFacture, onBack, onDemoFile }) {
  const [isMobileCtx, setIsMobileCtx] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const h = () => setIsMobileCtx(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  return (
    <div style={{ minHeight:'100%' }}>
      <WF4ModeBHeader factureNum={factureNum} handleBack={onBack} />
      <div style={{ padding:'20px 16px 80px 16px' }}>
        <div style={{ fontSize:20, fontWeight:700, marginBottom:16 }}>Preparez votre facture</div>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}><IllustrationFactureMain /></div>
        <div style={{ background:'#fffbe6', border:'1px solid #ffc42b', borderRadius:12, padding:12, marginBottom:24, fontSize:13, color:'#7a5800', lineHeight:1.6 }}>
          ⓘ Conseils : photo bien eclairee, pas de reflet, facture entierement visible.
        </div>
        {isMobileCtx ? (
          <>
            <button className="btn-primary" style={{ marginBottom:12 }} onClick={onReady}>Ma facture est prete →</button>
            <button className="btn-secondary" style={{ marginBottom:12 }} onClick={onFileClick}>↑ Choisir un fichier sur mon appareil</button>
          </>
        ) : (
          <>
            <button className="btn-primary" style={{ marginBottom:12 }} onClick={onFileClick}>↑ Choisir un fichier sur mon appareil</button>
            <button className="btn-secondary" style={{ marginBottom:12 }} onClick={onReady}>Ma facture est prete →</button>
          </>
        )}
        <button className="btn-secondary" style={{ marginBottom:24, borderStyle:'dashed', color:'#8b9aa4' }} onClick={onDemoFile}>
          Utiliser des fichiers demo →
        </button>
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
function WF4ModeB_Frame({ factureNum, onCapture, onFileClick, onNoFacture, onBack, onDemoFile }) {
  const [isMobileCtx, setIsMobileCtx] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const h = () => setIsMobileCtx(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  return (
    <div style={{ minHeight:'100%' }}>
      <WF4ModeBHeader factureNum={factureNum} handleBack={onBack} />
      <div style={{ padding:'20px 16px 80px 16px' }}>
        <div style={{ fontSize:20, fontWeight:700, marginBottom:16 }}>Prenez la photo</div>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}><IllustrationViseur /></div>
        <div style={{ background:'#fffbe6', border:'1px solid #ffc42b', borderRadius:12, padding:12, marginBottom:24, fontSize:13, color:'#7a5800', lineHeight:1.6 }}>
          ⓘ Conseils : pas de flash, evitez les ombres, tenez le telephone bien droit.
        </div>
        {isMobileCtx ? (
          <>
            <button className="btn-primary" style={{ marginBottom:12 }} onClick={onCapture}>Prendre la photo</button>
            <button className="btn-secondary" style={{ marginBottom:12 }} onClick={onFileClick}>↑ Choisir un fichier sur mon appareil</button>
          </>
        ) : (
          <>
            <button className="btn-primary" style={{ marginBottom:12 }} onClick={onFileClick}>↑ Choisir un fichier sur mon appareil</button>
            <button className="btn-secondary" style={{ marginBottom:12 }} onClick={onCapture}>Prendre la photo</button>
          </>
        )}
        <button className="btn-secondary" style={{ marginBottom:24, borderStyle:'dashed', color:'#8b9aa4' }} onClick={onDemoFile}>
          Utiliser des fichiers demo →
        </button>
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
  const [scanPos, setScanPos] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    let pos = 0;
    let dir = 1;
    function tick() {
      pos += dir * 1.5;
      if (pos >= 98) dir = -1;
      if (pos <= 2) dir = 1;
      setScanPos(pos);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', minHeight:'600px', background:'#0a0a0a', overflow:'hidden', display:'flex', flexDirection:'column' }}>
      {/* Fausse texture photo : table + document */}
      <div style={{ position:'absolute', inset:0, background:'#1c1c1c' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -52%) rotate(-3deg)', width:'64%', maxWidth:230, background:'#f0ece4', borderRadius:3, padding:'14px 12px', boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, alignItems:'flex-start' }}>
            <div>
              <div style={{ height:7, background:'#1a6fa3', borderRadius:2, marginBottom:4, width:80 }} />
              <div style={{ height:4, background:'#ccc', borderRadius:1, width:55 }} />
            </div>
            <div style={{ height:18, width:40, background:'#e8e8e0', borderRadius:2 }} />
          </div>
          <div style={{ height:1, background:'#ddd', margin:'6px 0 8px' }} />
          {[90,70,85,60,78,65].map((w,i) => <div key={i} style={{ height:3, background:'#ccc', borderRadius:1, marginBottom:4, width:w+'%' }} />)}
          <div style={{ height:1, background:'#ddd', margin:'8px 0 6px' }} />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ height:4, background:'#bbb', borderRadius:1, width:'35%' }} />
            <div style={{ height:7, background:'#1a1b20', borderRadius:2, width:'28%', opacity:0.75 }} />
          </div>
        </div>
      </div>

      {/* Vignette */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 55% at 50% 48%, transparent 0%, rgba(0,0,0,0.65) 100%)' }} />

      {/* Top bar caméra iOS */}
      <div style={{ position:'relative', zIndex:20, padding:'14px 20px 8px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:'#fff', fontSize:15, fontWeight:400, cursor:'pointer', padding:'4px 0', textShadow:'0 1px 4px rgba(0,0,0,0.7)', letterSpacing:'-0.2px' }}>Annuler</button>
        <span style={{ color:'rgba(255,255,255,0.45)', fontSize:12, fontWeight:500 }}>Facture {factureNum}/3</span>
        <div style={{ display:'flex', gap:18 }}>
          <span style={{ color:'rgba(255,255,255,0.85)', fontSize:16 }}>⚡</span>
          <span style={{ color:'rgba(255,255,255,0.85)', fontSize:16 }}>⋯</span>
        </div>
      </div>

      {/* Zone viseur */}
      <div style={{ flex:1, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ position:'relative', width:'70%', maxWidth:240, aspectRatio:'3/4' }}>
          {/* Coins du viseur */}
          {[
            { top:0, left:0, borderTop:'3px solid #fff', borderLeft:'3px solid #fff', borderRadius:'4px 0 0 0' },
            { top:0, right:0, borderTop:'3px solid #fff', borderRight:'3px solid #fff', borderRadius:'0 4px 0 0' },
            { bottom:0, left:0, borderBottom:'3px solid #fff', borderLeft:'3px solid #fff', borderRadius:'0 0 0 4px' },
            { bottom:0, right:0, borderBottom:'3px solid #fff', borderRight:'3px solid #fff', borderRadius:'0 0 4px 0' },
          ].map((s, i) => <div key={i} style={{ position:'absolute', width:22, height:22, ...s }} />)}
          {/* Cadre pointillé */}
          <div style={{ position:'absolute', inset:0, border:'1px dashed rgba(255,255,255,0.25)', borderRadius:2 }} />
          {/* Ligne de scan */}
          <div style={{ position:'absolute', left:0, right:0, top:scanPos+'%', height:2, background:'linear-gradient(90deg, transparent, rgba(67,159,219,0.9), transparent)', boxShadow:'0 0 10px rgba(67,159,219,0.7)', pointerEvents:'none' }} />
        </div>
        {/* Point focus doré */}
        <div style={{ position:'absolute', width:52, height:52, border:'1.5px solid rgba(255,196,43,0.9)', borderRadius:4 }} />
      </div>

      {/* Conseil */}
      <div style={{ position:'relative', zIndex:10, color:'rgba(255,255,255,0.45)', fontSize:11, textAlign:'center', padding:'4px 16px 8px', letterSpacing:'0.01em' }}>
        Cadrez votre facture dans le viseur
      </div>

      {/* Barre inférieure caméra iOS */}
      <div style={{ position:'relative', zIndex:20, padding:'12px 32px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(0,0,0,0.25)' }}>
        {/* Vignette dernière photo */}
        <div style={{ width:44, height:44, borderRadius:8, background:'linear-gradient(135deg,#e8e8e0,#d0cfc7)', border:'1.5px solid rgba(255,255,255,0.3)', overflow:'hidden', flexShrink:0 }}>
          <div style={{ width:'100%', height:'100%', background:'rgba(255,255,255,0.05)' }} />
        </div>
        {/* Déclencheur */}
        <button
          onClick={onCapture}
          style={{ width:68, height:68, borderRadius:'50%', background:'rgba(255,255,255,0.95)', border:'3px solid rgba(255,255,255,0.5)', cursor:'pointer', boxShadow:'0 0 0 5px rgba(255,255,255,0.18), 0 2px 12px rgba(0,0,0,0.5)', transition:'transform 120ms ease-out', flexShrink:0 }}
          onMouseDown={e => e.currentTarget.style.transform='scale(0.92)'}
          onMouseUp={e => e.currentTarget.style.transform='scale(1)'}
        />
        {/* Retournement caméra */}
        <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:20, flexShrink:0 }}>
          ↻
        </div>
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
        <div className="loading-pulse" style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>Envoi en cours…</div>
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
function WF4ModeB_Success({ factureNum, file, factures, onAddNext, onReturn, onFinish, onContinue, onReplace, onDeleteFile }) {
  const uploadedCount = factures.filter(Boolean).length;
  const allUploaded = uploadedCount === 3;
  const isLast = factureNum === 3;
  return (
    <div style={{ minHeight:'100%' }}>
      <WF4ModeBHeader factureNum={factureNum} handleBack={onReturn} />
      <div style={{ padding:'20px 16px 80px 16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
          <span className="success-icon-anim" style={{ fontSize:28, lineHeight:1 }}>✓</span>
          <div style={{ fontSize:22, fontWeight:700 }}>Bien reçu !</div>
        </div>
        <div style={{ fontSize:14, color:'#666', marginBottom:20 }}>
          {uploadedCount}/3 facture{uploadedCount > 1 ? 's' : ''} ajoutée{uploadedCount > 1 ? 's' : ''}
        </div>
        <div style={{ background:'rgba(74,199,124,0.08)', border:'1px solid #4ac77c', borderRadius:8, padding:14, marginBottom:24 }}>
          <div style={{ fontSize:14, fontWeight:600, color:'#1c7a46', marginBottom:6 }}>✓ {file?.name}</div>
          <div style={{ fontSize:12, color:'#666', marginBottom:10 }}>{file?.size}</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <button className="btn-sm">Voir l'aperçu</button>
            <button className="btn-sm" onClick={onReplace}>Remplacer</button>
            <button className="btn-sm" onClick={onDeleteFile}>Supprimer</button>
          </div>
        </div>
        {(isLast || allUploaded) ? (
          <button className="btn-primary" style={{ marginBottom:12 }} onClick={onContinue}>Continuer →</button>
        ) : (
          <button
            style={{ display:'block', width:'100%', padding:14, background:'linear-gradient(143deg,#88e7a3,#2aba5b)', color:'#0d4a23', border:'none', borderRadius:999, fontSize:15, fontWeight:700, cursor:'pointer', marginBottom:12 }}
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
        <div style={{ fontSize:15, fontWeight:500, textAlign:'center', color:'#1a1b20', marginBottom:24 }}>
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
  const cameraRef = useRef(null);

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

  function handleDemoFile() {
    const idx = uploadState.currentFacture - 1;
    const fakeFile = FAKE_FACTURE_NAMES[idx];
    setUploadState(prev => {
      const newFactures = [...prev.factures];
      newFactures[prev.currentFacture - 1] = fakeFile;
      return { ...prev, subscreen: 'SUCCESS', factures: newFactures, pendingFile: fakeFile };
    });
  }

  function handleFileInput(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    // Reset input so the same file can be re-selected
    e.target.value = '';
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const ext = f.name.split('.').pop().toLowerCase();
    const validExt = ['pdf', 'jpg', 'jpeg', 'png'];
    const tooLarge = f.size > 10 * 1024 * 1024;
    if ((!validTypes.includes(f.type) && !validExt.includes(ext)) || tooLarge) {
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

  function triggerCamera() {
    cameraRef.current && cameraRef.current.click();
  }

  function simulateCapture() {
    const fakeFile = {
      name: `photo_facture_${uploadState.currentFacture}.jpg`,
      size: Math.floor(800 + Math.random() * 600) + ' Ko',
    };
    const shouldError = simulateError;
    if (shouldError && setSimulateError) setSimulateError(false);
    setUploadState(prev => ({ ...prev, subscreen: 'LOADING', pendingFile: fakeFile, progress: 0 }));
    let p = 0;
    const iv = setInterval(() => {
      p += 5;
      setUploadState(prev => ({ ...prev, progress: p }));
      if (p >= 100) {
        clearInterval(iv);
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

  // ── Inputs toujours montés (refs disponibles dans tous les sous-écrans) ───
  const hiddenInputs = (
    <>
      <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,image/*" onChange={handleFileInput} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFileInput} />
    </>
  );

  // ── Sous-écrans Mode B ────────────────────────────────────────────────────
  if (subscreen === 'PREPARE') {
    return <>{hiddenInputs}<WF4ModeB_Prepare
      factureNum={currentFacture}
      onReady={() => setSubscreen('FRAME')}
      onFileClick={triggerFilePicker}
      onNoFacture={() => navigate('WF4-sortie')}
      onBack={() => setSubscreen(null)}
      onDemoFile={handleDemoFile}
    /></>;
  }
  if (subscreen === 'FRAME') {
    return <>{hiddenInputs}<WF4ModeB_Frame
      factureNum={currentFacture}
      onCapture={() => setSubscreen('CAMERA')}
      onFileClick={triggerFilePicker}
      onNoFacture={() => navigate('WF4-sortie')}
      onBack={() => setSubscreen('PREPARE')}
      onDemoFile={handleDemoFile}
    /></>;
  }
  if (subscreen === 'CAMERA') {
    return <>{hiddenInputs}<WF4ModeB_Camera
      factureNum={currentFacture}
      onCapture={simulateCapture}
      onBack={() => setSubscreen('FRAME')}
    /></>;
  }
  if (subscreen === 'LOADING') {
    return <>{hiddenInputs}<WF4ModeB_Loading factureNum={currentFacture} fileName={pendingFile?.name} progress={progress} /></>;
  }
  if (subscreen === 'SUCCESS') {
    return <>{hiddenInputs}<WF4ModeB_Success
      factureNum={currentFacture}
      file={factures[currentFacture - 1]}
      factures={factures}
      onAddNext={() => setSubscreen('PREPARE', { currentFacture: currentFacture + 1 })}
      onReturn={() => setSubscreen(null)}
      onFinish={() => setSubscreen(null)}
      onContinue={handleContinueToWF5}
      onReplace={() => setSubscreen('PREPARE', { currentFacture })}
      onDeleteFile={() => {
        setUploadState(prev => {
          const newF = [...prev.factures]; newF[prev.currentFacture - 1] = null;
          return { ...prev, subscreen: null, factures: newF };
        });
      }}
    /></>;
  }
  if (subscreen === 'ERROR') {
    return <>{hiddenInputs}<WF4ModeB_Error
      factureNum={currentFacture}
      onRetry={() => setSubscreen('FRAME')}
      onFileClick={triggerFilePicker}
      onFinish={() => setSubscreen(null)}
    /></>;
  }

  // ── WF4 Principal ─────────────────────────────────────────────────────────
  return (
    <div className="screen-anim">
      {hiddenInputs}
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
          tooltipText="ℹ️ Le biopropane est une version du propane issue de ressources renouvelables. Cette option entraîne un coût supplémentaire par rapport au propane standard."
          openTip={openTip}
          onToggleTip={id => setOpenTip(prev => prev === id ? null : id)}
        >
          <RadioGroup
            options={[{ value:'non', label:'Non merci' }, { value:'20', label:'Oui, 20 % biopropane' }, { value:'100', label:'Oui, 100 % biopropane' }]}
            value={biopropane}
            onChange={setBiopropane}
          />
          {(biopropane === '20' || biopropane === '100') && (
            <div className="slide-down-anim" style={{ background:'rgba(74,199,124,0.08)', border:'1px solid #4ac77c', borderRadius:12, padding:12, marginTop:8, fontSize:13, color:'#1c7a46', lineHeight:1.6 }}>
              ⓘ Option payante. Le biopropane est issu de ressources renouvelables. Son cout est superieur au propane standard — ce surcout sera precise dans votre proposition de contrat.
            </div>
          )}
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
          <div style={{ fontSize:12, color:'#ec3431', marginTop:6, textAlign:'center' }}>
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
          · Dans votre boîte mail<br />
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
            <InfoBlock>Votre demande est bien enregistrée. Un conseiller vous contactera sous 24h ouvres.</InfoBlock>
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

  const rawFactures = formData.factures || [null, null, null];
  const factureCount = rawFactures.filter(Boolean).length;
  const facturesForDisplay = rawFactures.map((f, i) => f || FAKE_FACTURE_NAMES[i]);
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
          {facturesForDisplay.map((f, i) => (
            <div key={i} style={{ fontSize:12, color: rawFactures[i] ? '#999' : '#CCC', marginBottom:2 }}>· {f.name}</div>
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
          Une question avant d'envoyer ? <strong>09 70 81 80 65</strong>
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
  const [showContactTip, setShowContactTip] = useState(false);

  return (
    <div className="screen-anim">
      <TunnelHeader onHome={returnToSite || onHome} />
      <div style={{ padding:'24px 16px 32px 16px', textAlign:'center' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(74,199,124,0.08)', border:'2px solid #4ac77c', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:28, color:'#1c7a46' }}>✓</div>

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
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center' }}>
                  <div style={{ fontWeight:600, fontSize:14, flex:1 }}>Sabrina et Éric</div>
                  <TooltipBtn id="contact" onToggle={() => setShowContactTip(v => !v)} />
                </div>
                <div style={{ fontSize:13, color:'#666' }}>Vos contacts locaux</div>
                <div style={{ fontSize:13, color:'#666' }}>Appel depuis le 09 70 81 80 65</div>
              </div>
            </div>
            {showContactTip && (
              <div className="tooltip-anim" style={{ background:'#fffbe6', border:'1px solid #ffc42b', borderRadius:12, padding:10, fontSize:13, color:'#7a5800', lineHeight:1.5, width:'100%' }}>
                Si vous avez une question, vous pouvez les contacter directement. Ils connaissent déjà votre dossier.
              </div>
            )}
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
    case 'WF1-sortie':  return <ScreenWF1Sortie navigate={navigate} showRecall={showRecall} returnToSite={returnToSite} onHome={onHome} />;
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
  const bg = { ok:'rgba(74,199,124,0.15)', branch:'rgba(255,196,43,0.2)', exit:'rgba(236,52,49,0.1)' };
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
    <div style={{ padding:'8px 10px', height:'100%' }}>
      <div style={{ background: bg[type], borderRadius:5, padding:'4px 7px', fontSize:11, fontWeight:700, marginBottom:8, display:'inline-block' }}>
        {SCREEN_LABELS[screen] || screen}
      </div>
      {content.map((line, i) => (
        <div key={i} style={{ fontSize:11, color: i===0 ? '#1A1A1A' : '#777', fontWeight: i===0 ? 600 : 400, marginBottom:4, lineHeight:1.35 }}>{line}</div>
      ))}
    </div>
  );
}

function ScreenThumb({ screen, scenario, onClick }) {
  return (
    <div className="screen-thumb" onClick={onClick}>
      <div className="thumb-frame">
        {/* Mini header tunnel */}
        <div style={{ height:24, background:'#FFF', borderBottom:'1px solid #EBEBEB', display:'flex', alignItems:'center', padding:'0 8px', justifyContent:'space-between', flexShrink:0 }}>
          <span style={{ fontSize:10, fontWeight:800, letterSpacing:'-0.2px' }}>Butagaz</span>
          <span style={{ fontSize:9, color:'#AAA' }}>Retour</span>
        </div>
        <ThumbContent screen={screen} scenario={scenario} />
      </div>
      <div style={{ fontSize:12, fontWeight:600, color:'#1a1b20', marginBottom:3 }}>{SCREEN_LABELS[screen]}</div>
      <span className={`badge-${BADGE_TYPE[screen]||'ok'}`} style={{ fontSize:11 }}>
        {BADGE_TYPE[screen]==='ok' ? 'Étape' : BADGE_TYPE[screen]==='branch' ? 'Branchement' : 'Sortie'}
      </span>
    </div>
  );
}

function ArrowBetween() {
  return <div style={{ display:'flex', alignItems:'center', paddingTop:110, paddingLeft:4, paddingRight:4, flexShrink:0 }}><span style={{ fontSize:16, color:'#CCC' }}>→</span></div>;
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
  const isMobileVP = typeof window !== 'undefined' && window.innerWidth <= 500;
  const PROTOTYPE_URL = 'https://prototype-eight-sigma.vercel.app';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(PROTOTYPE_URL)}&color=FFFFFF&bgcolor=161616`;
  const [showAbout, setShowAbout] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText('victorsoussan@gmail.com').then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  }

  const modes = [
    {
      id: 'navigation',
      label: '▶  Tester un profil',
      desc: 'Choisissez un archétype utilisateur et parcourez le tunnel étape par étape, avec les données pré-remplies de ce profil.',
    },
    {
      id: 'panorama',
      label: '⊞  Voir tous les écrans',
      desc: 'Vue d\'ensemble de tous les écrans classés par scénario. Cliquez sur une miniature pour l\'ouvrir directement.',
    },
    {
      id: 'libre',
      label: '✎  Parcours libre',
      desc: 'Démarrez depuis l\'encart sur butagaz.fr, sans profil présélectionné. Testez comme un vrai utilisateur.',
    },
  ];

  const shortcuts = Object.entries(SCENARIOS).map(([id, sc]) => ({ id, label: sc.label, shortDesc: sc.shortDesc }));

  const tips = [
    { n:'1', text: <><strong style={{color:'#1a1b20'}}>Choisir un mode</strong> — Utilisez les boutons en haut (Ecrans / Profil / Libre) pour basculer entre les 3 modes.</> },
    { n:'2', text: <><strong style={{color:'#1a1b20'}}>Naviguer dans un profil</strong> — En mode Profil, selectionnez un archetype dans le menu deroulant, puis avancez avec Precedente / Suivante.</> },
    { n:'3', text: <><strong style={{color:'#1a1b20'}}>Voir tous les ecrans</strong> — En mode Ecrans, cliquez sur une miniature pour ouvrir l'ecran directement.</> },
    { n:'4', text: <><strong style={{color:'#1a1b20'}}>Mode mobile realiste</strong> — Le bouton 📱 <strong style={{color:'#1a1b20'}}>Mobile</strong> dans la barre bleue masque l'interface du prototype et affiche le parcours comme sur un vrai telephone.</> },
    { n:'5', text: <><strong style={{color:'#1a1b20'}}>Les sorties font partie du parcours</strong> — Les liens Retour au site butagaz.fr sont intentionnels : ils representent les sorties pour les profils non eligibles.</> },
    { n:'6', text: <><strong style={{color:'#1a1b20'}}>Tester avec ou sans offre</strong> — Le bouton Offre en haut a droite affiche la variante avec l'offre 200 € active.</> },
  ];

  const sectionStyle = { background:'#fff', border:'1px solid #dde6ed', borderRadius:12, padding:'14px 18px', marginBottom:8 };
  const sectionLabelStyle = { fontSize:11, color:'#439fdb', textTransform:'uppercase', letterSpacing:'1.5px', fontWeight:600 };

  return (
    <div style={{ minHeight:'100dvh', position:'relative', display:'flex', flexDirection:'column', alignItems:'center', justifyContent: isMobileVP ? 'flex-start' : 'center', padding: isMobileVP ? '40px 20px 48px' : '48px 20px', overflow:'hidden' }}>
      {/* Photo de fond */}
      <div style={{ position:'fixed', inset:0, zIndex:0 }}>
        <img src="/cover-citerne.webp" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 55%' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(245,249,253,0.96) 60%, rgba(235,242,249,1) 100%)' }} />
      </div>
      <div style={{ maxWidth:520, width:'100%', position:'relative', zIndex:1 }}>

        {/* Logo Butagaz + badge prototype */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <img src="/logo-butagaz.png" alt="Butagaz" style={{ height:36, width:'auto' }} />
          <div style={{ height:20, width:1, background:'rgba(0,0,0,0.12)' }} />
          <div style={{ fontSize:10, color:'#439fdb', background:'#ecf5fb', border:'1px solid #c2dcf0', display:'inline-block', padding:'3px 10px', borderRadius:6, textTransform:'uppercase', letterSpacing:'2px', fontWeight:600 }}>Prototype interactif v2.1</div>
        </div>
        <h1 style={{ fontSize: isMobileVP ? 42 : 56, fontWeight:800, color:'#1a1b20', letterSpacing:'-2.5px', lineHeight:1, marginBottom:8 }}>Butaswitch</h1>
        <div style={{ fontSize:15, color:'#666f7c', marginBottom:36, fontWeight:500 }}>Butagaz — Parcours de souscription GPL en ligne</div>

        {/* Mode cards — action principale */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
          {modes.map((m, i) => (
            <div key={m.id} className="welcome-card-stagger" style={{ animationDelay: `${i * 65}ms` }}>
              <button className="welcome-mode-btn" onClick={() => onStart(m.id)}>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:5, letterSpacing:'-0.2px', color:'#0079c0' }}>{m.label}</div>
                <div style={{ fontSize:13, lineHeight:1.55, fontWeight:400, color:'#666f7c' }}>{m.desc}</div>
              </button>
            </div>
          ))}
        </div>

        {/* Callout mode mobile */}
        <div style={{ background:'#ecf5fb', border:'1px solid #c2dcf0', borderRadius:10, padding:'12px 16px', marginBottom:8, display:'flex', alignItems:'flex-start', gap:12 }}>
          <span style={{ fontSize:18, flexShrink:0, lineHeight:1.3 }}>📱</span>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:'#0079c0', marginBottom:3 }}>Mode mobile realiste</div>
            <div style={{ fontSize:12, color:'#666f7c', lineHeight:1.6 }}>Cliquez sur le bouton <strong style={{color:'#1a1b20'}}>Mobile</strong> dans la barre bleue pour voir le parcours comme sur un vrai telephone. Sur mobile, appuyez sur <strong style={{color:'#1a1b20'}}>← Quitter</strong> dans la barre du bas pour revenir.</div>
          </div>
        </div>

        {/* Raccourcis par scénario — progressive disclosure */}
        <div style={sectionStyle}>
          <button className="welcome-collapse-trigger" onClick={() => setShowShortcuts(v => !v)}>
            <span style={sectionLabelStyle}>Démarrer directement sur un scénario</span>
            <span className={`welcome-chevron${showShortcuts ? ' wc-open' : ''}`}>▾</span>
          </button>
          <div className={`welcome-collapse-content${showShortcuts ? ' wc-open' : ' wc-closed'}`}>
            <div style={{ paddingTop:12, display:'flex', flexDirection:'column', gap:6 }}>
              {shortcuts.map(sc => (
                <button key={sc.id} className="welcome-scenario-chip" onClick={() => onStart('navigation', sc.id)}>
                  <div style={{ fontWeight:600, fontSize:13, color:'#1a1b20', marginBottom:2 }}>{sc.label}</div>
                  <div style={{ fontSize:12, color:'#666f7c' }}>{sc.shortDesc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* À propos — collapsible, ouvert par défaut */}
        <div style={sectionStyle}>
          <button className="welcome-collapse-trigger" onClick={() => setShowAbout(v => !v)}>
            <span style={sectionLabelStyle}>À propos de ce prototype</span>
            <span className={`welcome-chevron${showAbout ? ' wc-open' : ''}`}>▾</span>
          </button>
          <div className={`welcome-collapse-content${showAbout ? ' wc-open' : ' wc-closed'}`}>
            <div style={{ paddingTop:14 }}>
              <p style={{ fontSize:13, color:'#666f7c', lineHeight:1.75, margin:0, marginBottom:10 }}>
                Ce prototype couvre le parcours complet de souscription, de l'encart integre sur butagaz.fr jusqu'a la confirmation de demande de contrat GPL.
              </p>
              <p style={{ fontSize:13, color:'#666f7c', lineHeight:1.75, margin:0, marginBottom:10 }}>
                Il a ete concu pour tester la lisibilite du tunnel, la coherence des sorties non-eligibles (locataire, pas de factures, mauvaise energie), et la charge percue des etapes de qualification.
              </p>
              <p style={{ fontSize:13, color:'#8b9aa4', lineHeight:1.75, margin:0 }}>
                Six profils utilisateurs sont representes : du client autonome qui compare les prix au client qui prefere etre rappele.
              </p>
            </div>
          </div>
        </div>

        {/* Guide pratique — collapsible */}
        <div style={{ ...sectionStyle, marginBottom: isMobileVP ? 8 : 8 }}>
          <button className="welcome-collapse-trigger" onClick={() => setShowGuide(v => !v)}>
            <span style={sectionLabelStyle}>Guide pratique</span>
            <span className={`welcome-chevron${showGuide ? ' wc-open' : ''}`}>▾</span>
          </button>
          <div className={`welcome-collapse-content${showGuide ? ' wc-open' : ' wc-closed'}`}>
            <div style={{ paddingTop:14 }}>
              {tips.map(tip => (
                <div key={tip.n} style={{ display:'flex', gap:12, marginBottom:12, alignItems:'flex-start' }}>
                  <span style={{ width:20, height:20, borderRadius:'50%', background:'#ecf5fb', border:'1px solid #c2dcf0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#439fdb', fontWeight:700, flexShrink:0, marginTop:2 }}>{tip.n}</span>
                  <span style={{ fontSize:13, color:'#666f7c', lineHeight:1.65 }}>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QR code */}
        <div style={{ ...sectionStyle, display:'flex', flexDirection: isMobileVP ? 'column' : 'row', alignItems: isMobileVP ? 'center' : 'center', gap:18, marginBottom:8, textAlign: isMobileVP ? 'center' : 'left' }}>
          <img src={qrUrl} alt="QR code" style={{ width: isMobileVP ? 140 : 96, height: isMobileVP ? 140 : 96, borderRadius:8, flexShrink:0 }} />
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:'#1a1b20', marginBottom:4 }}>Tester sur mobile</div>
            <div style={{ fontSize:12, color:'#666f7c', lineHeight:1.65, marginBottom:8 }}>Scannez ce QR code pour ouvrir le prototype sur votre telephone.</div>
            <div style={{ fontSize:11, color:'#8b9aa4', fontFamily:'monospace', letterSpacing:'-0.3px' }}>{PROTOTYPE_URL}</div>
          </div>
        </div>

        {/* Footer contact */}
        <div style={{ ...sectionStyle, marginBottom:0, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:'#1a1b20', marginBottom:2 }}>Victor Soussan</div>
            <a href="mailto:victorsoussan@gmail.com" style={{ fontSize:12, color:'#439fdb', textDecoration:'none' }}>victorsoussan@gmail.com</a>
          </div>
          <button className="welcome-copy-btn" onClick={copyEmail}>
            {emailCopied ? '✓ Copié' : 'Copier l\'email'}
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── PANORAMA VIEW ────────────────────────────────────────────────────────────
function PanoramaView({ activeScenario, setActiveScenario, onThumbClick }) {
  const tabs = ['A','B','C','D','E','F','Tous'];
  const scenariosToShow = activeScenario === 'Tous'
    ? Object.entries(SCENARIOS)
    : SCENARIOS[activeScenario] ? [[activeScenario, SCENARIOS[activeScenario]]] : [];

  return (
    <div className="pano-view-root">
      {/* Tabs */}
      <div className="pano-tabs-bar" style={{ background:'#FFF', borderBottom:'1px solid #E0E0E0', padding:'10px 12px', display:'flex', gap:6, position:'sticky', top:93, zIndex:100, overflowX:'auto' }}>
        <span className="pano-tabs-label" style={{ fontSize:13, fontWeight:600, color:'#666', display:'flex', alignItems:'center', marginRight:4, flexShrink:0, whiteSpace:'nowrap' }}>Scénario :</span>
        {tabs.map(t => (
          <button
            key={t}
            className={`tab-btn${activeScenario===t?' active':''}`}
            style={{ fontSize:12, padding:'5px 10px', flexShrink:0 }}
            onClick={() => setActiveScenario(t)}
          >
            {t === 'Tous' ? 'Tous' : SCENARIOS[t] ? SCENARIOS[t].label.split('.')[0].trim() + '.' : t}
          </button>
        ))}
      </div>

      {/* MOBILE LIST (CSS-driven, affiché via media query) */}
      <div className="pano-mobile-list" style={{ padding:'12px' }}>
        {scenariosToShow.map(([id, sc]) => (
          <div key={id} style={{ background:'#FFF', borderRadius:12, marginBottom:12, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid #F0F0F0' }}>
              <div style={{ fontWeight:700, fontSize:16, marginBottom:2 }}>{sc.label}</div>
              <div style={{ fontSize:13, color:'#999' }}>{sc.shortDesc}</div>
            </div>
            {sc.screens.map((screen, i) => {
              const badge = BADGE_TYPE[screen] || 'ok';
              const bgBadge = { ok:'rgba(74,199,124,0.15)', branch:'rgba(255,196,43,0.2)', exit:'rgba(236,52,49,0.1)' };
              const colorBadge = { ok:'#1c7a46', branch:'#7a5800', exit:'#b02624' };
              return (
                <div
                  key={screen}
                  onClick={() => onThumbClick(id, screen, i)}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom: i < sc.screens.length - 1 ? '1px solid #F5F5F5' : 'none', cursor:'pointer', WebkitTapHighlightColor:'transparent', background:'#FFF' }}
                  onTouchStart={e => e.currentTarget.style.background='#F5F5F5'}
                  onTouchEnd={e => e.currentTarget.style.background='#FFF'}
                  onTouchCancel={e => e.currentTarget.style.background='#FFF'}
                >
                  <div style={{ width:30, height:30, borderRadius:'50%', background:'#F0F0F0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#666', flexShrink:0 }}>{i + 1}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:15, fontWeight:600, color:'#1a1b20', marginBottom:1 }}>{SCREEN_LABELS[screen] || screen}</div>
                  </div>
                  <span style={{ padding:'3px 9px', borderRadius:10, fontSize:11, fontWeight:600, background:bgBadge[badge], color:colorBadge[badge], flexShrink:0 }}>
                    {badge === 'ok' ? 'Étape' : badge === 'branch' ? 'Branchement' : 'Sortie'}
                  </span>
                  <span style={{ color:'#CCC', fontSize:18, flexShrink:0 }}>›</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* DESKTOP THUMBNAILS */}
      <div className="pano-desktop-thumbs" style={{ padding:'16px' }}>
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

// ─── IMMERSIVE LAYOUT ────────────────────────────────────────────────────────
function ImmersiveLayout({ onExit, children }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onExit(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onExit]);

  const StatusBar = () => (
    <div className="ios-status">
      <span className="ios-status-time">9:41</span>
      <div className="ios-status-icons">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="#1A1A1A"><rect x="0" y="3" width="3" height="9" rx="1"/><rect x="4.5" y="2" width="3" height="10" rx="1"/><rect x="9" y="0" width="3" height="12" rx="1"/><rect x="13.5" y="0" width="3" height="12" rx="1" opacity="0.3"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="#1A1A1A"><path d="M8 2.5C10.5 2.5 12.7 3.6 14.2 5.3L15.5 4C13.6 1.9 10.9.7 8 .7S2.4 1.9.5 4L1.8 5.3C3.3 3.6 5.5 2.5 8 2.5z"/><path d="M8 5.5C9.7 5.5 11.2 6.2 12.3 7.3L13.6 6C12.1 4.4 10.1 3.5 8 3.5S3.9 4.4 2.4 6L3.7 7.3C4.8 6.2 6.3 5.5 8 5.5z"/><circle cx="8" cy="10" r="1.8"/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#1A1A1A" strokeOpacity="0.35"/><rect x="1.5" y="1.5" width="18" height="9" rx="2" fill="#1A1A1A"/><path d="M23 4v4c.8-.5 1.3-1.2 1.3-2S23.8 4.5 23 4z" fill="#1A1A1A" fillOpacity="0.4"/></svg>
      </div>
    </div>
  );

  const AddressBar = () => (
    <div className="ios-address">
      <span className="ios-nav-icon disabled">‹</span>
      <span className="ios-nav-icon disabled" style={{ opacity: 0.2 }}>›</span>
      <div className="ios-url-pill">
        <svg width="12" height="14" viewBox="0 0 12 14" fill="#666"><path d="M6 0C4.3 0 3 1.3 3 3v1H1.5C.7 4 0 4.7 0 5.5v7c0 .8.7 1.5 1.5 1.5h9c.8 0 1.5-.7 1.5-1.5v-7C12 4.7 11.3 4 10.5 4H9V3C9 1.3 7.7 0 6 0zm0 1.5c.8 0 1.5.7 1.5 1.5v1h-3V3c0-.8.7-1.5 1.5-1.5z"/></svg>
        <span className="ios-url-text">butagaz.fr/souscription</span>
      </div>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="#0A84FF" style={{ flexShrink:0 }}><path d="M9 1l3 3H10v6H8V4H6L9 1zm-6 8v6h12V9h-2v5H5V9H3z"/></svg>
    </div>
  );

  const BottomBar = ({ onExit }) => (
    <div className="ios-bottom">
      <span className="ios-bottom-icon disabled ios-bottom-desktop">‹</span>
      <span className="ios-bottom-icon disabled ios-bottom-desktop" style={{ opacity: 0.2 }}>›</span>
      <svg className="ios-bottom-desktop" width="20" height="20" viewBox="0 0 20 20" fill="#0A84FF"><rect x="1" y="5" width="13" height="14" rx="2" stroke="#0A84FF" strokeWidth="1.5" fill="none"/><path d="M4 4V3a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2h-1" stroke="#0A84FF" strokeWidth="1.5" fill="none"/></svg>
      <svg className="ios-bottom-desktop" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#0A84FF" strokeWidth="1.5"><path d="M3 3h5v5H3zM12 3h5v5h-5zM3 12h5v5H3zM12 12h5v5h-5z"/></svg>
      <button className="ios-exit-btn" onClick={onExit}>← Retour au prototype complet</button>
    </div>
  );

  return (
    <div className="immersive-overlay">
      <div className="immersive-phone-shell">
        <div className="ios-dynamic-island" />
        <StatusBar />
        <AddressBar />
        {children}
        <BottomBar onExit={onExit} />
      </div>
      <button className="immersive-exit-pill" onClick={onExit}>
        ← Retour à l'interface prototype
      </button>
    </div>
  );
}

// ─── NAVIGATION VIEW ─────────────────────────────────────────────────────────
function NavigationView({
  scenario, setScenario, currentScreen, setCurrentScreen,
  formData, setFormData, showAnnotations, setShowAnnotations,
  returnTo, setReturnTo, stepHistory, setStepHistory,
  offerMode, setOfferMode, onSwitchToPanorama, isLibre, isMobileVP,
  immersiveMode, setImmersiveMode,
  showBrowserChrome, setShowBrowserChrome,
}) {
  const [showRecallModal, setShowRecallModal] = useState(false);
  const [screenKey, setScreenKey] = useState(0);
  const [navDir, setNavDir] = useState(1); // 1 = forward, -1 = back
  const [simulateError, setSimulateError] = useState(false);
  const mobileFrameRef = useRef(null);

  const sc = scenario && SCENARIOS[scenario];
  const screenList = isLibre ? null : sc?.screens;
  const currentIdx = screenList ? screenList.indexOf(currentScreen) : -1;

  function navigate(screen, dir = 1) {
    if (!isLibre && screen !== currentScreen) {
      setStepHistory(prev => prev.includes(screen) ? prev : [...prev, screen]);
    }
    setNavDir(dir);
    setCurrentScreen(screen);
    setScreenKey(k => k + 1);
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
    if (currentIdx > 0) navigate(screenList[currentIdx - 1], -1);
  }
  function handleNext() {
    if (currentIdx < screenList.length - 1) navigate(screenList[currentIdx + 1], 1);
  }

  const annText = ANNOTATIONS[currentScreen];
  const ctxText = scenario && CONTEXT_TEXT[scenario];

  const isTunnelScreen = STEP_FOR_SCREEN[currentScreen] !== undefined;

  const screenRouterEl = (
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
  );

  if (immersiveMode) {
    return (
      <ImmersiveLayout onExit={() => setImmersiveMode(false)}>
        <div ref={mobileFrameRef} className="immersive-phone-content">
          {screenRouterEl}
        </div>
      </ImmersiveLayout>
    );
  }

  return (
    <div className="nav-view" style={{ background:'#f0f4f8', display:'flex', flexDirection:'column' }}>
      {/* Nav scenario bar */}
      <div className="nav-scenario-bar">
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
          >
            {Object.entries(SCENARIOS).map(([id, sc]) => (
              <option key={id} value={id}>{sc.label}</option>
            ))}
          </select>
        )}
        <div style={{ flex:1, fontSize:13, color:'#666', minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {currentScreen && <span><strong>{SCREEN_LABELS[currentScreen]}</strong>{currentIdx >= 0 && screenList ? ` · ${currentIdx+1}/${screenList.length}` : ''}</span>}
        </div>
        <button className="nav-panels btn-sm" onClick={onSwitchToPanorama}>
          Tous les écrans
        </button>
      </div>

      {/* Main — toujours 3 colonnes : gauche | centre | droite */}
      <div className="nav-main-layout" style={{ flex:1, display:'flex', gap:16, padding:'16px', justifyContent:'center', alignItems:'flex-start', minHeight:0, overflow:'auto' }}>

        {/* Panneau gauche — Annotations UX */}
        {showAnnotations && (
          <div className="ann-panel">
            <div className="ann-panel-title">Annotations UX</div>
            <div>{annText || 'Aucune annotation pour cet écran.'}</div>
          </div>
        )}

        {/* Centre — Frame téléphone ou Browser chrome (720px) */}
        <div className="nav-frame-wrap-desktop" style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
          {showBrowserChrome ? (
            <div style={{ width:800, background:'#e8eaed', borderRadius:12, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' }}>
              {/* Barre de titre macOS */}
              <div style={{ background:'#d4d7db', padding:'10px 14px 0', display:'flex', flexDirection:'column' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                  {['#ff5f57','#ffbd2e','#28c840'].map((c,i) => (
                    <div key={i} style={{ width:12, height:12, borderRadius:'50%', background:c }} />
                  ))}
                </div>
                <div style={{ display:'flex', alignItems:'flex-end', gap:0, paddingLeft:2 }}>
                  <div style={{ background:'#fff', padding:'6px 16px 0', borderRadius:'6px 6px 0 0', fontSize:11, color:'#1a1b20', fontWeight:500, display:'flex', alignItems:'center', gap:6, minWidth:200, maxWidth:280 }}>
                    <img src="/logo-butagaz.png" alt="" style={{ height:12, width:'auto', flexShrink:0 }} />
                    <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Butagaz — Souscription gaz citerne</span>
                    <span style={{ fontSize:10, color:'#bbb', cursor:'pointer', marginLeft:4 }}>×</span>
                  </div>
                  <div style={{ width:28, height:26, borderRadius:'4px 4px 0 0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'#888', cursor:'pointer' }}>+</div>
                </div>
                <div style={{ background:'#fff', padding:'7px 12px', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                    {['←','→','↻'].map((c,i) => <span key={i} style={{ fontSize:15, color: i < 2 ? '#ccc' : '#666', cursor:'pointer', lineHeight:1 }}>{c}</span>)}
                  </div>
                  <div style={{ flex:1, background:'#f1f3f4', borderRadius:20, padding:'5px 14px', display:'flex', alignItems:'center', gap:7 }}>
                    <span style={{ fontSize:12, color:'#2a9d5c', flexShrink:0 }}>🔒</span>
                    <span style={{ fontSize:13, color:'#3c4043', flex:1 }}>butagaz.fr/souscrire-gaz-citerne</span>
                  </div>
                  <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                    {['☆','⋮'].map((c,i) => <span key={i} style={{ fontSize:17, color:'#666', cursor:'pointer' }}>{c}</span>)}
                  </div>
                </div>
              </div>
              {/* Contenu — centré à 640px */}
              <div key={screenKey} ref={mobileFrameRef} className="mobile-scroll" style={{ height:'calc(100dvh - 240px)', overflowY:'auto', overflowX:'hidden', background:'#f4f6f8', '--screen-dir': `${navDir * 16}px` }}>
                <div className="browser-inner-content">
                  {screenRouterEl}
                </div>
              </div>
            </div>
          ) : (
            <div key={screenKey} ref={mobileFrameRef} className="nav-frame-desktop mobile-scroll" style={{ '--screen-dir': `${navDir * 16}px` }}>
              {screenRouterEl}
            </div>
          )}
          {isLibre && (
            <button
              onClick={() => setSimulateError(v => !v)}
              style={{ padding:'5px 12px', fontSize:12, cursor:'pointer', borderRadius:6, background: simulateError ? '#FFF0F0' : '#FFF', border: simulateError ? '1px solid #ec3431' : '1px solid #D0D0D0', color: simulateError ? '#ec3431' : '#999' }}
            >
              {simulateError ? '✗ Erreur activée' : 'Simuler erreur upload'}
            </button>
          )}
        </div>

        {/* Panneau droit — Contexte scénario */}
        {showAnnotations && (
          <div className="ann-panel">
            <div className="ann-panel-title">Contexte scénario</div>
            <div style={{ whiteSpace:'pre-wrap' }}>{ctxText || (isLibre ? 'Mode parcours libre — aucun profil présélectionné.' : '—')}</div>
          </div>
        )}

      </div>

      {/* Prev / Next */}
      {screenList && screenList.length > 1 && (
        <div className="nav-bottom-bar">
          <button className="btn-sm" onClick={handlePrev} style={{ opacity: currentIdx > 0 ? 1 : 0.3 }} disabled={currentIdx <= 0}>← Précédente</button>
          <div style={{ display:'flex', gap:5, alignItems:'center' }}>
            {screenList.map((s, i) => (
              <div key={s} style={{ width: i === currentIdx ? 18 : 7, height:7, borderRadius: i === currentIdx ? 4 : '50%', background: i === currentIdx ? '#439fdb' : '#dde6ed', flexShrink:0, transition:'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)' }} />
            ))}
          </div>
          <button className="btn-sm" onClick={handleNext} style={{ opacity: currentIdx < screenList.length-1 ? 1 : 0.3 }} disabled={currentIdx >= screenList.length-1}>Suivante →</button>
        </div>
      )}

      {showRecallModal && <RecallModal formData={formData} onClose={() => setShowRecallModal(false)} />}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [isMobileVP, setIsMobileVP] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 500);
  useEffect(() => {
    const handler = () => setIsMobileVP(window.innerWidth <= 500);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

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
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [showBrowserChrome, setShowBrowserChrome] = useState(false);

  function handleStart(startMode, scenarioId) {
    if (scenarioId && SCENARIOS[scenarioId]) {
      const sc = SCENARIOS[scenarioId];
      setScenario(scenarioId);
      setFormData({ ...sc.form, _wf1Choice: sc.screenChoices?.WF1 });
      setCurrentScreen('PAGE0');
      setStepHistory(['PAGE0']);
      setReturnTo(null);
    }
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
    if (immersiveMode) setImmersiveMode(false);
    if (newMode === 'libre') {
      setFormData({ ...EMPTY_FORM });
      setCurrentScreen('PAGE0');
      setStepHistory(['PAGE0']);
      setReturnTo(null);
    }
    setMode(newMode);
  }

  function handleImmersiveToggle() {
    if (immersiveMode) {
      setImmersiveMode(false);
    } else {
      if (mode === 'panorama') {
        setFormData({ ...EMPTY_FORM });
        setCurrentScreen('PAGE0');
        setStepHistory(['PAGE0']);
        setReturnTo(null);
        setMode('libre');
      }
      setImmersiveMode(true);
    }
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
      <div className="app-shell">

      {/* Top mode bar */}
      <div className="shell-topbar">
        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0, cursor:'pointer' }} onClick={() => setIsWelcome(true)}>
          <img src="/logo-butagaz.png" alt="Butagaz" style={{ height:22, width:'auto', filter:'brightness(0) invert(1)', opacity:0.9, flexShrink:0 }} />
          <span className="shell-logo">Butaswitch</span>
        </div>
        <span className="shell-version">v2.1</span>
        <div className="shell-modes">
          {[
            { id:'panorama', label:'⊞ Tous les écrans', short:'Écrans' },
            { id:'navigation', label:'▶ Tester un profil', short:'Profil' },
            { id:'libre', label:'✎ Parcours libre', short:'Libre' },
          ].map(m => (
            <button
              key={m.id}
              className={`shell-mode-btn${mode===m.id?' active':''}`}
              onClick={() => handleModeChange(m.id)}
            >
              <span className="shell-label-long">{m.label}</span>
              <span className="shell-label-short" style={{ display:'none' }}>{m.short}</span>
            </button>
          ))}
        </div>
        {(mode === 'navigation' || mode === 'libre') && (<>
          <div className="shell-separator" style={{ width:1, height:22, background:'rgba(255,255,255,0.2)', flexShrink:0 }} />
          {/* View toggles */}
          <div className="shell-view-toggles" style={{ display:'flex', gap:2, background:'rgba(0,0,0,0.18)', borderRadius:9, padding:2, flexShrink:0 }}>
            <button
              className="shell-mode-btn"
              style={{ background: !immersiveMode && !showBrowserChrome ? '#fff' : 'transparent', color: !immersiveMode && !showBrowserChrome ? '#0079c0' : 'rgba(255,255,255,0.7)', fontWeight: !immersiveMode && !showBrowserChrome ? 700 : 500, padding:'4px 10px', fontSize:12, minHeight:30 }}
              onClick={() => { setImmersiveMode(false); setShowBrowserChrome(false); }}
            >
              UI Mobile
            </button>
            <button
              className="shell-mode-btn"
              style={{ background: immersiveMode ? '#fff' : 'transparent', color: immersiveMode ? '#0079c0' : 'rgba(255,255,255,0.7)', fontWeight: immersiveMode ? 700 : 500, padding:'4px 10px', fontSize:12, minHeight:30, display:'flex', alignItems:'center', gap:5 }}
              onClick={() => { setImmersiveMode(true); setShowBrowserChrome(false); }}
            >
              <Smartphone size={13} strokeWidth={2.2} />
              <span>Smartphone</span>
            </button>
            <button
              className="shell-mode-btn"
              style={{ background: showBrowserChrome ? '#fff' : 'transparent', color: showBrowserChrome ? '#0079c0' : 'rgba(255,255,255,0.7)', fontWeight: showBrowserChrome ? 700 : 500, padding:'4px 10px', fontSize:12, minHeight:30, display:'flex', alignItems:'center', gap:5 }}
              onClick={() => { setShowBrowserChrome(v => !v); setImmersiveMode(false); }}
            >
              <Monitor size={13} strokeWidth={2.2} />
              <span>Navigateur desktop</span>
            </button>
          </div>
          {/* Annotations switch */}
          <div className="shell-ann-toggle ann-switch" onClick={() => setShowAnnotations(v => !v)}>
            <span className="ann-switch-label">Annotations</span>
            <button
              className="ann-switch-track"
              data-on={String(showAnnotations)}
              role="switch"
              aria-checked={showAnnotations}
              aria-label="Afficher les annotations"
            >
              <span className="ann-switch-thumb" />
            </button>
          </div>
        </>)}
        <button
          className={`shell-offer-chip${offerMode ? ' on' : ''}`}
          onClick={() => setOfferMode(v => !v)}
          aria-label={offerMode ? "Désactiver l'offre promotionnelle" : "Activer l'offre promotionnelle"}
          title={offerMode ? "Version avec offre 200€ — cliquez pour désactiver" : "Version sans offre — cliquez pour afficher la promo"}
        >
          <span className="shell-label-short">{offerMode ? 'Promo on' : 'Promo off'}</span>
          <span className="shell-label-long">{offerMode ? '✓ Avec offre 200 €' : 'Sans offre promo'}</span>
        </button>
      </div>

      {/* Mode descriptor bar */}
      <div className="mode-descriptor-bar">
        {mode === 'panorama' && <>
          <span className="mode-descriptor-icon">⊞</span>
          <strong>Tous les écrans du prototype</strong> — Vue complète classée par profil utilisateur. Cliquez sur un écran pour le tester directement.
        </>}
        {mode === 'navigation' && <>
          <span className="mode-descriptor-icon">▶</span>
          <strong>Tester un profil</strong> — Sélectionnez un archétype et parcourez le tunnel étape par étape, avec les données pré-remplies de ce profil.
        </>}
        {mode === 'libre' && <>
          <span className="mode-descriptor-icon">✎</span>
          <strong>Parcours libre</strong> — Démarrez depuis le site butagaz.fr, sans profil présélectionné. Testez comme un vrai utilisateur arrivant de zéro.
        </>}
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
          immersiveMode={immersiveMode}
          setImmersiveMode={setImmersiveMode}
          showBrowserChrome={showBrowserChrome}
          setShowBrowserChrome={setShowBrowserChrome}
        />
      )}
      </div>{/* /app-shell */}
    </>
  );
}
