# ATLAS MISSION CONTROL: SYSTEM ARCHITECTURE & PROJECT DOCUMENTATION

**Project Title:** ATLAS — Aerospace Telemetry & Threat Analysis System  
**Version:** 2.0.0 (Production Release)  
**Theme Name:** Deep Space Cyberpunk HUD / Tactical Orbital Command  
**Target Platform:** Web (Desktop/Mobile) & Edge Hardware (Raspberry Pi 4 Kiosk HUD)

---

## 1. Executive Summary

**ATLAS (Aerospace Telemetry & Threat Analysis System)** is a full-stack, edge-resilient space weather monitoring and cybersecurity threat intelligence platform. It bridges real-time NASA space telemetry—including Coronal Mass Ejections (CMEs), Solar Radiation Storms, and Solar Flares—with digital infrastructure defense systems on Earth and in Low Earth Orbit (LEO).

Powered by server-side **Google Gemini 3.6 Flash AI**, ATLAS dynamically translates raw astrophysical sensor streams into actionable cyber-threat risk reports, power grid protective protocols, and satellite orbital degradation models. Designed for mission critical field operations, ATLAS features an **Offline-First Progressive Web App (PWA)** architecture, **Firebase Firestore real-time field logging**, and an **Interactive Raspberry Pi 4 Kiosk HUD profile**.

---

## 2. Problem Statement & System Concept

### The Space Weather & Cyber Vulnerability Gap
Modern societal infrastructure—power grids (SCADA systems), satellite navigation (GPS/GNSS), high-frequency financial communication networks, and Low Earth Orbit (LEO) satellite constellations—are exceptionally vulnerable to severe solar events (Geomagnetic Storms, Class X Solar Flares). 

However, raw NASA scientific data is often dense and disconnected from ground-level IT/cybersecurity operational workflows. Mission commanders lack a unified platform that ingests raw telemetry, synthesizes immediate cyber-infrastructure risk using generative AI, and operates reliably when connectivity to base is disrupted.

### The ATLAS Solution
ATLAS acts as an intelligent command bridge:
1. **Live Data Ingestion:** Continuously pulls solar flare velocity, magnetic orientation, and radiation metrics from NASA DONKI endpoints and NTRS technical archives.
2. **Generative Threat Synthesis:** Uses server-side Gemini 3.6 Flash to score threat levels (0–100) and issue structured mitigation directives for SCADA grids, satellite communication links, and aviation routes.
3. **Orbital Telemetry Visualizer:** Renders an interactive 3D/Canvas Low Earth Orbit satellite threat map mapping geomagnetic disturbance radii against satellite node health.
4. **Field Resilience:** Operates seamlessly offline on low-power Raspberry Pi 4 touch displays with local IndexedDB queuing and auto-flushing Firebase synchronization.

---

## 3. Visual System & Theme Specification

* **Theme Name:** `Deep Space Cyberpunk HUD` (or `Tactical Orbital Command`)
* **Visual Identity & Aesthetics:** High-contrast, dark-mode tactical interface engineered for low-light command environments and high visual legibility.
* **Palette Specification:**
  * **Primary Accent (Neon Cyan):** `#00f3ff` — Active telemetry, normal operations, selection states.
  * **Secondary Accent (Deep Cyber Magenta):** `#ff00ff` — AI processing, space weather warnings, visual highlights.
  * **Alert / Threat Critical (Signal Red):** `#ff0055` — Severe geomagnetic hazards, Class X flares, critical logs.
  * **Background Slate Dark:** `#020617` / `#090d16` — Deep obsidian canvas with low-opacity grid mesh overlay (`rgba(0, 243, 255, 0.07)`).
* **Typography:** `Orbitron` (Monospaced display headers & HUD telemetry) paired with standard crisp UI sans-serif for high-density readable text blocks.

---

## 4. System Architecture & Core Modules

```
[ NASA DONKI APIs ]       [ NASA NTRS Technical Papers ]
         │                               │
         └───────────────┬───────────────┘
                         ▼
        ┌─────────────────────────────────┐
        │   Express.js Server-Side Proxy  │
        │      (Port 3000 / Cloud Run)    │
        └────────────────┬────────────────┘
                         │
                         ▼
      ┌─────────────────────────────────────┐
      │ Gemini 3.6 Flash Synthesis Engine   │
      │ (Multi-Model Resilience Fallback)   │
      └──────────────────┬──────────────────┘
                         │
                         ▼
   ┌───────────────────────────────────────────┐
   │        ATLAS React 18 + Vite Client       │
   ├───────────────────────────────────────────┤
   │ 1. Orbital Threat Globe (Canvas 3D)       │
   │ 2. Satellite Intelligence Dashboard       │
   │ 3. Raspberry Pi Kiosk HUD Profile         │
   │ 4. Firebase Field Incident Logger         │
   │ 5. Judge Pitch Video Presentation Engine  │
   └─────────────────────┬─────────────────────┘
                         │
                         ▼
        ┌─────────────────────────────────┐
        │  Firebase Firestore Cloud Sync  │
        │     + PWA IndexedDB Offline     │
        └─────────────────────────────────┘
```

### Module Breakdown

#### A. NASA Telemetry Engine (`/src/services/nasaApi.ts`)
* Ingests DONKI Coronal Mass Ejection (`CME`), Solar Flare (`FLR`), and Geomagnetic Storm (`GST`) REST feeds.
* Connects to NASA Technical Reports Server (`NTRS`) for AI-indexed semantic document retrieval.
* Features local caching to maintain instant load times under network throttling.

#### B. Gemini 3.6 Flash AI Threat Synthesis (`/server.ts` & `/src/services/geminiSynthesis.ts`)
* **Server-Side Security:** Executes all AI requests via an Express backend to keep API keys completely concealed from the client browser.
* **Resilient Model Fallback Pipeline:** Automatically cycles through candidate models (`gemini-3.6-flash` -> `gemini-flash-latest` -> `gemini-3.1-flash-lite` -> Rule-based fallback engine) ensuring 100% operational uptime during high API demand.
* **Structured Output Schema:** Generates quantitative threat scores, geomagnetic severity rankings, affected grid sectors, and tactical mitigation steps.

#### C. Interactive Orbital Threat Globe (`/src/components/OrbitalThreatMap.tsx`)
* Custom HTML5 Canvas rendering engine tracking Low Earth Orbit (LEO) satellite constellations.
* Displays dynamic particle sweeps, geomagnetic distortion zones, and satellite node health telemetry (Healthy, Degraded, Critical).

#### D. Field Incident Logger & Firebase Sync (`/src/components/FieldIncidentLogger.tsx`)
* Allows field commanders to submit tactical incident reports with threat level tags.
* Powered by Firebase Firestore for real-time cloud synchronization across connected mission devices.
* Includes background offline queueing: when disconnected, logs persist locally in IndexedDB and automatically flush to the cloud upon connection recovery.

#### E. Raspberry Pi 4 Kiosk Mode (`/src/components/PiKioskHUD.tsx`)
* Optimized low-overhead tactical display layout tailored for 800x480 / 1024x600 touchscreen Raspberry Pi monitors.
* Memory usage constrained (<190MB RAM footprint) with touch-friendly 44px+ controls and extreme contrast night-vision modes.

#### F. Judge Video Presentation & Pitch Engine (`/src/components/JudgeVideoPresentation.tsx`)
* Built-in 7-scene motion graphics presentation renderer with synchronized Web Speech Synthesis voiceover.
* Allows live playback, audio voice selection, script export, and direct WebM video recording capture for hackathon submissions.

---

## 5. Technology Stack & Dependencies

* **Frontend Framework:** React 18 + TypeScript + Vite
* **Styling & Icons:** Tailwind CSS + Lucide React Icons
* **Backend Runtime:** Node.js + Express.js + `esbuild`
* **AI SDK:** `@google/genai` (Gemini 3.6 Flash)
* **Cloud Persistence:** Firebase Firestore (Real-time DB) & Firebase Auth
* **Canvas Engine:** Native 2D/3D Context API (Zero heavy WebGL external dependencies)
* **Deployment Compatibility:** Google Cloud Run, GitHub Pages (PWA Static), Raspberry Pi Chromium Kiosk

---

## 6. Installation & Deployment Guide

### Prerequisites
* Node.js v18+ or v20+
* NPM or Bun package manager

### Local Development Setup
```bash
# 1. Clone repository
git clone https://github.com/your-username/atlas-mission-control.git
cd atlas-mission-control

# 2. Install dependencies
npm install

# 3. Configure environment variables (.env)
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY (optional, fallback rule engine active if missing)

# 4. Launch local full-stack dev server (Port 3000)
npm run dev
```

### Production Build & Deployment
```bash
# Build bundled single-file CommonJS server and Vite static distribution
npm run build

# Start production server
npm run start
```

---

## 7. Hackathon Submission Highlights & Achievements

* **100% Uptime Guarantee:** Multi-tiered model fallback prevents API 503 high-demand errors from breaking the user experience.
* **Full-Stack Security:** Gemini API key is strictly server-bound.
* **Hardware Ready:** Verified on Raspberry Pi 4 Linux Chromium Kiosk environment.
* **Real-Time Collaboration:** Multi-client Firestore sync for joint mission control operations.

---
*Documentation maintained by ATLAS Mission Control Engineering Team.*
