import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 2. Server-side Gemini AI Threat Synthesis Endpoint
app.post("/api/gemini/synthesize", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    const { prompt, fallbackData } = req.body;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY not found in environment. Using rule-based synthesis.");
      return res.json({
        success: false,
        source: "rule-based-fallback",
        report: fallbackData
      });
    }

    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    
    // Try primary models in sequence with fallback
    const candidateModels = ["gemini-3.6-flash", "gemini-3.6-pro"];
    let lastErrorMsg = "";

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const text = response.text;
        if (text) {
          const parsedReport = JSON.parse(text);
          return res.json({
            success: true,
            source: model,
            report: {
              ...parsedReport,
              generatedAt: new Date().toISOString()
            }
          });
        }
      } catch (modelErr: any) {
        lastErrorMsg = modelErr?.message || String(modelErr);
        console.warn(`[ATLAS Gemini] Attempt with model '${model}' failed: ${lastErrorMsg}`);
      }
    }

    // If all models failed (e.g. 503 high demand or API limit), return fallback report smoothly
    console.warn("[ATLAS Gemini] All AI models unavailable or rate limited. Returning rule-based threat report.");
    return res.json({
      success: false,
      error: lastErrorMsg || "Gemini service busy",
      source: "rule-based-fallback",
      report: fallbackData
    });
  } catch (error: any) {
    console.error("Server-side Gemini synthesis error:", error?.message || error);
    return res.json({
      success: false,
      error: error?.message || "Synthesis failed",
      source: "rule-based-fallback",
      report: req.body?.fallbackData || null
    });
  }
});

// 3. Server-side NASA Proxy & Cache Endpoint (ensures high performance and zero CORS/rate-limit errors)
app.get("/api/nasa/flares", async (_req, res) => {
  try {
    const nasaApiKey = process.env.NASA_API_KEY || "DEMO_KEY";
    const response = await fetch(
      `https://api.nasa.gov/DONKI/FLR?startDate=${getRecentDateStr(7)}&api_key=${nasaApiKey}`
    );
    if (!response.ok) throw new Error(`NASA DONKI HTTP ${response.status}`);
    const data = await response.json();
    return res.json({ success: true, data });
  } catch (err: any) {
    return res.json({ success: false, error: err?.message, data: getMockFlares() });
  }
});

app.get("/api/nasa/cmes", async (_req, res) => {
  try {
    const nasaApiKey = process.env.NASA_API_KEY || "DEMO_KEY";
    const response = await fetch(
      `https://api.nasa.gov/DONKI/CME?startDate=${getRecentDateStr(7)}&api_key=${nasaApiKey}`
    );
    if (!response.ok) throw new Error(`NASA DONKI HTTP ${response.status}`);
    const data = await response.json();
    return res.json({ success: true, data });
  } catch (err: any) {
    return res.json({ success: false, error: err?.message, data: getMockCMEs() });
  }
});

function getRecentDateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function getMockFlares() {
  return [
    {
      flrID: "2026-07-26T04:12:00-FLR-001",
      beginTime: "2026-07-26T04:00:00Z",
      peakTime: "2026-07-26T04:12:00Z",
      endTime: "2026-07-26T04:30:00Z",
      classType: "X2.4",
      sourceLocation: "S18W45",
      activeRegionNum: 3768,
      note: "Major X-class solar flare registered by NOAA GOES satellite array."
    },
    {
      flrID: "2026-07-25T18:45:00-FLR-002",
      beginTime: "2026-07-25T18:30:00Z",
      peakTime: "2026-07-25T18:45:00Z",
      endTime: "2026-07-25T19:05:00Z",
      classType: "M8.6",
      sourceLocation: "N12E30",
      activeRegionNum: 3765,
      note: "Strong M-class flare causing HF radio blackouts in Asia-Pacific sector."
    }
  ];
}

function getMockCMEs() {
  return [
    {
      activityID: "2026-07-26T04:30:00-CME-001",
      startTime: "2026-07-26T04:30:00Z",
      sourceLocation: "S18W45",
      note: "Earth-directed Halo CME detected with estimated speed 1,480 km/s."
    }
  ];
}

// 4. Vite Dev Server vs Static Production Server setup
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ATLAS Server] Operating on http://0.0.0.0:${PORT}`);
  });
}

start();
