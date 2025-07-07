import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { waitlist } from "@db/schema";
import { eq } from "drizzle-orm";
import fetch from "node-fetch";

// Cloudflare Turnstile validation function
async function validateTurnstileToken(token: string, ip: string): Promise<boolean> {
  // For testing without a secret key, return true
  // In production, you would use a real secret key
  if (!process.env.TURNSTILE_SECRET_KEY) {
    console.warn("TURNSTILE_SECRET_KEY not set, skipping verification");
    return true;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", process.env.TURNSTILE_SECRET_KEY);
    formData.append("response", token);
    formData.append("remoteip", ip);

    const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const data = await result.json() as { success: boolean };
    return data.success === true;
  } catch (error) {
    console.error("Turnstile validation error:", error);
    return false;
  }
}

export function registerRoutes(app: Express): Server {
  app.post("/api/waitlist", async (req, res) => {
    try {
      const { fullName, email, token } = req.body;
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      
      // Basic validation
      if (!fullName || !email) {
        return res.status(400).json({ message: "Full name and email are required" });
      }

      // Validate Turnstile token
      if (token) {
        const isValid = await validateTurnstileToken(token, ip as string);
        if (!isValid) {
          return res.status(400).json({ message: "Invalid CAPTCHA verification. Please try again." });
        }
      }

      // Check if email already exists
      const existing = await db.select().from(waitlist).where(eq(waitlist.email, email));
      if (existing.length > 0) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Insert new registration
      const result = await db.insert(waitlist).values({
        fullName,
        email,
      }).returning();

      res.status(201).json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
