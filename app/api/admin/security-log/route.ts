import { NextResponse } from "next/server";
import { addSecurityHeaders } from "@/lib/security-utils";

interface SecurityLog {
  timestamp: string;
  event?: string;
  ip?: string;
  details?: { userAgent?: string; [key: string]: unknown };
  message?: string;
  type?: string;
}

const securityLogs: SecurityLog[] = [];

const originalConsoleLog = console.log;
console.log = (...args) => {
  const message = args.join(" ");
  if (
    message.includes("🔒 SECURITY LOG:") ||
    message.includes("🚨 SECURITY ALERT:")
  ) {
    try {
      const logData = message.includes("🔒 SECURITY LOG:")
        ? JSON.parse(message.split("🔒 SECURITY LOG: ")[1])
        : { message: message, timestamp: new Date().toISOString() };

      securityLogs.push(logData);

      if (securityLogs.length > 100) {
        securityLogs.shift();
      }
    } catch (e) {
      securityLogs.push({
        timestamp: new Date().toISOString(),
        message: message,
        type: "security_alert",
      });
    }
  }
  originalConsoleLog(...args);
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const adminSecret = url.searchParams.get("adminSecret");

    if (adminSecret !== process.env.ADMIN_SECRET) {
      const response = NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
      return addSecurityHeaders(response);
    }

    const limit = parseInt(url.searchParams.get("limit") || "50");
    const recentLogs = securityLogs.slice(-limit).reverse();

    const stats = {
      totalLogs: securityLogs.length,
      recentFailures: securityLogs.filter(
        (log) =>
          log.event === "FAILED_SECRET_ATTEMPT" &&
          new Date(log.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
      ).length,
      uniqueIPs: [...new Set(securityLogs.map((log) => log.ip))].length,
      lastHourActivity: securityLogs.filter(
        (log) => new Date(log.timestamp).getTime() > Date.now() - 60 * 60 * 1000
      ).length,
    };

    const response = NextResponse.json({
      message: "Security logs retrieved",
      stats,
      logs: recentLogs,
    });

    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Security log retrieval error:", error);
    const response = NextResponse.json(
      { error: "Failed to retrieve security logs" },
      { status: 500 }
    );
    return addSecurityHeaders(response);
  }
}
