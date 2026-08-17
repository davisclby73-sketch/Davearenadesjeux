import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface RoundPayload {
  multiplier: number | string;
  timestamp?: string;
  source?: string;
}

const liveRoundsHistory: { multiplier: number; timestamp: string; source: string }[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Aviator Live API Predictor" });
  });

  // GET live rounds history with direct 1win API sync attempt
  app.get("/api/aviator/rounds", async (_req, res) => {
    try {
      // Direct call to 1win casino history endpoint using provided request metadata
      const response = await fetch(
        "https://1win.com/api/internal/casino-history-list?localeId=10009&onlyMobile=true&lang=fr&u=2514753152",
        {
          method: "GET",
          headers: {
            "accept": "*/*",
            "accept-language": "fr-CI,fr;q=0.9",
            "content-type": "application/json",
            "referer": "https://1win.com/casino/play/v_spribe:aviator",
            "sec-ch-ua": '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
            "x-origin": "1win.com",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && (Array.isArray(data) || Array.isArray(data.data) || Array.isArray(data.items) || Array.isArray(data.list))) {
          const rawItems = Array.isArray(data) ? data : (data.data || data.items || data.list || []);
          const extracted: { multiplier: number; timestamp: string; source: string }[] = [];

          for (const item of rawItems) {
            const m = item.multiplier || item.coefficient || item.rate || item.payout || item.val || item.odds;
            if (m) {
              const num = typeof m === "number" ? m : parseFloat(String(m).replace("x", ""));
              if (!isNaN(num) && num > 0) {
                extracted.push({
                  multiplier: Number(num.toFixed(2)),
                  timestamp: item.timestamp || item.created_at || new Date().toISOString(),
                  source: "1win_direct_api",
                });
              }
            }
          }

          if (extracted.length > 0) {
            // Merge with local history
            for (const item of extracted.reverse()) {
              if (!liveRoundsHistory.some((r) => Math.abs(r.multiplier - item.multiplier) < 0.001 && r.timestamp === item.timestamp)) {
                liveRoundsHistory.unshift(item);
              }
            }
            if (liveRoundsHistory.length > 100) liveRoundsHistory.length = 100;
          }
        }
      }
    } catch (e) {
      // If direct CORS/Cloudflare bypass is needed, fallback to incoming bot stream
    }

    return res.json({
      status: "ok",
      mode: "API_LIVE",
      count: liveRoundsHistory.length,
      rounds: liveRoundsHistory,
      lastUpdated: new Date().toISOString(),
    });
  });

  // POST new round crash multiplier (from Playwright Python bot or Webhook)
  app.post("/api/aviator/push", (req, res) => {
    try {
      const body: RoundPayload = req.body || {};
      const rawVal = body.multiplier;
      if (rawVal === undefined || rawVal === null) {
        return res.status(400).json({ error: "Missing 'multiplier' field in request body" });
      }

      const numVal = typeof rawVal === "string"
        ? parseFloat(rawVal.replace(/x/gi, "").trim())
        : Number(rawVal);

      if (isNaN(numVal) || numVal <= 0) {
        return res.status(400).json({ error: "Invalid numeric multiplier" });
      }

      const newEntry = {
        multiplier: Number(numVal.toFixed(2)),
        timestamp: body.timestamp || new Date().toISOString(),
        source: body.source || "1win_aviator_bot",
      };

      liveRoundsHistory.unshift(newEntry);
      if (liveRoundsHistory.length > 100) liveRoundsHistory.pop();

      console.log(`[AVIATOR LIVE API] New crash received: ${newEntry.multiplier}x at ${newEntry.timestamp}`);

      return res.json({
        success: true,
        message: `Multiplier ${newEntry.multiplier}x recorded`,
        latestRound: newEntry,
        totalRounds: liveRoundsHistory.length,
      });
    } catch (err: any) {
      console.error("Error processing /api/aviator/push:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  const liveLuckyJetHistory: { multiplier: number; timestamp: string; source: string }[] = [];

  // GET Lucky Jet live rounds history
  app.get("/api/luckyjet/rounds", async (_req, res) => {
    try {
      const response = await fetch(
        "https://1win.com/api/internal/casino-history-list?localeId=10009&onlyMobile=true&lang=fr&u=2514753152&gameId=luckyjet",
        {
          method: "GET",
          headers: {
            "accept": "*/*",
            "accept-language": "fr-CI,fr;q=0.9",
            "content-type": "application/json",
            "referer": "https://1win.com/casino/play/v_1win:luckyjet",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
            "x-origin": "1win.com",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && (Array.isArray(data) || Array.isArray(data.data) || Array.isArray(data.items) || Array.isArray(data.list))) {
          const rawItems = Array.isArray(data) ? data : (data.data || data.items || data.list || []);
          const extracted: { multiplier: number; timestamp: string; source: string }[] = [];

          for (const item of rawItems) {
            const m = item.multiplier || item.coefficient || item.rate || item.payout || item.val || item.odds;
            if (m) {
              const num = typeof m === "number" ? m : parseFloat(String(m).replace("x", ""));
              if (!isNaN(num) && num > 0) {
                extracted.push({
                  multiplier: Number(num.toFixed(2)),
                  timestamp: item.timestamp || item.created_at || new Date().toISOString(),
                  source: "1win_direct_api",
                });
              }
            }
          }

          if (extracted.length > 0) {
            for (const item of extracted.reverse()) {
              if (!liveLuckyJetHistory.some((r) => Math.abs(r.multiplier - item.multiplier) < 0.001 && r.timestamp === item.timestamp)) {
                liveLuckyJetHistory.unshift(item);
              }
            }
            if (liveLuckyJetHistory.length > 100) liveLuckyJetHistory.length = 100;
          }
        }
      }
    } catch (e) {
      // Fallback
    }

    return res.json({
      status: "ok",
      mode: "API_LIVE",
      count: liveLuckyJetHistory.length,
      rounds: liveLuckyJetHistory,
      lastUpdated: new Date().toISOString(),
    });
  });

  // POST new round crash multiplier for Lucky Jet
  app.post("/api/luckyjet/push", (req, res) => {
    try {
      const body: RoundPayload = req.body || {};
      const rawVal = body.multiplier;
      if (rawVal === undefined || rawVal === null) {
        return res.status(400).json({ error: "Missing 'multiplier' field in request body" });
      }

      const numVal = typeof rawVal === "string"
        ? parseFloat(rawVal.replace(/x/gi, "").trim())
        : Number(rawVal);

      if (isNaN(numVal) || numVal <= 0) {
        return res.status(400).json({ error: "Invalid numeric multiplier" });
      }

      const newEntry = {
        multiplier: Number(numVal.toFixed(2)),
        timestamp: body.timestamp || new Date().toISOString(),
        source: body.source || "1win_luckyjet_bot",
      };

      liveLuckyJetHistory.unshift(newEntry);
      if (liveLuckyJetHistory.length > 100) liveLuckyJetHistory.pop();

      console.log(`[LUCKY JET LIVE API] New crash received: ${newEntry.multiplier}x at ${newEntry.timestamp}`);

      return res.json({
        success: true,
        message: `Multiplier ${newEntry.multiplier}x recorded`,
        latestRound: newEntry,
        totalRounds: liveLuckyJetHistory.length,
      });
    } catch (err: any) {
      console.error("Error processing /api/luckyjet/push:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  const liveRocketQueenHistory: { multiplier: number; timestamp: string; source: string }[] = [];

  // GET Rocket Queen live rounds history from gamedev-tech gateway or local live stream
  app.get("/api/rocketqueen/history", async (_req, res) => {
    try {
      const response = await fetch(
        "https://crash-gateway-grm-cr.gamedev-tech.cc/history",
        {
          method: "GET",
          headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
            "origin": "https://1play.gamedev-tech.cc",
            "referer": "https://1play.gamedev-tech.cc/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && (Array.isArray(data) || Array.isArray(data.data) || Array.isArray(data.items) || Array.isArray(data.history))) {
          const rawItems = Array.isArray(data) ? data : (data.data || data.items || data.history || []);
          const extracted: { multiplier: number; timestamp: string; source: string }[] = [];

          for (const item of rawItems) {
            const m = item.multiplier || item.coefficient || item.rate || item.payout || item.val || item.odds || item.final_multiplier;
            if (m) {
              const num = typeof m === "number" ? m : parseFloat(String(m).replace("x", ""));
              if (!isNaN(num) && num > 0) {
                extracted.push({
                  multiplier: Number(num.toFixed(2)),
                  timestamp: item.timestamp || item.created_at || new Date().toISOString(),
                  source: "rocket_queen_official_api",
                });
              }
            }
          }

          if (extracted.length > 0) {
            for (const item of extracted.reverse()) {
              if (!liveRocketQueenHistory.some((r) => Math.abs(r.multiplier - item.multiplier) < 0.001 && r.timestamp === item.timestamp)) {
                liveRocketQueenHistory.unshift(item);
              }
            }
            if (liveRocketQueenHistory.length > 100) liveRocketQueenHistory.length = 100;
          }
        }
      }
    } catch (e) {
      // Fallback
    }

    return res.json({
      status: "ok",
      mode: "API_LIVE",
      count: liveRocketQueenHistory.length,
      rounds: liveRocketQueenHistory,
      lastUpdated: new Date().toISOString(),
    });
  });

  // POST new round crash multiplier for Rocket Queen
  app.post("/api/rocketqueen/push", (req, res) => {
    try {
      const body: RoundPayload = req.body || {};
      const rawVal = body.multiplier;
      if (rawVal === undefined || rawVal === null) {
        return res.status(400).json({ error: "Missing 'multiplier' field in request body" });
      }

      const numVal = typeof rawVal === "string"
        ? parseFloat(rawVal.replace(/x/gi, "").trim())
        : Number(rawVal);

      if (isNaN(numVal) || numVal <= 0) {
        return res.status(400).json({ error: "Invalid numeric multiplier" });
      }

      const newEntry = {
        multiplier: Number(numVal.toFixed(2)),
        timestamp: body.timestamp || new Date().toISOString(),
        source: body.source || "rocketqueen_bot",
      };

      liveRocketQueenHistory.unshift(newEntry);
      if (liveRocketQueenHistory.length > 100) liveRocketQueenHistory.pop();

      console.log(`[ROCKET QUEEN LIVE API] New crash received: ${newEntry.multiplier}x at ${newEntry.timestamp}`);

      return res.json({
        success: true,
        message: `Multiplier ${newEntry.multiplier}x recorded`,
        latestRound: newEntry,
        totalRounds: liveRocketQueenHistory.length,
      });
    } catch (err: any) {
      console.error("Error processing /api/rocketqueen/push:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Serve static assets from /public directly
  app.use(express.static(path.join(process.cwd(), "public")));

  // Vite Middleware in Development vs Static in Production
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
    console.log(`🚀 Aviator Live API Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
