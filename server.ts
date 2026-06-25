import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { db } from "./src/db";
import { resources, users, saved_resources, user_stats, blockchain_credentials, blockchain_circles, blockchain_grants, module_progress } from "./src/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import crypto from "crypto";
import { seedDatabase } from "./src/db/seeds/seed";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import { setupRoutes } from "./src/api/routes";

// Initialize Firebase Admin for token verification gracefully
let adminApp;
let auth: any = null;
try {
  const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf-8"));
  adminApp = initializeApp({ projectId: firebaseConfig.projectId });
  auth = getAuth(adminApp);
} catch (error) {
  console.warn("Could not read firebase-applet-config.json or initialize Firebase admin. Authentication will fail.");
}

export async function buildApp() {
  migrate(db, { migrationsFolder: path.join(process.cwd(), 'src/db/migrations') });
  console.log('DB migrations applied.');

  try {
    const rCount = await db.select({ count: sql<number>`count(*)` }).from(resources).get();
    if (!rCount || rCount.count === 0) {
      console.log('Resources table empty, scaling up seed data...');
      await seedDatabase();
    }
  } catch(e) {
    console.error('Failed to seed on startup:', e);
  }

  const app = express();
  const PORT = 3000;

  // Trust proxy for rate limiting behind reverse proxy (e.g., Cloud Run ingress)
  app.set('trust proxy', 1);

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "production" ? {
      directives: {
        defaultSrc: ["'self'", "https://*.googleapis.com", "https://*.firebaseapp.com"],
        scriptSrc: ["'self'", "https://*.googleapis.com", "https://*.firebaseapp.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:"],
        frameSrc: ["'self'", "https:"]
      }
    } : false,
  }));
  app.use(express.json({ limit: "16kb" }));

  // Global Rate Limiter
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per `window`
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
    validate: { xForwardedForHeader: false }
  });
  app.use("/api/", globalLimiter);

  // Auth Middleware
  const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. Please sign in." });
    }
    const idToken = authHeader.split("Bearer ")[1];
    try {
      if (!auth) {
        return res.status(500).json({ error: "Server missing Firebase configuration." });
      }
      const decodedToken = await auth.verifyIdToken(idToken);
      (req as any).user = decodedToken;
      next();
    } catch (err) {
      console.error("Token verification failed:", err);
      return res.status(403).json({ error: "Invalid or expired token." });
    }
  };

  // --- API Routes ---

  // Admin Middleware
  const requireAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      if (!(req as any).user) return res.status(401).json({ error: "Unauthorized" });
      const uid = (req as any).user.uid;
      const dbUser = db.select().from(users).where(eq(users.id, uid)).get();
      if (!dbUser || dbUser.role !== 'admin') {
        return res.status(403).json({ error: "Forbidden. Admin access required." });
      }
      next();
    } catch(err) {
      console.error("Admin check failed", err);
      return res.status(500).json({ error: "Server error" });
    }
  };

  // Health check
  app.get(["/health", "/api/health"], (req, res) => {
    try {
      // Deep health check: verify DB connection
      db.select().from(users).limit(1).get();
      res.json({ status: "healthy", db: "connected", timestamp: new Date().toISOString() });
    } catch (e) {
      console.error("Healthcheck DB failure", e);
      res.status(503).json({ status: "unhealthy", db: "disconnected", error: String(e) });
    }
  });

  setupRoutes(app, requireAuth, requireAdmin);
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

if (!process.env.VITEST) {
  buildApp().then(app => {
    app.listen(3000, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:3000`);
    });
  });
}
