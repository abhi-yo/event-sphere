import { NextResponse } from "next/server";
import {
  checkRateLimit,
  generateSecureToken,
  getClientIP,
  logSecurityEvent,
  addSecurityHeaders,
  validateSecretCodeInput,
} from "@/lib/security-utils";

export async function POST(req: Request) {
  const ip = getClientIP(req);
  const userAgent = req.headers.get("user-agent") || "unknown";

  try {
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      logSecurityEvent("RATE_LIMIT_EXCEEDED", ip, {
        userAgent,
        reason: rateCheck.reason,
      });

      const response = NextResponse.json(
        {
          error: "Too many attempts. Please try again later.",
          retryAfter: rateCheck.retryAfter,
        },
        { status: 429 }
      );

      return addSecurityHeaders(response);
    }

    const { secretCode } = await req.json();

    const inputValidation = validateSecretCodeInput(secretCode);
    if (!inputValidation.isValid) {
      logSecurityEvent("INVALID_SECRET_INPUT", ip, {
        userAgent,
        reason: inputValidation.reason,
      });

      const response = NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );

      return addSecurityHeaders(response);
    }

    if (secretCode !== process.env.ADMIN_SECRET) {
      logSecurityEvent("FAILED_SECRET_ATTEMPT", ip, {
        userAgent,
        timestamp: new Date().toISOString(),
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = NextResponse.json(
        { error: "Access denied" },
        { status: 401 }
      );

      return addSecurityHeaders(response);
    }

    const token = generateSecureToken();

    logSecurityEvent("SUCCESSFUL_SECRET_ACCESS", ip, {
      userAgent,
      timestamp: new Date().toISOString(),
    });

    const response = NextResponse.json({
      message: "Access granted",
      accessToken: token,
    });

    response.cookies.set("admin-access-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 2,
      path: "/admin-portal",
    });

    return addSecurityHeaders(response);
  } catch (error) {
    logSecurityEvent("SECRET_VALIDATION_ERROR", ip, {
      userAgent,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    console.error("Admin secret validation error:", error);

    const response = NextResponse.json(
      { error: "System error occurred" },
      { status: 500 }
    );

    return addSecurityHeaders(response);
  }
}

export async function GET(req: Request) {
  const ip = getClientIP(req);

  try {
    const token = req.headers
      .get("cookie")
      ?.split("admin-access-token=")[1]
      ?.split(";")[0];

    if (!token) {
      const response = NextResponse.json(
        { error: "No access token" },
        { status: 401 }
      );
      return addSecurityHeaders(response);
    }

    const response = NextResponse.json({ message: "Token valid" });
    return addSecurityHeaders(response);
  } catch (error) {
    logSecurityEvent("TOKEN_VALIDATION_ERROR", ip, {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    const response = NextResponse.json(
      { error: "Token validation failed" },
      { status: 401 }
    );

    return addSecurityHeaders(response);
  }
}
