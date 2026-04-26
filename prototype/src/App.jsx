// Butaswitch — Prototype interactif v2
// Fichier unique React JSX — Simon White / Victor Soussan Studio
// Avril 2026 — Intègre les décisions FigJam (Pierre-Louis du Chazaud, Élodie Jolly, Simon White)

import { useState, useEffect, useRef } from 'react';
import { Smartphone, Monitor, Repeat2, Home, Flame, Zap, Lock, MessageCircle, Menu, X, LayoutGrid, Check, CheckCircle, Info, AlertTriangle, ChevronRight } from 'lucide-react';

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
@keyframes sdIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

/* Upload progress bar */
.upbar-track { height: 4px; background: #E0E0E0; border-radius: 2px; margin-top: 10px; overflow: hidden; }
.upbar-fill { height:100%; background:linear-gradient(90deg,#88e7a3,#2aba5b); border-radius:2px; transition:width 0.5s cubic-bezier(0.23,1,0.32,1); }

/* Choice blocks */
.choice-block { border: 1.5px solid #dde6ed; border-radius: 16px; padding: 18px 20px; margin-bottom: 10px; cursor: pointer; transition: border-color 130ms ease-out, background 120ms ease-out, transform 110ms var(--ease-out-strong), box-shadow 150ms ease-out; background: #fff; }
@media (hover: hover) and (pointer: fine) { .choice-block:hover { border-color: #439fdb; background: #f5f9fd; } }
.choice-block:active { transform: scale(0.985); }
.choice-block.selected { border: 2px solid #439fdb !important; background: #ecf5fb; box-shadow: 0 0 0 3px rgba(67,159,219,0.14); }

/* Radio card — touch target mobile-first (≥52px), remplace RadioGroup inline */
.radio-card { display:flex; align-items:center; gap:14px; min-height:52px; padding:14px 18px; border:1.5px solid #dde6ed; border-radius:16px; background:#fff; cursor:pointer; font-size:15px; font-weight:600; color:#1a1b20; width:100%; transition:border-color 130ms ease-out, background 120ms ease-out, transform 110ms var(--ease-out-strong), box-shadow 150ms ease-out; margin-bottom:10px; }
@media (hover: hover) and (pointer: fine) { .radio-card:hover { border-color:#439fdb; background:#f5f9fd; } }
.radio-card:active { transform:scale(0.985); }
.radio-card.selected { border:2px solid #439fdb; background:#ecf5fb; box-shadow:0 0 0 3px rgba(67,159,219,0.14); }
.radio-card input[type="radio"] { position:absolute; opacity:0; width:0; height:0; pointer-events:none; }
.radio-dot { width:20px; height:20px; border-radius:50%; border:2px solid #c6d8e6; background:#fff; flex-shrink:0; transition:border-color 130ms, background 130ms; position:relative; }
.radio-card.selected .radio-dot { border-color:#439fdb; background:#439fdb; }
.radio-card.selected .radio-dot::after { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:7px; height:7px; border-radius:50%; background:#fff; }

/* Upload zone */
.upload-empty { border: 2px dashed #439fdb; border-radius: 14px; padding: 24px; text-align: center; cursor: pointer; transition: border-color 0.1s, background 0.1s; background: #f9fcff; }
.upload-empty:hover { border-color: #1a86cc; background: #ecf5fb; }

/* Input focus */
.field-input { width: 100%; min-height: 44px; border: 1.5px solid #439fdb; border-radius: 999px; padding: 0 18px; font-size: 14px; color: #1a1b20; background: #fff; transition: border-color 0.1s, box-shadow 0.1s; outline: none; font-family: var(--font-main); }
.field-input:focus { border-color: #1a86cc; box-shadow: 0 0 0 3px rgba(67,159,219,0.15); }
.field-input.err { border-color: #ec3431; }
textarea.field-input { padding: 12px 18px; resize: vertical; min-height: 90px; border-radius: 16px; }

/* Buttons */
.btn-primary { display: block; width: 100%; padding: 14px 24px; background: #ffed48; color: #1a1b20; border: none; border-radius: 999px; font-size: 15px; font-weight: 700; cursor: pointer; text-align: center; transition: background 0.15s ease-out, transform 0.12s ease-out; font-family: var(--font-main); }
.btn-primary:active { transform: scale(0.97); filter: brightness(0.96); }
@media (hover: hover) and (pointer: fine) { .btn-primary:hover { background: linear-gradient(177deg,#ffed48,#ffc42b); } }
.btn-secondary { display: block; width: 100%; padding: 12px 24px; background: transparent; color: #439fdb; border: 1.5px solid #439fdb; border-radius: 999px; font-size: 15px; font-weight: 600; cursor: pointer; text-align: center; transition: background 0.15s ease-out, transform 0.12s ease-out; font-family: var(--font-main); }
.btn-secondary:active { transform: scale(0.97); }
@media (hover: hover) and (pointer: fine) { .btn-secondary:hover { background: #ecf5fb; } }
.btn-sm { display: inline-flex; align-items: center; padding: 8px 16px; background: #fff; color: #439fdb; border: 1.5px solid #439fdb; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; gap: 5px; min-height: 36px; transition: background 0.15s ease-out, transform 0.1s ease-out; }
@media (hover: hover) and (pointer: fine) { .btn-sm:hover { background: #ecf5fb; } }
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

/* Mobile shell — expérience QR code */
.mobile-burger-fab { position:fixed; top:14px; right:14px; z-index:1000; width:42px; height:42px; border-radius:50%; background:rgba(0,89,160,0.88); border:none; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(0,0,0,0.28); cursor:pointer; backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); transition:transform 120ms var(--ease-out-strong), background 120ms; }
.mobile-burger-fab:active { transform:scale(0.94); }
.mobile-menu-panel { position:fixed; top:66px; right:14px; z-index:999; background:#fff; border-radius:18px; box-shadow:0 8px 40px rgba(0,0,0,0.18); padding:6px; min-width:200px; animation:menuPanelIn 160ms var(--ease-out-strong); }
@keyframes menuPanelIn { from { opacity:0; transform:scale(0.95) translateY(-6px); } to { opacity:1; transform:scale(1) translateY(0); } }
.mobile-menu-item { display:flex; align-items:center; gap:12px; padding:13px 16px; border-radius:12px; border:none; background:none; width:100%; text-align:left; font-size:15px; font-weight:600; color:#1a1b20; cursor:pointer; font-family:var(--font-main); transition:background 100ms; }
.mobile-menu-item:active { background:#f0f4f8; }
@media (hover:hover) and (pointer:fine) { .mobile-menu-item:hover { background:#f0f4f8; } }
.mobile-menu-separator { height:1px; background:#f0f4f8; margin:2px 0; }
.mobile-gallery-root { min-height:100dvh; background:#f0f4f8; padding-bottom:120px; }
.mobile-gallery-header { position:sticky; top:0; z-index:100; background:rgba(240,244,248,0.94); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); padding:14px 20px; display:flex; align-items:center; gap:12px; border-bottom:1px solid #dde6ed; }
.mobile-gallery-back { background:none; border:none; color:#0059a0; font-size:15px; font-weight:700; cursor:pointer; padding:4px 0; display:flex; align-items:center; gap:6px; font-family:var(--font-main); }
.mobile-gallery-item { margin:0 16px 14px; background:#fff; border-radius:18px; overflow:hidden; box-shadow:0 2px 14px rgba(0,0,0,0.07); cursor:pointer; transition:transform 120ms var(--ease-out-strong), box-shadow 150ms; }
.mobile-gallery-item:active { transform:scale(0.98); box-shadow:0 1px 6px rgba(0,0,0,0.08); }
.mobile-gallery-preview { width:100%; height:180px; overflow:hidden; position:relative; background:#f8fafc; }
.mobile-gallery-label { padding:11px 16px; font-size:13px; font-weight:700; color:#1a1b20; display:flex; align-items:center; justify-content:space-between; }
.mobile-gallery-cta { padding:0 16px 20px; }
.mobile-gallery-cta-btn { width:100%; background:#0059a0; color:#fff; border:none; border-radius:999px; padding:17px 24px; font-size:16px; font-weight:700; cursor:pointer; font-family:var(--font-main); transition:transform 120ms var(--ease-out-strong), background 150ms; }
.mobile-gallery-cta-btn:active { transform:scale(0.97); background:#004a85; }
@keyframes mobileGalleryIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
.mobile-gallery-item { animation:mobileGalleryIn 300ms var(--ease-out-strong) both; }

/* Radio / Checkbox — custom pour pastilles/checkmark blancs sur fond bleu */
input[type="radio"], input[type="checkbox"] { flex-shrink: 0; cursor: pointer; appearance: none; -webkit-appearance: none; width: 17px; height: 17px; background: #fff; border: 2px solid #c6d8e6; transition: border-color 0.12s, background 0.12s; }
input[type="checkbox"] { border-radius: 4px; position: relative; }
input[type="checkbox"]:checked { background: #439fdb; border-color: #439fdb; }
input[type="checkbox"]:checked::after { content: ''; position: absolute; top: 1px; left: 4px; width: 5px; height: 9px; border: 2px solid #fff; border-top: none; border-left: none; transform: rotate(45deg); }
input[type="radio"] { border-radius: 50%; position: relative; }
input[type="radio"]:checked { background: #439fdb; border-color: #439fdb; }
input[type="radio"]:checked::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 6px; height: 6px; border-radius: 50%; background: #fff; }
input[type="radio"]:hover:not(:checked), input[type="checkbox"]:hover:not(:checked) { border-color: #439fdb; }
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
.thumb-frame { width:100%; height:270px; background:#fff; border-radius:14px; border:1.5px solid #dde6ed; overflow:hidden; margin-bottom:8px; transition:border-color 0.15s, box-shadow 0.18s, transform 0.18s var(--ease-out-strong); }
@media (hover: hover) and (pointer: fine) { .screen-thumb:hover .thumb-frame { border-color:#439fdb !important; box-shadow:0 4px 20px rgba(67,159,219,0.2); transform:translateY(-3px); } }

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
/* Flex column dans tous les cas pour que l'overlay immersive puisse prendre le flex: 1 restant */
.nav-view { flex: 1; display: flex; flex-direction: column; }
/* Mobile : hauteur fixe, overflow clip */
@media (max-width: 640px) {
  .nav-view { min-height: 0; overflow: hidden; }
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
.ann-switch-track[data-on="true"]  { background: #439fdb; }
.ann-switch-track[data-on="false"] { background: rgba(255,255,255,0.25); }
.ann-switch-track:active { transform: scale(0.93); transition: transform 0.1s ease-out, background 0.2s ease; }
.ann-switch-thumb {
  position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%;
  transition: transform 0.18s cubic-bezier(0.23,1,0.32,1), background 0.18s ease;
}
.ann-switch-track[data-on="true"]  .ann-switch-thumb { transform: translateX(16px); background: #fff; }
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
  gap:10px; position:sticky; top:52px; z-index:200; flex-shrink:0;
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
  max-width: 800px;
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
/* Overlay immersive : remplit la zone restante sous le nav-scenario-bar */
.immersive-overlay { flex: 1; min-height: 0; background: #0A0A0A; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 20px; overflow: hidden; }
.immersive-phone-shell { display: flex; flex-direction: column; width: 393px; height: 852px; background: #000; border-radius: 52px; overflow: hidden; box-shadow: 0 0 0 2px #333, 0 40px 100px rgba(0,0,0,0.8); position: relative; flex-shrink: 0; }
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
  .immersive-overlay { background: #FFF; align-items: stretch; justify-content: flex-start; flex: 1; }
  .immersive-phone-shell { width: 100%; flex: 1; height: auto; border-radius: 0; box-shadow: none; border: none; }
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

/* ── TRANSITIONS MACRO — welcome → libre, smartphone ↔ desktop ────────────── */
/* Welcome screen — sortie */
@keyframes welcomeExit { from { opacity:1; transform:scale(1); } to { opacity:0; transform:scale(0.96); } }
.welcome-exiting { animation: welcomeExit 240ms var(--ease-in-out-strong) both; pointer-events:none; }
/* App shell — entrée depuis l'accueil */
@keyframes appEnter { from { opacity:0; } to { opacity:1; } }
.app-entering { animation: appEnter 320ms var(--ease-out-strong); }
/* Overlay smartphone — entrée (phone shell + fond) */
@keyframes immersiveOverlayIn { from { opacity:0; } to { opacity:1; } }
@keyframes phoneShellIn { from { opacity:0; transform:scale(0.94) translateY(14px); } to { opacity:1; transform:scale(1) translateY(0); } }
.immersive-overlay-entering { animation: immersiveOverlayIn 220ms ease-out; }
.immersive-phone-entering { animation: phoneShellIn 280ms var(--ease-out-strong); }
/* Vue Desktop — entrée */
@keyframes desktopViewIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
.desktop-view-entering { animation: desktopViewIn 220ms var(--ease-out-strong); }

/* Modal slide-up */
@keyframes modalSlideUp { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
.modal-anim { animation: modalSlideUp 260ms var(--ease-out-strong); transform-origin: center; }

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
@keyframes checkBounce { 0% { transform:scale(0.88); } 60% { transform:scale(1.07); } 100% { transform:scale(1); } }

/* Loading pulse */
@keyframes loadingPulse { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
.loading-pulse { animation: loadingPulse 1.4s ease-in-out infinite; }

/* Success check */
@keyframes successIn { 0% { opacity:0; transform:scale(0.82); } 65% { opacity:1; transform:scale(1.07); } 100% { transform:scale(1); } }
.success-icon-anim { animation: successIn 320ms var(--ease-out-strong); display:inline-block; }

/* Popover aide — scale depuis le coin supérieur droit */
.help-popover { transform-origin: top right; animation: popIn 180ms var(--ease-out-strong); }

/* Choice block — active supprimé ici, consolidé dans la définition principale */

/* Prefers reduced motion */
@media (prefers-reduced-motion: reduce) {
  .screen-anim { animation: fadeIn 150ms ease-out; }
  .slide-down { animation: fadeIn 150ms ease-out; }
  .tooltip-anim { animation: fadeIn 100ms ease-out; }
  .slide-down-anim { animation: fadeIn 100ms ease-out; }
  .fade-in-anim { animation: none; }
  * { transition-duration: 0.01ms !important; }
}

/* ── WELCOME LANDING ─────────────────────────────────────────────────────── */
.welcome-root {
  height: 100dvh;
  background: linear-gradient(160deg, #001e45 0%, #0059a0 55%, #1082c0 100%);
  display: flex; flex-direction: column;
  overflow: hidden; font-family: var(--font-main);
  position: relative;
}
.welcome-glow-1 {
  position: absolute; width: 800px; height: 800px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,237,72,0.09) 0%, transparent 60%);
  bottom: -260px; left: -200px; pointer-events: none; z-index: 0;
}
.welcome-glow-2 {
  position: absolute; width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 65%);
  top: -60px; left: 35%; pointer-events: none; z-index: 0;
}
.welcome-header {
  position: relative; z-index: 20;
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px 48px; flex-shrink: 0;
}
.welcome-badge {
  background: rgba(255,255,255,0.11); border: 1px solid rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.72); padding: 6px 16px; border-radius: 99px;
  font-size: 12px; font-weight: 600; letter-spacing: 0.03em;
}
/* Scene: centré verticalement, ours absolu à droite */
.welcome-scene {
  flex: 1; min-height: 0; position: relative;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 0 20px 40px;
}
.welcome-ours {
  position: absolute; right: 0; bottom: 0;
  height: min(80vh, 620px); width: auto;
  object-fit: contain; object-position: bottom right;
  filter: drop-shadow(-8px 0 32px rgba(0,20,60,0.22));
  pointer-events: none; z-index: 3;
  will-change: transform;
}
/* Bloc centré : carte + QR */
.welcome-content {
  position: relative; z-index: 5;
  display: flex; flex-direction: column; gap: 14px;
  width: 420px; max-width: calc(100vw - 40px);
}
.welcome-card {
  background: #fff; border-radius: 24px;
  padding: 30px 30px 26px;
  box-shadow: 0 20px 64px rgba(0,25,65,0.26);
}
.welcome-card-date {
  font-size: 11px; font-weight: 700; letter-spacing: 0.10em;
  text-transform: uppercase; color: #8b9aa4; margin-bottom: 12px;
}
.welcome-card-title {
  font-size: 28px; font-weight: 800; color: #0059a0;
  line-height: 1.1; letter-spacing: -0.5px; margin-bottom: 14px;
}
.welcome-card-desc {
  font-size: 16px; color: #4a5568; line-height: 1.72; margin-bottom: 24px;
}
.welcome-card-actions { display: flex; flex-direction: column; gap: 10px; }
.welcome-pill-primary {
  background: #ffed48; color: #1a1b20; border: none;
  border-radius: 999px; padding: 17px 26px; cursor: pointer;
  display: flex; flex-direction: column; gap: 3px; text-align: left;
  font-family: var(--font-main);
  box-shadow: 0 4px 20px rgba(255,237,72,0.30);
  transition: transform 120ms var(--ease-out-strong), box-shadow 150ms ease-out;
}
@media (hover: hover) and (pointer: fine) {
  .welcome-pill-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,237,72,0.45); }
}
.welcome-pill-primary:active { transform: scale(0.98); }
.welcome-pill-primary .cta-title { font-size: 18px; font-weight: 700; }
.welcome-pill-primary .cta-sub   { font-size: 13px; font-weight: 400; opacity: 0.60; }
.welcome-pill-secondary {
  background: transparent; color: #0059a0;
  border: 1.5px solid #0059a0; border-radius: 999px;
  padding: 15px 26px; cursor: pointer;
  font-size: 17px; font-weight: 600; font-family: var(--font-main);
  text-align: center;
  transition: background 130ms, transform 120ms;
}
@media (hover: hover) and (pointer: fine) {
  .welcome-pill-secondary:hover { background: rgba(0,89,160,0.06); transform: translateY(-1px); }
}
.welcome-pill-secondary:active { transform: scale(0.98); }
.welcome-qr-block {
  display: flex; align-items: center; gap: 20px;
  background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.16);
  border-radius: 20px; padding: 18px 22px;
  backdrop-filter: blur(16px);
}
.welcome-qr-title { font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 5px; }
.welcome-qr-text  { font-size: 14px; color: rgba(255,255,255,0.58); line-height: 1.55; }
/* Entrance animations */
@keyframes wIn   { from { opacity: 0; } to { opacity: 1; } }
@keyframes wUp   { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes wDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes wOurs { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
.welcome-root     { animation: wIn   300ms ease-out both; }
.welcome-header   { animation: wDown 440ms var(--ease-out-strong) 60ms  both; }
.welcome-card     { animation: wUp   520ms var(--ease-out-strong) 130ms both; }
.welcome-qr-block { animation: wUp   480ms var(--ease-out-strong) 200ms both; }
.welcome-ours     { animation: wOurs 600ms var(--ease-out-strong) 80ms  both; }
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
  'WF1': 'Qualification', 'WF1-statut': 'Statut', 'WF1bis': 'Prérequis', 'WF1-sortie': 'Non éligible',
  'WF2': 'Coordonnées', 'WF2-sortie': 'Locataire',
  'WF3': 'Installation', 'WF4': 'Factures', 'WF4-sortie': 'Pas de factures',
  'WF5': 'Synthèse', 'WF5b': 'Confirmation', 'MODAL': 'Rappel (modale)',
};

const BADGE_TYPE = {
  'PAGE0': 'ok', 'WF0-step2': 'ok', 'WF0-step3': 'ok',
  'WF1': 'branch', 'WF1-statut': 'branch', 'WF1bis': 'ok', 'WF1-sortie': 'exit',
  'WF2': 'branch', 'WF2-sortie': 'exit',
  'WF3': 'ok', 'WF4': 'branch', 'WF4-sortie': 'exit',
  'WF5': 'ok', 'WF5b': 'ok', 'MODAL': 'exit',
};

const STEP_FOR_SCREEN = {
  'WF1': 1, 'WF1-statut': 1, 'WF1bis': 1, 'WF2': 2, 'WF3': 3, 'WF4': 4, 'WF5': 5, 'WF5b': 5,
};

const ANNOTATIONS = {
  'PAGE0': "Page d'offre butagaz.fr avec l'encart de souscription intégré. L'encart est le seul élément interactif du prototype à cette étape : les zones grisées représentent le contenu de la page hôte, non pertinent pour le test de ce parcours. Dans la vraie implémentation, l'encart est injectable (balise <section> indépendante) et peut être placé sur n'importe quelle page de butagaz.fr ou landing page SEA.",
  'WF0-step2': 'Flow de rappel hors tunnel. Collecte minimale. RGPD obligatoire car données commerciales.',
  'WF0-step3': 'Écran de confirmation. Rassure le prospect sur le délai et les horaires de rappel.',
  'WF1': "Étape 1 du tunnel. Le prospect a cliqué « Souscrire en ligne » depuis l'encart sur butagaz.fr. Blocs visuels cliquables. Seul le choix 1 continue dans le tunnel. Le bandeau info conditionnel apparaît directement sous le bloc sélectionné, pas en bas de page.",
  'WF1-statut': "Écran intermédiaire inséré après WF1 pour les prospects qui choisissent « Changer de fournisseur ». Deux blocs cliquables sans bouton Continuer : le clic déclenche la navigation. Propriétaire → WF1bis, Locataire → WF2-sortie.",
  'WF1bis': "Écran de préparation, pas de collecte. Les 3 factures sont toutes obligatoires (décision Pierre-Louis du Chazaud). Bloc jaune pour aider à localiser les factures.",
  'WF1-sortie': "Ton bienveillant. Titre reformulé en positif. Formulaire inline avec données pré-remplies évite une redirection.",
  'WF2': "Prénom avant Nom. Checkbox citerne = domicile cochée par défaut (85 % des cas). Préférence d'appel facultative. RGPD wording validé par Pierre-Louis du Chazaud.",
  'WF2-sortie': "Sortie locataire. Accessible depuis WF1-statut (nouveau) et WF2 (statut locataire). Ton orienté solution, zéro collecte. CTA rappel ouvre la modale existante. Retour site vers PAGE0.",
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
            <div style={{ fontSize:12, color:'#8b9aa4' }}>Lun-ven, 9h-18h</div>
            <div style={{ fontSize:12, color:'#8b9aa4', marginTop:2 }}>Rappel sous 24h ouvrées, Lun-ven 9h-18h</div>
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
            >{state === 'done' ? <Check size={14} strokeWidth={3} color="#fff" /> : n}</div>
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
  return (
    <div style={{ display:'flex', gap:10, background:'#ecf5fb', borderLeft:'3px solid #439fdb', borderRadius:12, padding:'12px 14px', fontSize:13, color:'#1a6fa3', marginBottom:16, lineHeight:1.6 }}>
      <Info size={15} color="#439fdb" strokeWidth={2} style={{ flexShrink:0, marginTop:1 }} />
      <div>{children}</div>
    </div>
  );
}
function OfferBlock({ children }) {
  return (
    <div style={{ display:'flex', gap:10, background:'rgba(74,199,124,0.08)', border:'1.5px solid #4ac77c', borderRadius:12, padding:'12px 14px', fontSize:13, color:'#1c7a46', marginBottom:16, lineHeight:1.6 }}>
      <CheckCircle size={15} color="#4ac77c" strokeWidth={2} style={{ flexShrink:0, marginTop:1 }} />
      <div>{children}</div>
    </div>
  );
}
function WarningBlock({ children }) {
  return (
    <div style={{ display:'flex', gap:10, background:'#fffbe6', border:'1px solid #ffc42b', borderRadius:12, padding:'12px 14px', fontSize:13, color:'#7a5800', marginBottom:16, lineHeight:1.6 }}>
      <AlertTriangle size={15} color="#ffc42b" strokeWidth={2} style={{ flexShrink:0, marginTop:1 }} />
      <div>{children}</div>
    </div>
  );
}
function GrayBlock({ children }) {
  return (
    <div style={{ display:'flex', gap:10, background:'#f7f9fa', border:'0.5px solid #e2e8ed', borderRadius:12, padding:'12px 14px', fontSize:13, color:'#666f7c', marginBottom:16, lineHeight:1.6 }}>
      <Info size={15} color="#8b9aa4" strokeWidth={2} style={{ flexShrink:0, marginTop:1 }} />
      <div>{children}</div>
    </div>
  );
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
      style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:18, height:18, cursor:'pointer', marginLeft:5, flexShrink:0, verticalAlign:'middle', color:'#aab4bc' }}
    >
      <Info size={15} strokeWidth={2} />
    </span>
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
    <div style={{ display:'flex', flexDirection:'column' }}>
      {options.map(opt => (
        <label key={opt.value} className={`radio-card${value===opt.value?' selected':''}`}>
          <input type="radio" value={opt.value} checked={value===opt.value} onChange={() => onChange(opt.value)} />
          <span className="radio-dot" />
          <span>{opt.label}</span>
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
  const [tipOpen, setTipOpen] = useState(false);
  const tipRef = useRef(null);

  useEffect(() => {
    if (!tipOpen) return;
    function handleOutside(e) {
      if (tipRef.current && !tipRef.current.contains(e.target)) setTipOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [tipOpen]);

  return (
    <div className="upload-item-anim" style={{ marginBottom:14, animationDelay: `${index * 80}ms` }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6, position:'relative' }} ref={tipRef}>
        <div style={{ fontSize:12, fontWeight:600, color:'#999' }}>{label}</div>
        <button
          onClick={() => setTipOpen(v => !v)}
          style={{
            width:18, height:18, borderRadius:'50%',
            background:'#ecf5fb', border:'1px solid #1a6fa3',
            color:'#1a6fa3', fontSize:11, fontWeight:700,
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            flexShrink:0, padding:0, lineHeight:1,
          }}
        >ⓘ</button>
        {tipOpen && (
          <div style={{
            position:'absolute', top:'calc(100% + 6px)', left:0, zIndex:50,
            background:'white', border:'1px solid #e2e8ed', borderRadius:12,
            padding:'12px 14px', boxShadow:'0 4px 20px rgba(0,0,0,0.10)',
            fontSize:13, color:'#1a1b20', maxWidth:260, lineHeight:1.55,
          }}>
            Votre facture doit dater de moins de 24 mois. Les formats acceptés sont PDF, JPG et PNG. La photo doit être nette et lisible.
          </div>
        )}
      </div>
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
          <div style={{ fontSize:14, fontWeight:600, color:'#1c7a46', marginBottom:2, display:'flex', alignItems:'center', gap:6 }}><Check size={14} color="#1c7a46" strokeWidth={2.5} style={{flexShrink:0}} /> {file?.name}</div>
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
          <InfoBlock>Demande envoyée. Un conseiller vous contactera sous 24h ouvrées.</InfoBlock>
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

      {/* Header branded */}
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

      {/* ─── ENCART SOUSCRIPTION ─── */}
      <div id="encart-souscription" style={{ margin: '0 12px 12px', background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(67,159,219,0.10)' }}>
        <div style={{ padding: '20px 16px' }}>
          <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 16, lineHeight: 1.3, color: '#1a1b20' }}>
            Vous souhaitez changer de fournisseur ?
          </div>

          {offerMode && (
            <div style={{ background: 'linear-gradient(135deg,#ecf5fb,#dceefa)', border: '1.5px solid #439fdb', borderRadius: 14, padding: '12px 14px', marginBottom: 14, fontSize: 13, color: '#0079c0', lineHeight: 1.5 }}>
              <strong>Jusqu'à 200 € d'avoir gaz offerts</strong> sur votre première commande*
            </div>
          )}

          <button className="btn-primary" style={{ marginBottom: 10 }} onClick={() => navigate('WF1')}>
            <div>Souscrire en ligne</div>
            <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>Devis personnalisé sous 48h ouvrées</div>
          </button>
          <a href="tel:0970818065" className="btn-secondary" style={{ display:'block', marginBottom:10, textDecoration:'none', textAlign:'center', padding:'12px 24px', fontSize:15 }}>
            Appeler un conseiller<br/>
            <span style={{ fontSize:12, fontWeight:400, opacity:0.8 }}>09 70 81 80 65, Lun-ven 9h-18h</span>
          </a>
          <button className="btn-secondary" onClick={() => navigate('WF0-step2')}>
            <div style={{ fontWeight: 500 }}>Être rappelé</div>
            <div style={{ fontSize: 12, color: '#8b9aa4', marginTop: 2 }}>Un conseiller vous contacte sous 24h ouvrées</div>
          </button>

          {offerMode && (
            <div style={{ fontSize: 11, color: '#999', lineHeight: 1.5, marginTop: 12 }}>
              *Offre réservée aux clients souscrivant à une citerne apparente. Le montant de l'avoir sera déterminé en fonction de la consommation annuelle estimée.
            </div>
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
    </div>
  );
}

// ─── SCREEN: WF0-step3 — CONFIRMATION RAPPEL ─────────────────────────────────
function ScreenWF0Step3({ navigate, returnToSite }) {
  return (
    <div className="screen-anim">
      <TunnelHeader onHome={returnToSite} />
      <div style={{ padding:'32px 16px 80px 16px', textAlign:'center' }}>
        <div style={{ width:60, height:60, borderRadius:'50%', background:'rgba(74,199,124,0.08)', border:'2px solid #4ac77c', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
          <CheckCircle size={28} color="#4ac77c" strokeWidth={2} />
        </div>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:16 }}>Votre demande est bien reçue</div>
        <InfoBlock>
          Un conseiller vous contactera sous 24h ouvrées. Rappel entre 9h et 18h, du lundi au vendredi.
        </InfoBlock>
        <button className="btn-secondary" onClick={returnToSite}>Retour au site butagaz.fr</button>
      </div>
    </div>
  );
}

// ─── BLOC DE CHOIX WF1 ────────────────────────────────────────────────────────
function WF1Block({ active, icon, label, onClick }) {
  return (
    <div
      className={`choice-block${active ? ' selected' : ''}`}
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 14, fontWeight: 600, fontSize: 15 }}
    >
      {icon}
      <span>{label}</span>
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
      setTimeout(() => navigate('WF1-statut'), 450);
    }
  }

  return (
    <div className="screen-anim">
      <TunnelHeader onHome={onHome} />
      <ProgressBar step={1} />
      <div style={{ padding:'8px 16px 80px 16px' }}>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>Quel est votre projet aujourd'hui ?</div>
        <div style={{ fontSize:14, color:'#666', marginBottom:20 }}>Choisissez la situation qui vous correspond.</div>

        <WF1Block
          active={choice === 'changer'}
          icon={<Repeat2 size={22} color="#1a6fa3" />}
          label="Je souhaite changer de fournisseur de gaz en citerne"
          onClick={() => handleChoice('changer')}
        />

        {choice === 'changer' && (
          <div className="slide-down" style={{ display:'flex', alignItems:'flex-start', gap:8, background:'#fffbe6', border:'1px solid #ffc42b', borderRadius:12, padding:12, fontSize:13, color:'#7a5800', marginBottom:10, lineHeight:1.5 }}>
            <Check size={14} color="#7a5800" strokeWidth={2.5} style={{flexShrink:0, marginTop:1}} />
            <span>Ce parcours est réservé aux propriétaires qui souhaitent changer de fournisseur de gaz en citerne.</span>
          </div>
        )}

        <WF1Block
          active={choice === 'succession'}
          icon={<Home size={22} color="#1a6fa3" />}
          label="Je deviens propriétaire d'une maison équipée d'une citerne de gaz"
          onClick={() => handleChoice('succession')}
        />

        <WF1Block
          active={choice === 'energie'}
          icon={<Flame size={22} color="#1a6fa3" />}
          label="J'ai une autre énergie (ex : fioul) et je souhaite passer au gaz en citerne"
          onClick={() => handleChoice('energie')}
        />

      </div>
    </div>
  );
}

// ─── SCREEN: WF1-STATUT — PROPRIÉTAIRE OU LOCATAIRE ──────────────────────────
function ScreenWF1Statut({ navigate, showRecall, onHome }) {
  return (
    <div className="screen-anim">
      <TunnelHeader onHome={onHome} />
      <ProgressBar step={1} />
      <div style={{ padding:'8px 16px 80px 16px' }}>
        <BackLink onClick={() => navigate('WF1')} />
        <div style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>Quel est votre statut ?</div>
        <div style={{ fontSize:15, color:'#666f7c', marginBottom:20 }}>Choisissez la situation qui vous correspond</div>

        <div className="choice-block" onClick={() => navigate('WF1bis')} style={{ fontWeight:600 }}>
          Je suis propriétaire
        </div>
        <div className="choice-block" onClick={() => navigate('WF2-sortie')} style={{ fontWeight:600 }}>
          Je suis locataire
        </div>
      </div>
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
        <BackLink onClick={() => navigate('WF1-statut')} />
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
    </div>
  );
}

// ─── SCREEN: WF1-SORTIE — NON ÉLIGIBLE ───────────────────────────────────────
function ScreenWF1Sortie({ navigate, showRecall, returnToSite, onHome }) {
  return (
    <div className="screen-anim">
      <TunnelHeader onHome={returnToSite || onHome} />
      <div style={{ padding:'32px 16px 80px', textAlign:'center' }}>
        <div style={{ marginBottom:16, display:'flex', justifyContent:'center' }}><MessageCircle size={44} color="#439fdb" strokeWidth={1.5} /></div>
        <div style={{ fontSize:22, fontWeight:700, color:'#1a1b20', marginBottom:12, lineHeight:1.3 }}>Parlons de votre projet</div>
        <div style={{ fontSize:14, color:'#666f7c', lineHeight:1.7, marginBottom:28, maxWidth:320, margin:'0 auto 28px' }}>
          Pour votre situation, nos conseillers vous accompagnent directement. Aucun justificatif de fournisseur actuel n'est necessaire.
        </div>
        <button className="btn-primary" style={{ marginBottom:12 }} onClick={() => showRecall && showRecall()}>Être rappelé →</button>
        <button className="btn-secondary" onClick={() => navigate('PAGE0')}>← Retour au site butagaz.fr</button>
        <div style={{ marginTop:20 }}>
          <a href="tel:0970818065" style={{ fontSize:13, color:'#439fdb', fontWeight:600, textDecoration:'none' }}>09 70 81 80 65, Lun-ven 9h-18h</a>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: WF2 — COORDONNÉES ────────────────────────────────────────────────
function ScreenWF2({ formData, setFormData, navigate, showRecall, returnTo, setReturnTo, stepHistory, onHome }) {
  const [f, setF] = useState({ ...formData, statut: 'proprietaire' });
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
        <FormField id="telephone" label="Téléphone *" tooltipText="Un conseiller vous appellera pour vous transmettre votre proposition de contrat. Vous serez contacté depuis le 09 70 81 80 65." openTip={openTip} onToggleTip={toggleTip} error={errors.telephone}>
          <input className={`field-input${errors.telephone?' err':''}`} value={f.telephone} onChange={e => setF({...f,telephone:e.target.value})} onBlur={() => blur('telephone')} placeholder="06 ou 07..." type="tel" inputMode="tel" />
        </FormField>

        {/* Email */}
        <FormField id="email" label="Email *" tooltipText="Votre proposition de contrat sera envoyée à cette adresse. Aucun spam, promis." openTip={openTip} onToggleTip={toggleTip} error={errors.email}>
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
    </div>
  );
}

// ─── SCREEN: WF2-SORTIE — LOCATAIRE ───────────────────────────────────────────
function ScreenWF2Sortie({ navigate, showRecall, returnToSite }) {
  return (
    <div className="screen-anim">
      <TunnelHeader onHome={returnToSite} />
      <div style={{ padding:'32px 16px 80px 16px' }}>
        <div style={{ fontSize:22, fontWeight:700, marginBottom:16 }}>Parlons de votre projet</div>

        <div style={{ fontSize:15, color:'#1a1b20', marginBottom:28, lineHeight:1.6 }}>
          Ce parcours en ligne est réservé aux propriétaires.<br />
          Votre propriétaire peut contacter Butagaz pour étudier les options disponibles.
        </div>

        <button className="btn-primary" style={{ marginBottom:12 }} onClick={showRecall}>
          Être rappelé par un conseiller
        </button>
        <button className="btn-secondary" onClick={returnToSite}>
          ← Retour au site butagaz.fr
        </button>
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

        <FormField id="conserver" label="Souhaitez-vous garder le même type de citerne ?" tooltipText="Votre réponse est indicative, pas définitive. Un technicien vérifie la faisabilité avant l'installation. Si vous souhaitez changer de type, des frais éventuels vous seront communiqués dans votre contrat, avant toute décision." openTip={openTip} onToggleTip={toggleTip} error={errors.conserver}>
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
function WF4ModeB_Prepare({ factureNum, onReady, onFileClick, onNoFacture, onBack }) {
  return (
    <div style={{ minHeight:'100%' }}>
      <WF4ModeBHeader factureNum={factureNum} handleBack={onBack} />
      <div style={{ padding:'20px 16px 80px 16px' }}>
        <div style={{ fontSize:20, fontWeight:700, marginBottom:16 }}>Préparez votre facture</div>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}><IllustrationFactureMain /></div>
        <div style={{ background:'#fffbe6', border:'1px solid #ffc42b', borderRadius:12, padding:12, marginBottom:24, fontSize:13, color:'#7a5800', lineHeight:1.6 }}>
          ⓘ Conseils : photo bien éclairée, pas de reflet, facture entièrement visible.
        </div>
        <button className="btn-primary" style={{ marginBottom:12 }} onClick={onReady}>Prendre une photo</button>
        <button className="btn-secondary" style={{ marginBottom:24 }} onClick={onFileClick}>Choisir un fichier sur mon appareil</button>
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
        <div style={{ background:'#fffbe6', border:'1px solid #ffc42b', borderRadius:12, padding:12, marginBottom:24, fontSize:13, color:'#7a5800', lineHeight:1.6 }}>
          ⓘ Conseils : pas de flash, évitez les ombres, tenez le téléphone bien droit.
        </div>
        <button className="btn-primary" style={{ marginBottom:12 }} onClick={onCapture}>Prendre la photo</button>
        <button className="btn-secondary" style={{ marginBottom:24 }} onClick={onFileClick}>Choisir un fichier sur mon appareil</button>
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
          <span style={{ color:'rgba(255,255,255,0.85)', display:'flex', alignItems:'center' }}><Zap size={16} /></span>
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
          <span className="success-icon-anim"><CheckCircle size={26} color="#4ac77c" strokeWidth={2} /></span>
          <div style={{ fontSize:22, fontWeight:700 }}>Bien reçu !</div>
        </div>
        <div style={{ fontSize:14, color:'#666', marginBottom:20 }}>
          {uploadedCount}/3 facture{uploadedCount > 1 ? 's' : ''} ajoutée{uploadedCount > 1 ? 's' : ''}
        </div>
        <div style={{ background:'rgba(74,199,124,0.08)', border:'1px solid #4ac77c', borderRadius:8, padding:14, marginBottom:24 }}>
          <div style={{ fontSize:14, fontWeight:600, color:'#1c7a46', marginBottom:6, display:'flex', alignItems:'center', gap:6 }}><Check size={14} color="#1c7a46" strokeWidth={2.5} style={{flexShrink:0}} /> {file?.name}</div>
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
            style={{ display:'block', width:'100%', padding:14, background:'#ffed48', color:'#1a1b20', border:'none', borderRadius:999, fontSize:15, fontWeight:700, cursor:'pointer', marginBottom:12 }}
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
        <div style={{ fontSize:17, fontWeight:700, textAlign:'center', color:'#1a1b20', marginBottom:8 }}>
          Impossible de lire ce document
        </div>
        <div style={{ fontSize:14, textAlign:'center', color:'#666f7c', lineHeight:1.55, marginBottom:24 }}>
          Reprenez la photo dans un endroit bien éclairé, sans reflets ni angles. Ou importez directement un PDF depuis votre appareil.
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

// ─── SCREEN: WF4 — FACTURES (MODE B) ────────────────────────────────────────
function ScreenWF4({ formData, setFormData, navigate, showRecall, returnTo, setReturnTo, stepHistory, onHome, simulateError, setSimulateError }) {
  const initFacture = (idx) => formData.factures?.[idx] || null;
  const [uploadState, setUploadState] = useState({
    currentFacture: 1,
    factures: [initFacture(0), initFacture(1), initFacture(2)],
    subscreen: null,        // null | 'PREPARE'|'FRAME'|'CAMERA'|'LOADING'|'SUCCESS'|'ERROR'
    pendingFile: null,
    progress: 0,
  });
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
    setFormData({ ...formData, factures: uploadState.factures });
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
      onReady={() => setSubscreen('CAMERA')}
      onFileClick={triggerFilePicker}
      onNoFacture={() => navigate('WF4-sortie')}
      onBack={() => setSubscreen(null)}
    /></>;
  }
  if (subscreen === 'CAMERA') {
    return <>{hiddenInputs}<WF4ModeB_Camera
      factureNum={currentFacture}
      onCapture={simulateCapture}
      onBack={() => setSubscreen('PREPARE')}
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
      onRetry={() => setSubscreen('CAMERA')}
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
            <InfoBlock>Votre demande est bien enregistrée. Un conseiller vous contactera sous 24h ouvrées.</InfoBlock>
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
function ScreenWF5({ formData, setFormData, navigate, showRecall, setReturnTo, stepHistory, onHome }) {
  const [bioChoice, setBioChoice] = useState(formData.biopropane || 'non');

  function handleModify(target) {
    setReturnTo('WF5');
    navigate(target);
  }

  function handleStepClick(n) {
    const screens = ['WF1','WF2','WF3','WF4','WF5'];
    if (stepHistory.includes(screens[n-1])) navigate(screens[n-1]);
  }

  function handleValidate() {
    setFormData({ ...formData, biopropane: bioChoice });
    navigate('WF5b');
  }

  const rawFactures = formData.factures || [null, null, null];
  const factureCount = rawFactures.filter(Boolean).length;
  const facturesForDisplay = rawFactures.map((f, i) => f || FAKE_FACTURE_NAMES[i]);
  const bioPropaneLabel = bioChoice === '20' ? '20 %' : bioChoice === '100' ? '100 %' : 'Non';

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
            'Propriétaire',
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
        </div>

        {/* Section 4 : Option biopropane */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:700, textTransform:'uppercase', color:'#1a6fa3', letterSpacing:'0.04em', marginBottom:10 }}>Option biopropane</div>
          <div style={{ display:'flex', gap:8, marginBottom: (bioChoice !== 'non') ? 10 : 0 }}>
            {[
              { value:'non', label:'Non' },
              { value:'20', label:'Oui, 20 %' },
              { value:'100', label:'Oui, 100 %' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setBioChoice(opt.value)}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  border: `1.5px solid ${bioChoice === opt.value ? '#1a6fa3' : '#dde6ed'}`,
                  borderRadius: 10,
                  background: bioChoice === opt.value ? '#ecf5fb' : '#fff',
                  color: bioChoice === opt.value ? '#1a6fa3' : '#1a1b20',
                  fontWeight: bioChoice === opt.value ? 700 : 500,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'border-color 150ms, background 150ms',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {bioChoice !== 'non' && (
            <div className="slide-down" style={{ background:'rgba(74,199,124,0.08)', border:'1px solid #4ac77c', borderRadius:10, padding:12, fontSize:13, color:'#1c7a46', lineHeight:1.6 }}>
              Cette option est payante. Le biopropane est une version du propane issue de ressources renouvelables. Son coût est supérieur au propane standard. Le surcoût sera précisé dans votre proposition de contrat.
            </div>
          )}
        </div>

        <InfoBlock>
          En validant, vous recevrez une proposition de contrat personnalisée sous 48 h ouvrées. Aucun engagement à ce stade.
        </InfoBlock>

        <button className="btn-primary" onClick={handleValidate}>
          Valider et envoyer ma demande
        </button>

        <div style={{ textAlign:'center', marginTop:16, fontSize:13, color:'#666' }}>
          Une question avant d'envoyer ? <strong>09 70 81 80 65</strong>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: WF5b — CONFIRMATION ─────────────────────────────────────────────
function ScreenWF5b({ formData, navigate, returnToSite, onHome }) {
  const year = new Date().getFullYear();
  const refNumber = useRef('BSWT-' + year + '-' + String(Math.floor(1000 + Math.random() * 9000)));
  // Condition réelle : formData.citerneType === 'apparente' (saisie en WF3)
  const isApparente = formData.citerneType === 'apparente';

  return (
    <div className="screen-anim">
      <TunnelHeader onHome={returnToSite || onHome} />
      <div style={{ padding:'32px 16px 48px 16px' }}>
        <div style={{ fontSize:28, fontWeight:700, color:'#1a1b20', marginBottom:6 }}>
          Votre demande est envoyée
        </div>
        <div style={{ fontSize:13, color:'#8b9aa4', marginBottom:24 }}>
          Référence : {refNumber.current}
        </div>

        {/* Bloc réassurance */}
        <div style={{
          background:'#ecf5fb', borderLeft:'3px solid #1a6fa3',
          borderRadius:12, padding:16,
          fontSize:13, color:'#1a6fa3', lineHeight:1.65, marginBottom:16,
        }}>
          Nous vous enverrons une proposition de contrat personnalisée sous 48h ouvrées. Vous êtes libre de l'accepter ou non : elle ne vous engage à rien tant que vous ne l'avez pas signée.
        </div>

        {/* Bloc offre bienvenue — conditionnel citerne apparente */}
        {isApparente && (
          <div style={{
            background:'rgba(74,199,124,0.08)', border:'1.5px solid #4ac77c',
            borderRadius:12, padding:16, marginBottom:16,
          }}>
            <div style={{ fontWeight:700, color:'#1c7a46', marginBottom:6 }}>Offre de bienvenue</div>
            <div style={{ fontSize:14, color:'#1a1b20', lineHeight:1.6 }}>
              200 € d'avoir gaz offerts sur votre première commande. Détails dans votre proposition de contrat.
            </div>
          </div>
        )}

        <button className="btn-secondary" onClick={returnToSite}>
          ← Retour au site butagaz.fr
        </button>
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
    case 'WF1-statut':  return <ScreenWF1Statut navigate={navigate} showRecall={showRecall} onHome={onHome} />;
    case 'WF1bis':      return <ScreenWF1bis navigate={navigate} showRecall={showRecall} onHome={onHome} />;
    case 'WF1-sortie':  return <ScreenWF1Sortie navigate={navigate} showRecall={showRecall} returnToSite={returnToSite} onHome={onHome} />;
    case 'WF2':         return <ScreenWF2 formData={formData} setFormData={setFormData} navigate={navigate} showRecall={showRecall} returnTo={returnTo} setReturnTo={setReturnTo} stepHistory={stepHistory} onHome={onHome} />;
    case 'WF2-sortie':  return <ScreenWF2Sortie navigate={navigate} showRecall={showRecall} returnToSite={returnToSite} />;
    case 'WF3':         return <ScreenWF3 formData={formData} setFormData={setFormData} navigate={navigate} showRecall={showRecall} returnTo={returnTo} setReturnTo={setReturnTo} stepHistory={stepHistory} onHome={onHome} />;
    case 'WF4':         return <ScreenWF4 formData={formData} setFormData={setFormData} navigate={navigate} showRecall={showRecall} returnTo={returnTo} setReturnTo={setReturnTo} stepHistory={stepHistory} onHome={onHome} simulateError={simulateError} setSimulateError={setSimulateError} />;
    case 'WF4-sortie':  return <ScreenWF4Sortie formData={formData} navigate={navigate} returnToSite={returnToSite} onHome={onHome} />;
    case 'WF5':         return <ScreenWF5 formData={formData} setFormData={setFormData} navigate={navigate} showRecall={showRecall} setReturnTo={setReturnTo} stepHistory={stepHistory} onHome={onHome} />;
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
    'WF1': ['Qualification', f._wf1Choice === 'changer' ? '✓ Changer fournisseur' : '· Changer fournisseur', '· Maison avec citerne', '· Changer d\'énergie'],
    'WF1-statut': ['Quel est votre statut ?', '[ Je suis propriétaire ]', '[ Je suis locataire ]'],
    'WF1bis': ['Prérequis', '[ Info ] 3 factures requises', '[ Aide ] Où trouver ?', '[ C\'est parti ]'],
    'WF1-sortie': ['⚠ Non éligible', '[ Appeler ]', '[ Formulaire rappel ]', '[ Retour site ]'],
    'WF2': ['Coordonnées', f.prenom ? `_ ${f.prenom} ${f.nom}` : '_ Prénom / Nom', f.adresse ? `_ ${f.adresse.substring(0,20)}…` : '_ Adresse', f.telephone||'_ Téléphone', f.email||'_ Email'],
    'WF2-sortie': ['Parlons de votre projet', 'Réservé aux propriétaires', '[ Être rappelé ]', '← Retour butagaz.fr'],
    'WF3': ['Installation', f.citerneType === 'apparente' ? '✓ Apparente' : f.citerneType === 'enfouie' ? '✓ Enfouie' : '○ Apparente / ○ Enfouie', f.conserverType ? `✓ Conserver : ${f.conserverType}` : '○ Conserver : oui / non'],
    'WF4': ['Factures', ...(f.factures||[null,null,null]).map((ff,i) => ff ? `✓ Facture ${i+1}` : `□ Facture ${i+1}`)],
    'WF4-sortie': ['⚠ Pas de factures', '[ Info aide ]', '[ Formulaire rappel ]', '← Reprendre'],
    'WF5': ['Synthèse', '· Coordonnées [Modifier]', '· Installation [Modifier]', '· Factures [Modifier]', '○ Biopropane', '[ Valider et envoyer ]'],
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
// ─── GALERIE — ITEMS ─────────────────────────────────────────────────────────
const noop = () => {};
const GALLERY_ITEMS = [
  { key:'page0',       screen:'PAGE0',      label:'PAGE0 — Site Butagaz',                   form:{ ...EMPTY_FORM } },
  { key:'wf1',         screen:'WF1',        label:'WF1 — Qualification',                    form:{ ...EMPTY_FORM } },
  { key:'wf1-statut',  screen:'WF1-statut', label:'WF1 — Propriétaire / Locataire',         form:{ ...EMPTY_FORM, _wf1Choice:'changer' } },
  { key:'wf1bis',      screen:'WF1bis',     label:'WF1bis — Prérequis',                     form:{ ...EMPTY_FORM } },
  { key:'wf2',         screen:'WF2',        label:'WF2 — Coordonnées',                      form:{ ...EMPTY_FORM } },
  { key:'wf3',         screen:'WF3',        label:'WF3 — Installation',                     form:{ ...SCENARIOS.A.form } },
  { key:'wf4',         screen:'WF4',        label:'WF4 — Factures',                         form:{ ...SCENARIOS.A.form, factures:[null,null,null] } },
  {
    key:'wf4-a',       screen:'WF4',        label:'WF4 — Étape A (cadrage)',
    form:{ ...SCENARIOS.A.form },
    renderFn: () => <WF4ModeB_Prepare factureNum={1} onReady={noop} onFileClick={noop} onNoFacture={noop} onBack={noop} />,
  },
  {
    key:'wf4-c1',      screen:'WF4',        label:'WF4 — C1 (facture reçue)',
    form:{ ...SCENARIOS.A.form },
    renderFn: () => <WF4ModeB_Success factureNum={1} file={{ name:'facture_1.pdf', size:'142 Ko' }} factures={[{ name:'facture_1.pdf', size:'142 Ko' }, null, null]} onAddNext={noop} onReturn={noop} onFinish={noop} onContinue={noop} onReplace={noop} onDeleteFile={noop} />,
  },
  {
    key:'wf4-c2',      screen:'WF4',        label:'WF4 — C2 (photo illisible)',
    form:{ ...SCENARIOS.A.form },
    renderFn: () => <WF4ModeB_Error factureNum={1} onRetry={noop} onFileClick={noop} onFinish={noop} />,
  },
  { key:'wf5',         screen:'WF5',        label:'WF5 — Synthèse',                         form:{ ...SCENARIOS.A.form } },
  { key:'wf5b-offre',  screen:'WF5b',       label:'WF5b — Confirmation (avec offre)',        form:{ ...SCENARIOS.A.form, citerneType:'apparente' } },
  { key:'wf5b-sans',   screen:'WF5b',       label:'WF5b — Confirmation (sans offre)',        form:{ ...SCENARIOS.A.form, citerneType:'enfouie' } },
  { key:'sortie1',     screen:'WF1-sortie', label:'Sortie 1 — Non éligible',                form:{ ...EMPTY_FORM } },
  { key:'sortie2',     screen:'WF2-sortie', label:'Sortie 2 — Locataire',                   form:{ ...EMPTY_FORM } },
  { key:'sortie3',     screen:'WF4-sortie', label:'Sortie 3 — Pas de factures',             form:{ ...SCENARIOS.A.form } },
];

// ─── GALERIE — FRAME ─────────────────────────────────────────────────────────
function GalleryFrame({ item, onClick }) {
  const content = item.renderFn ? item.renderFn() : (
    <ScreenRouter
      screen={item.screen}
      formData={item.form}
      setFormData={noop}
      navigate={noop}
      showRecall={noop}
      returnTo={null}
      setReturnTo={noop}
      stepHistory={[item.screen]}
      offerMode={false}
      returnToSite={noop}
      onHome={noop}
      simulateError={false}
      setSimulateError={noop}
    />
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
      <div style={{ position:'relative', width:375, cursor:'pointer' }} onClick={onClick}>
        {/* Frame mobile */}
        <div style={{
          width:375, height:700, borderRadius:40,
          boxShadow:'0 8px 40px rgba(0,0,0,0.14)',
          overflow:'hidden', background:'white',
          pointerEvents:'none', userSelect:'none',
        }}>
          {content}
        </div>
        {/* Overlay cliquable */}
        <div style={{ position:'absolute', inset:0, borderRadius:40, zIndex:10 }} />
      </div>
      <div style={{ fontSize:12, fontWeight:600, color:'#8b9aa4', textAlign:'center', marginTop:12 }}>
        {item.label}
      </div>
    </div>
  );
}

// ─── GALERIE — VUE COMPLÈTE ───────────────────────────────────────────────────
function GalleryView({ onBack, onNavigateTo }) {
  return (
    <div style={{ minHeight:'100dvh', background:'#f0f4f8' }}>
      {/* Header fixe — only shown when used standalone (from welcome screen) */}
      {onBack && (
        <div style={{ position:'sticky', top:0, zIndex:100, background:'rgba(240,244,248,0.92)', backdropFilter:'blur(8px)', padding:'14px 40px', borderBottom:'1px solid #dde6ed' }}>
          <button onClick={onBack} style={{ background:'none', border:'none', color:'#1a6fa3', fontSize:14, fontWeight:600, cursor:'pointer', padding:0 }}>
            ← Retour à l'accueil
          </button>
        </div>
      )}
      {/* Grille */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fill, 375px)',
        gap:32,
        justifyContent:'center',
        padding:'40px',
      }}>
        {GALLERY_ITEMS.map(item => (
          <GalleryFrame
            key={item.key}
            item={item}
            onClick={() => onNavigateTo(item.screen, item.form)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN WELCOME ───────────────────────────────────────────────────────────
const PROTOTYPE_URL = window.location.origin;

function ScreenWelcome({ onStart, onNavigateTo, onShowGallery }) {
  const [showGallery, setShowGallery] = useState(false);
  const oursRef = useRef(null);

  const dateStr = new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });

  useEffect(() => {
    const img = oursRef.current;
    if (!img) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Spring state
    const sp = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, s: 1, ts: 1, rafId: null };
    // Ressort plus vif — Apple TV card feel
    const STIFFNESS = 0.09;
    const DAMPING   = 0.72;

    function tick() {
      const dx = sp.tx - sp.x;
      const dy = sp.ty - sp.y;
      sp.vx = sp.vx * DAMPING + dx * STIFFNESS;
      sp.vy = sp.vy * DAMPING + dy * STIFFNESS;
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.s += (sp.ts - sp.s) * 0.09;

      // Mouvement latéral léger + élévation — sans tilt 3D
      const tx = sp.x * 0.028;
      const ty = sp.y * 0.018;
      img.style.transform = `translate(${tx}px,${ty}px) scale(${sp.s.toFixed(4)})`;

      const settled = Math.abs(sp.vx) < 0.01 && Math.abs(sp.vy) < 0.01
                   && Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05
                   && Math.abs(sp.s - sp.ts) < 0.0005;
      if (!settled) {
        sp.rafId = requestAnimationFrame(tick);
      } else {
        if (sp.tx === 0 && sp.ty === 0) img.style.transform = '';
        sp.rafId = null;
      }
    }

    function startTick() {
      if (!sp.rafId) sp.rafId = requestAnimationFrame(tick);
    }

    function onMove(e) {
      const r = img.getBoundingClientRect();
      sp.tx = (e.clientX - r.left  - r.width  / 2) * 0.5;
      sp.ty = (e.clientY - r.top   - r.height / 2) * 0.5;
      startTick();
    }
    function onEnter() {
      sp.ts = 1.06;
      img.style.filter = 'drop-shadow(-16px 8px 56px rgba(0,20,60,0.42))';
      startTick();
    }
    function onLeave() {
      sp.tx = 0; sp.ty = 0; sp.ts = 1;
      img.style.filter = 'drop-shadow(-8px 0 32px rgba(0,20,60,0.22))';
      startTick();
    }

    // Enable after entrance animation (680ms = 600ms anim + 80ms delay)
    const t = setTimeout(() => {
      // CORRECTIF : l'animation CSS fill-mode:both garde la priorité sur les styles inline.
      // On supprime l'animation pour que img.style.transform prenne effet.
      img.style.animation = 'none';
      img.style.pointerEvents = 'auto';
      img.addEventListener('mousemove',  onMove);
      img.addEventListener('mouseenter', onEnter);
      img.addEventListener('mouseleave', onLeave);
    }, 750);

    return () => {
      clearTimeout(t);
      img.style.animation = '';
      img.style.pointerEvents = '';
      img.style.filter = '';
      img.removeEventListener('mousemove',  onMove);
      img.removeEventListener('mouseenter', onEnter);
      img.removeEventListener('mouseleave', onLeave);
      if (sp.rafId) cancelAnimationFrame(sp.rafId);
    };
  }, []);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(PROTOTYPE_URL)}&color=1a6fa3&bgcolor=f0f4f8&margin=8`;

  if (showGallery) {
    return <GalleryView onBack={() => setShowGallery(false)} onNavigateTo={onNavigateTo} />;
  }

  return (
    <div className="welcome-root">
      <div className="welcome-glow-1" />
      <div className="welcome-glow-2" />

      {/* Header */}
      <div className="welcome-header">
        <div style={{ background:'#fff', borderRadius:14, padding:'10px 18px', boxShadow:'0 2px 16px rgba(0,20,60,0.12)', display:'inline-flex', alignItems:'center' }}>
          <img
            src="/logo-butagaz.svg" alt="Butagaz"
            style={{ height:36, width:'auto', display:'block' }}
            onError={e => { e.target.onerror = null; e.target.src='/logo-butagaz.png'; }}
          />
        </div>
        <div className="welcome-badge">Revue interne · v2.1</div>
      </div>

      {/* Scene: card + QR centrés, ours absolu à droite */}
      <div className="welcome-scene">

        {/* Ours 2 — absolu, ancré à droite, spring tracking souris */}
        <img ref={oursRef} src="/ours-butagaz-2.png" alt="Mascotte Butagaz" className="welcome-ours" />

        {/* Blocs centrés */}
        <div className="welcome-content">

          {/* Encart blanc */}
          <div className="welcome-card">
            <div className="welcome-card-date">{dateStr}</div>
            <div className="welcome-card-title">Prototype Butaswitch</div>
            <div className="welcome-card-desc">
              Outil de validation interne pour la revue UI du parcours de souscription Butagaz. La navigation est libre et les données saisies ne sont pas enregistrées.
            </div>
            <div className="welcome-card-actions">
              <button className="welcome-pill-primary" onClick={() => onStart('libre')}>
                <span className="cta-title">Démarrer le parcours</span>
                <span className="cta-sub">Navigation libre depuis le site Butagaz</span>
              </button>
              <button className="welcome-pill-secondary" onClick={() => onShowGallery ? onShowGallery() : setShowGallery(true)}>
                Voir tous les écrans
              </button>
            </div>
          </div>

          {/* Bloc QR code */}
          <div className="welcome-qr-block">
            <img src={qrUrl} alt="QR code" width={100} height={100} style={{ borderRadius:10, flexShrink:0 }} />
            <div>
              <div className="welcome-qr-title">Ouvrir sur mobile</div>
              <div className="welcome-qr-text">Scannez ce QR code pour tester le prototype sur votre téléphone.</div>
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
function ImmersiveLayout({ onSwitchToDesktop, children }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onSwitchToDesktop(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onSwitchToDesktop]);

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

  const BottomBar = () => (
    <div className="ios-bottom">
      <span className="ios-bottom-icon disabled ios-bottom-desktop">‹</span>
      <span className="ios-bottom-icon disabled ios-bottom-desktop" style={{ opacity: 0.2 }}>›</span>
      <svg className="ios-bottom-desktop" width="20" height="20" viewBox="0 0 20 20" fill="#0A84FF"><rect x="1" y="5" width="13" height="14" rx="2" stroke="#0A84FF" strokeWidth="1.5" fill="none"/><path d="M4 4V3a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2h-1" stroke="#0A84FF" strokeWidth="1.5" fill="none"/></svg>
      <svg className="ios-bottom-desktop" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#0A84FF" strokeWidth="1.5"><path d="M3 3h5v5H3zM12 3h5v5h-5zM3 12h5v5H3zM12 12h5v5h-5z"/></svg>
    </div>
  );

  return (
    <div className="immersive-overlay immersive-overlay-entering">
      <div className="immersive-phone-shell immersive-phone-entering">
        <div className="ios-dynamic-island" />
        <StatusBar />
        <AddressBar />
        {children}
        <BottomBar />
      </div>
    </div>
  );
}

// ─── NAVIGATION VIEW ─────────────────────────────────────────────────────────
function NavigationView({
  scenario, setScenario, currentScreen, setCurrentScreen,
  formData, setFormData, showAnnotations, setShowAnnotations,
  returnTo, setReturnTo, stepHistory, setStepHistory,
  offerMode, setOfferMode, onSwitchToGallery, isLibre, isMobileVP,
  immersiveMode, setImmersiveMode,
  showBrowserChrome, setShowBrowserChrome,
  viewKey,
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

  const switchToDesktop = () => { setImmersiveMode(false); setShowBrowserChrome(true); };

  return (
    <div className="nav-view" style={{ background: immersiveMode ? '#0A0A0A' : '#f0f4f8' }}>
      {immersiveMode ? (
        <ImmersiveLayout key={viewKey} onSwitchToDesktop={switchToDesktop}>
          <div ref={mobileFrameRef} className="immersive-phone-content">
            {screenRouterEl}
          </div>
        </ImmersiveLayout>
      ) : (
      /* Main — colonnes : gauche | centre | droite */
      <div key={viewKey} className="nav-main-layout desktop-view-entering" style={{ flex:1, display:'flex', gap:16, padding: showBrowserChrome ? '12px 12px 12px' : '16px', justifyContent: showBrowserChrome ? 'flex-start' : 'center', alignItems:'flex-start', minHeight:0, overflow:'auto' }}>

        {/* Panneau gauche — Annotations UX */}
        {showAnnotations && (
          <div className="ann-panel">
            <div className="ann-panel-title">Annotations UX</div>
            <div>{annText || 'Aucune annotation pour cet écran.'}</div>
          </div>
        )}

        {/* Centre — Frame téléphone ou Browser chrome */}
        <div className="nav-frame-wrap-desktop" style={{ flexShrink: showBrowserChrome ? 0 : 0, flex: showBrowserChrome ? 1 : 0, display:'flex', flexDirection:'column', alignItems: showBrowserChrome ? 'stretch' : 'center', gap:10, minWidth:0 }}>
          {showBrowserChrome ? (
            <div style={{ flex:1, background:'#e8eaed', borderRadius:12, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' }}>
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
                    <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Butagaz : Souscription gaz citerne</span>
                    <span style={{ fontSize:10, color:'#bbb', cursor:'pointer', marginLeft:4 }}>×</span>
                  </div>
                  <div style={{ width:28, height:26, borderRadius:'4px 4px 0 0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'#888', cursor:'pointer' }}>+</div>
                </div>
                <div style={{ background:'#fff', padding:'7px 12px', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                    {['←','→','↻'].map((c,i) => <span key={i} style={{ fontSize:15, color: i < 2 ? '#ccc' : '#666', cursor:'pointer', lineHeight:1 }}>{c}</span>)}
                  </div>
                  <div style={{ flex:1, background:'#f1f3f4', borderRadius:20, padding:'5px 14px', display:'flex', alignItems:'center', gap:7 }}>
                    <Lock size={11} color="#2a9d5c" strokeWidth={2} style={{ flexShrink:0 }} />
                    <span style={{ fontSize:13, color:'#3c4043', flex:1 }}>butagaz.fr/souscrire-gaz-citerne</span>
                  </div>
                  <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                    {['☆','⋮'].map((c,i) => <span key={i} style={{ fontSize:17, color:'#666', cursor:'pointer' }}>{c}</span>)}
                  </div>
                </div>
              </div>
              {/* Contenu — centré à 800px */}
              <div key={screenKey} ref={mobileFrameRef} className="mobile-scroll" style={{ height:'calc(100dvh - 200px)', overflowY:'auto', overflowX:'hidden', background:'#f4f6f8', '--screen-dir': `${navDir * 16}px` }}>
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
            <div style={{ whiteSpace:'pre-wrap' }}>{ctxText || (isLibre ? 'Mode parcours libre, aucun profil présélectionné.' : '·')}</div>
          </div>
        )}

      </div>
      )}

      {showRecallModal && <RecallModal formData={formData} onClose={() => setShowRecallModal(false)} />}
    </div>
  );
}

// ─── MOBILE SHELL — Expérience QR code ───────────────────────────────────────
function MobileShell({ initialScreen, initialForm, offerMode, onHome, initialMode }) {
  const [mobileMode, setMobileMode] = useState(initialMode === 'gallery' ? 'gallery' : 'nav'); // 'nav' | 'gallery'
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(initialScreen);
  const [formData, setFormData] = useState(initialForm);
  const [returnTo, setReturnTo] = useState(null);
  const [stepHistory, setStepHistory] = useState([initialScreen]);
  const [simulateError, setSimulateError] = useState(false);
  const [screenKey, setScreenKey] = useState(0);
  const scrollRef = useRef(null);

  function navigate(screen) {
    setCurrentScreen(screen);
    setStepHistory(prev => [...prev, screen]);
    setScreenKey(k => k + 1);
    setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, 50);
  }

  function goToScreen(screen, form) {
    setCurrentScreen(screen);
    setFormData({ ...form });
    setStepHistory([screen]);
    setScreenKey(k => k + 1);
    setMobileMode('nav');
    setMenuOpen(false);
  }

  function returnToSite() { navigate('PAGE0'); }

  const screenRouterEl = (
    <ScreenRouter
      screen={currentScreen}
      formData={formData}
      setFormData={setFormData}
      navigate={navigate}
      showRecall={() => {}}
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

  if (mobileMode === 'gallery') {
    return (
      <div className="mobile-gallery-root">
        <div className="mobile-gallery-header">
          <button className="mobile-gallery-back" onClick={() => setMobileMode('nav')}>
            <X size={16} strokeWidth={2.5} />
            Fermer
          </button>
          <span style={{ flex:1, fontWeight:700, fontSize:16, color:'#1a1b20' }}>Tous les écrans</span>
        </div>
        <div style={{ paddingTop:16 }}>
          {GALLERY_ITEMS.map((item, idx) => {
            const content = item.renderFn ? item.renderFn() : (
              <ScreenRouter
                screen={item.screen}
                formData={item.form}
                setFormData={noop}
                navigate={noop}
                showRecall={noop}
                returnTo={null}
                setReturnTo={noop}
                stepHistory={[item.screen]}
                offerMode={false}
                returnToSite={noop}
                onHome={noop}
                simulateError={false}
                setSimulateError={noop}
              />
            );
            return (
              <div
                key={item.key}
                className="mobile-gallery-item"
                style={{ animationDelay:`${idx * 30}ms` }}
                onClick={() => goToScreen(item.screen, item.form)}
              >
                <div className="mobile-gallery-preview">
                  <div style={{
                    position:'absolute', top:0,
                    left:`calc(50% - ${375 * 0.48 / 2}px)`,
                    width:375, height:375,
                    transform:'scale(0.48)',
                    transformOrigin:'top left',
                    pointerEvents:'none',
                    userSelect:'none',
                  }}>
                    {content}
                  </div>
                  {/* Gradient fade at bottom */}
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:48, background:'linear-gradient(transparent, #f8fafc)', pointerEvents:'none' }} />
                </div>
                <div className="mobile-gallery-label">
                  <span>{item.label}</span>
                  <span style={{ color:'#8b9aa4', fontSize:16 }}>›</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mobile-gallery-cta">
          <button
            className="mobile-gallery-cta-btn"
            onClick={() => goToScreen('PAGE0', { ...EMPTY_FORM })}
          >
            Démarrer la navigation libre
          </button>
        </div>
      </div>
    );
  }

  // Mode nav — plein écran, aucun chrome, juste le contenu
  return (
    <div style={{ position:'relative', minHeight:'100dvh' }}>
      <div ref={scrollRef} key={screenKey} style={{ minHeight:'100dvh' }}>
        {screenRouterEl}
      </div>

      {/* Floating burger */}
      <button
        className="mobile-burger-fab"
        onClick={() => setMenuOpen(v => !v)}
        aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
      >
        {menuOpen
          ? <X size={18} color="#fff" strokeWidth={2.5} />
          : <Menu size={18} color="#fff" strokeWidth={2.5} />
        }
      </button>

      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{ position:'fixed', inset:0, zIndex:998 }}
            onClick={() => setMenuOpen(false)}
          />
          <div className="mobile-menu-panel">
            <button className="mobile-menu-item" onClick={() => { setMobileMode('gallery'); setMenuOpen(false); }}>
              <LayoutGrid size={18} color="#0059a0" strokeWidth={2} />
              Galerie d'écrans
            </button>
            <div className="mobile-menu-separator" />
            <button className="mobile-menu-item" onClick={() => { onHome(); setMenuOpen(false); }}>
              <Home size={18} color="#0059a0" strokeWidth={2} />
              Accueil
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── MODE EXPORT — rendu isolé pour screenshots Playwright ───────────────────
function ExportScreen({ index }) {
  const item = GALLERY_ITEMS[index];
  if (!item) return <div style={{ padding: 32, fontFamily: 'sans-serif', color: '#888' }}>Écran introuvable (index {index})</div>;
  const content = item.renderFn ? item.renderFn() : (
    <ScreenRouter
      screen={item.screen}
      formData={item.form}
      setFormData={noop}
      navigate={noop}
      showRecall={noop}
      returnTo={null}
      setReturnTo={noop}
      stepHistory={[item.screen]}
      offerMode={false}
      returnToSite={noop}
      onHome={noop}
      simulateError={false}
      setSimulateError={noop}
    />
  );
  return (
    <>
      <InjectCSS />
      <div data-export-ready="true" style={{ width: 375, background: '#fff', minHeight: '100dvh' }}>
        {content}
      </div>
    </>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  // Export mode — détecté avant tout autre hook, valeur stable (ne change pas)
  const [exportIndex] = useState(() => {
    if (typeof window === 'undefined') return null;
    const v = new URLSearchParams(window.location.search).get('export');
    return v !== null ? parseInt(v, 10) : null;
  });

  // URL mode — ?mode=gallery | ?mode=libre court-circuite la welcome
  const [urlMode] = useState(() => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get('mode'); // 'gallery' | 'libre' | null
  });

  const [isMobileVP, setIsMobileVP] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 500);
  useEffect(() => {
    const handler = () => setIsMobileVP(window.innerWidth <= 500);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Bouton retour navigateur — restaure l'état depuis history.state
  useEffect(() => {
    function onPopState(e) {
      const m = e.state?.mode || null;
      if (m === null) {
        setIsWelcome(true);
      } else if (m === 'libre') {
        setIsWelcome(false);
        setMode('libre');
        setImmersiveMode(true);
        setShowBrowserChrome(false);
        setFormData({ ...EMPTY_FORM });
        setCurrentScreen('PAGE0');
        setStepHistory(['PAGE0']);
      } else if (m === 'gallery') {
        setIsWelcome(false);
        setMode('gallery');
        setImmersiveMode(false);
        setShowBrowserChrome(false);
      }
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const [isWelcome, setIsWelcome] = useState(() => urlMode === null); // false si URL mode
  const [mode, setMode] = useState(() => urlMode === 'libre' || urlMode === 'gallery' ? urlMode : 'gallery'); // 'gallery' | 'libre'
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
  const [immersiveMode, setImmersiveMode] = useState(() => urlMode === 'libre');
  const [showBrowserChrome, setShowBrowserChrome] = useState(false);
  const [viewKey, setViewKey] = useState(0);
  const [welcomeExiting, setWelcomeExiting] = useState(false);
  const [appEntering, setAppEntering] = useState(false);

  function switchToPhone() { setImmersiveMode(true); setShowBrowserChrome(false); setViewKey(k => k + 1); }
  function switchToDesktopView() { setShowBrowserChrome(true); setImmersiveMode(false); setViewKey(k => k + 1); }

  function pushUrl(m) {
    const url = m ? `${window.location.pathname}?mode=${m}` : window.location.pathname;
    window.history.pushState({ mode: m || null }, '', url);
  }

  function launchApp(setup) {
    setWelcomeExiting(true);
    setTimeout(() => {
      setup();
      setWelcomeExiting(false);
      setIsWelcome(false);
      setAppEntering(true);
      setTimeout(() => setAppEntering(false), 400);
    }, 220);
  }

  function handleStart() {
    pushUrl('libre');
    launchApp(() => {
      setFormData({ ...EMPTY_FORM });
      setCurrentScreen('PAGE0');
      setStepHistory(['PAGE0']);
      setReturnTo(null);
      setMode('libre');
      setImmersiveMode(true);
      setShowBrowserChrome(false);
    });
  }

  function handleNavigateTo(screen, fd) {
    pushUrl('libre');
    launchApp(() => {
      setFormData({ ...fd });
      setCurrentScreen(screen);
      setStepHistory([screen]);
      setReturnTo(null);
      setMode('libre');
      setImmersiveMode(true);
      setShowBrowserChrome(false);
    });
  }

  function handleShowGallery() {
    pushUrl('gallery');
    launchApp(() => {
      setMode('gallery');
      setImmersiveMode(false);
      setShowBrowserChrome(false);
    });
  }

  function handleModeChange(newMode) {
    pushUrl(newMode);
    if (newMode === 'libre') {
      setFormData({ ...EMPTY_FORM });
      setCurrentScreen('PAGE0');
      setStepHistory(['PAGE0']);
      setReturnTo(null);
      setImmersiveMode(true);
      setShowBrowserChrome(false);
    } else {
      setImmersiveMode(false);
      setShowBrowserChrome(false);
    }
    setMode(newMode);
  }

  function handleGoHome() {
    pushUrl(null);
    setIsWelcome(true);
  }

  // Export mode — court-circuite tout le shell
  if (exportIndex !== null) {
    return <ExportScreen index={exportIndex} />;
  }

  if (isWelcome) {
    return (
      <>
        <InjectCSS />
        <div className={welcomeExiting ? 'welcome-exiting' : ''}>
          <ScreenWelcome onStart={handleStart} onNavigateTo={handleNavigateTo} onShowGallery={handleShowGallery} />
        </div>
      </>
    );
  }

  // Expérience mobile — pas de topbar, pas de shell desktop
  if (isMobileVP) {
    return (
      <>
        <InjectCSS />
        <MobileShell
          initialScreen={currentScreen}
          initialForm={formData}
          offerMode={offerMode}
          onHome={handleGoHome}
          initialMode={urlMode}
        />
      </>
    );
  }

  return (
    <>
      <InjectCSS />
      <div className={`app-shell${appEntering ? ' app-entering' : ''}`}>

      {/* Top mode bar — barre unique avec tous les contrôles */}
      <div className="shell-topbar" style={{ position:'relative' }}>
        {/* Gauche : logo + onglets */}
        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0, cursor:'pointer' }} onClick={handleGoHome}>
          <img src="/logo-butagaz.png" alt="Butagaz" style={{ height:22, width:'auto', filter:'brightness(0) invert(1)', opacity:0.9, flexShrink:0 }} />
          <span className="shell-logo">Butaswitch</span>
        </div>
        <span className="shell-version">v2.1</span>
        <div className="shell-modes">
          {[
            { id:'gallery', label:'⊞ Tous les écrans', short:'Écrans' },
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

        {/* Centre : toggle Smartphone / Desktop — visible uniquement en Parcours libre */}
        {mode === 'libre' && (
          <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', display:'flex', gap:2, background:'rgba(0,0,0,0.22)', borderRadius:9, padding:2 }}>
            <button
              className="shell-mode-btn"
              style={{ background: immersiveMode ? '#fff' : 'transparent', color: immersiveMode ? '#0079c0' : 'rgba(255,255,255,0.75)', fontWeight: immersiveMode ? 700 : 500, padding:'4px 14px', fontSize:13, display:'flex', alignItems:'center', gap:6 }}
              onClick={switchToPhone}
            >
              <Smartphone size={14} strokeWidth={2.2} />
              Smartphone
            </button>
            <button
              className="shell-mode-btn"
              style={{ background: showBrowserChrome ? '#fff' : 'transparent', color: showBrowserChrome ? '#0079c0' : 'rgba(255,255,255,0.75)', fontWeight: showBrowserChrome ? 700 : 500, padding:'4px 14px', fontSize:13, display:'flex', alignItems:'center', gap:6 }}
              onClick={switchToDesktopView}
            >
              <Monitor size={14} strokeWidth={2.2} />
              Desktop
            </button>
          </div>
        )}

        {/* Droite : chip offre promo */}
        <button
          className={`shell-offer-chip${offerMode ? ' on' : ''}`}
          onClick={() => setOfferMode(v => !v)}
          aria-label={offerMode ? "Désactiver l'offre promotionnelle" : "Activer l'offre promotionnelle"}
          title={offerMode ? "Version avec offre 200€ — cliquez pour désactiver" : "Version sans offre — cliquez pour afficher la promo"}
        >
          <span className="shell-label-short">{offerMode ? 'Promo on' : 'Promo off'}</span>
          <span className="shell-label-long" style={{ display:'flex', alignItems:'center', gap:5 }}>{offerMode ? <><Check size={12} strokeWidth={2.5} />Avec offre 200 €</> : 'Sans offre promo'}</span>
        </button>
      </div>

      {mode === 'gallery' && (
        <GalleryView onBack={null} onNavigateTo={handleNavigateTo} />
      )}

      {mode === 'libre' && (
        <NavigationView
          scenario={null}
          setScenario={setScenario}
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          formData={formData}
          setFormData={setFormData}
          showAnnotations={false}
          setShowAnnotations={setShowAnnotations}
          returnTo={returnTo}
          setReturnTo={setReturnTo}
          stepHistory={stepHistory}
          setStepHistory={setStepHistory}
          offerMode={offerMode}
          setOfferMode={setOfferMode}
          onSwitchToGallery={() => setMode('gallery')}
          isLibre={true}
          immersiveMode={immersiveMode}
          setImmersiveMode={setImmersiveMode}
          showBrowserChrome={showBrowserChrome}
          setShowBrowserChrome={setShowBrowserChrome}
          viewKey={viewKey}
        />
      )}
      </div>{/* /app-shell */}
    </>
  );
}
