"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

export default function AdminPortalPage() {
  const [secretCode, setSecretCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [secretError, setSecretError] = useState("");
  const [isSecretValidated, setIsSecretValidated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkExistingAccess();
  }, []);

  const checkExistingAccess = async () => {
    try {
      const response = await fetch("/api/admin/validate-secret");
      if (response.ok) {
        setIsSecretValidated(true);
      }
    } catch (error) {
      console.error("Access check failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecretSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecretError("");
    setIsValidating(true);

    if (!secretCode.trim()) {
      setSecretError("Secret code is required");
      setIsValidating(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/validate-secret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secretCode }),
      });

      if (response.ok) {
        setIsSecretValidated(true);
        setSecretCode("");
      } else if (response.status === 429) {
        const data = await response.json();
        const retryAfter = data.retryAfter
          ? Math.ceil(data.retryAfter / 60)
          : 5;
        setSecretError(
          `Too many failed attempts. Please wait ${retryAfter} minutes before trying again.`
        );
        setSecretCode("");
      } else {
        const data = await response.json();
        setSecretError(data.error || "Access denied");
        setSecretCode("");
      }
    } catch (error) {
      setSecretError("Failed to validate secret code");
      setSecretCode("");
    } finally {
      setIsValidating(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <div className="text-xl text-purple-700 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isSecretValidated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
        <div className="px-8 py-8 text-center bg-white shadow-2xl border border-purple-200 rounded-2xl max-w-md w-full mx-4">
          <div className="mb-8">
            <div className="text-purple-600 text-6xl mb-4">🔒</div>
            <h3 className="text-3xl font-bold text-purple-800 mb-2">
              Admin Portal
            </h3>
            <p className="text-purple-600 text-sm">
              Administrator Authorization Required
            </p>
          </div>

          <form onSubmit={handleSecretSubmit} className="space-y-6">
            {secretError && (
              <div className="text-purple-700 text-sm p-3 bg-purple-50 rounded-lg border border-purple-200">
                {secretError}
              </div>
            )}

            <div>
              <label className="block text-purple-700 text-sm font-medium mb-2">
                Enter Admin Secret Code
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-white text-purple-800 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono tracking-wider text-center transition-all duration-200"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                required
                disabled={isValidating}
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <button
              className="w-full px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-all duration-200 font-medium tracking-wide disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              type="submit"
              disabled={isValidating}
            >
              {isValidating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Validating...</span>
                </div>
              ) : (
                "Authenticate"
              )}
            </button>
          </form>

          <div className="mt-6 text-xs text-purple-500">
            🛡️ Unauthorized access attempts are logged and monitored
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="px-8 py-8 text-left bg-white shadow-2xl rounded-2xl border border-purple-200 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="text-purple-600 text-5xl mb-3">✓</div>
          <h3 className="text-3xl font-bold text-purple-800 mb-2">
            Welcome, Admin
          </h3>
          <p className="text-purple-600 text-sm">
            Authorized Administrator Login
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-6">
          {error && (
            <div className="text-purple-700 text-sm p-3 bg-purple-50 rounded-lg border border-purple-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                className="block font-medium text-purple-700 mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium text-purple-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            className="w-full px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            type="submit"
          >
            Access Admin Portal
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-purple-500">
          🔐 Secured with multi-layer authentication
        </div>
      </div>
    </div>
  );
}
