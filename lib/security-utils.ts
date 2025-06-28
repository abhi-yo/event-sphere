import crypto from "crypto";

interface RateLimitEntry {
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const suspiciousIPs = new Set<string>();

export const RATE_LIMITS = {
  SECRET_CODE_ATTEMPTS: 3,
  WINDOW_MS: 15 * 60 * 1000,
  BLOCK_DURATION_MS: 60 * 60 * 1000,
  MAX_DAILY_ATTEMPTS: 10,
};

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function getClientIP(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIP = req.headers.get("x-real-ip");
  const connectingIP = req.headers.get("x-connecting-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return realIP || connectingIP || "unknown";
}

export function checkRateLimit(ip: string): {
  allowed: boolean;
  reason?: string;
  retryAfter?: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    rateLimitStore.set(ip, {
      attempts: 1,
      lastAttempt: now,
    });
    return { allowed: true };
  }

  if (entry.blockedUntil && entry.blockedUntil > now) {
    return {
      allowed: false,
      reason: "IP temporarily blocked",
      retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
    };
  }

  if (entry.blockedUntil && entry.blockedUntil <= now) {
    entry.attempts = 1;
    entry.lastAttempt = now;
    delete entry.blockedUntil;
    rateLimitStore.set(ip, entry);
    return { allowed: true };
  }

  const isWithinWindow = now - entry.lastAttempt < RATE_LIMITS.WINDOW_MS;

  if (isWithinWindow) {
    entry.attempts++;
    entry.lastAttempt = now;

    if (entry.attempts >= RATE_LIMITS.SECRET_CODE_ATTEMPTS) {
      entry.blockedUntil = now + RATE_LIMITS.BLOCK_DURATION_MS;
      suspiciousIPs.add(ip);

      console.log(
        `🚨 SECURITY ALERT: IP ${ip} blocked after ${entry.attempts} failed attempts`
      );

      return {
        allowed: false,
        reason: "Too many attempts",
        retryAfter: Math.ceil(RATE_LIMITS.BLOCK_DURATION_MS / 1000),
      };
    }
  } else {
    entry.attempts = 1;
    entry.lastAttempt = now;
  }

  rateLimitStore.set(ip, entry);
  return { allowed: true };
}

export function logSecurityEvent(
  event: string,
  ip: string,
  details?: { userAgent?: string; [key: string]: unknown }
): void {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    ip,
    details,
    userAgent: details?.userAgent || "unknown",
  };

  console.log(`🔒 SECURITY LOG: ${JSON.stringify(logEntry)}`);

  if (event === "FAILED_SECRET_ATTEMPT") {
    suspiciousIPs.add(ip);
  }
}

export function isIPSuspicious(ip: string): boolean {
  return suspiciousIPs.has(ip);
}

export function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);

  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function validateSecretCodeInput(secretCode: string): {
  isValid: boolean;
  reason?: string;
} {
  if (!secretCode || typeof secretCode !== "string") {
    return { isValid: false, reason: "Invalid input format" };
  }

  if (secretCode.length < 6 || secretCode.length > 100) {
    return { isValid: false, reason: "Invalid input length" };
  }

  if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(secretCode)) {
    return { isValid: false, reason: "Invalid characters detected" };
  }

  return { isValid: true };
}

setInterval(() => {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  for (const [ip, entry] of rateLimitStore.entries()) {
    if (
      entry.lastAttempt < oneHourAgo &&
      (!entry.blockedUntil || entry.blockedUntil < now)
    ) {
      rateLimitStore.delete(ip);
    }
  }
}, 30 * 60 * 1000);
