"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Lock,
  Mail,
  Send,
  Shield,
  Sparkles,
  User,
} from "lucide-react";

import { authClient } from "@/server/better-auth/client";

type AuthTab = "magic" | "password";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/admin";

  const [tab, setTab] = useState<AuthTab>("magic");
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // Magic link state
  const [magicEmail, setMagicEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  // Password state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { data: session, isPending: sessionPending } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      router.replace("/");
      router.refresh();
    }
  }, [session, router]);

  if (sessionPending || session?.user) {
    return null;
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authClient.signIn.magicLink({
        email: magicEmail,
        callbackURL: redirectTo,
      });
      if (res?.error) {
        setError(res.error.message ?? "Failed to send magic link");
      } else {
        setMagicSent(true);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to send magic link";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "signin") {
        const res = await authClient.signIn.email({
          email,
          password,
          callbackURL: redirectTo,
        });

        if (res?.error) {
          setError(res.error.message ?? "Invalid email or password");
        } else {
          router.push(redirectTo);
          router.refresh();
        }
      } else {
        const res = await authClient.signUp.email({
          email,
          password,
          name: name.trim() !== "" ? name : (email.split("@")[0] ?? "User"),
          callbackURL: redirectTo,
        });

        if (res?.error) {
          setError(res.error.message ?? "Registration failed");
        } else {
          setSuccess("Account created successfully! Redirecting...");
          setTimeout(() => {
            router.push(redirectTo);
            router.refresh();
          }, 1000);
        }
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Authentication error occurred";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (next: AuthTab) => {
    setTab(next);
    setError(null);
    setSuccess(null);
    setMagicSent(false);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-[rgba(18,58,90,0.12)] bg-white p-8 shadow-xl">
        {/* Logo */}
        <div className="text-center">
          <Link
            href="/"
            className="text-decoration-none inline-flex items-center gap-2"
          >
            <Image
              src="/logo.jpeg"
              alt="Limitless Legacy Logo"
              width={48}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[var(--navy)]">
            Sign in to Limitless Legacy
          </h1>
          <p className="mt-1 text-xs font-medium text-[rgba(23,50,74,0.7)]">
            Access the admin dashboard and site management tools
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            <Shield className="h-4 w-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-[rgba(18,58,90,0.1)]" />
          <span className="absolute bg-white px-3 text-[11px] font-extrabold tracking-wider text-[rgba(18,58,90,0.5)] uppercase">
            Continue with email
          </span>
        </div>

        {/* Tab switcher */}
        <div className="mb-5 flex rounded-xl border border-[rgba(18,58,90,0.12)] bg-[#FAF7F0] p-1">
          <button
            type="button"
            onClick={() => switchTab("magic")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
              tab === "magic"
                ? "bg-white text-[var(--navy)] shadow-sm"
                : "text-[rgba(23,50,74,0.55)] hover:text-[var(--navy)]"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Magic Link
          </button>
          <button
            type="button"
            onClick={() => switchTab("password")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
              tab === "password"
                ? "bg-white text-[var(--navy)] shadow-sm"
                : "text-[rgba(23,50,74,0.55)] hover:text-[var(--navy)]"
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            Password
          </button>
        </div>

        {/* ── Magic Link Tab ── */}
        {tab === "magic" && (
          <>
            {magicSent ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-[rgba(79,175,168,0.25)] bg-[rgba(79,175,168,0.06)] px-6 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(79,175,168,0.15)]">
                  <Send className="h-5 w-5 text-[var(--teal)]" />
                </div>
                <p className="text-sm font-extrabold text-[var(--navy)]">
                  Check your inbox!
                </p>
                <p className="text-xs leading-relaxed font-medium text-[rgba(23,50,74,0.7)]">
                  We sent a sign-in link to{" "}
                  <span className="font-bold text-[var(--navy)]">
                    {magicEmail}
                  </span>
                  . It expires in 10 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMagicSent(false);
                    setMagicEmail("");
                    setError(null);
                  }}
                  className="mt-1 text-xs font-bold text-[var(--teal)] hover:underline"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-[var(--navy)]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[rgba(18,58,90,0.4)]" />
                    <input
                      type="email"
                      required
                      value={magicEmail}
                      onChange={(e) => setMagicEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0]/50 py-2.5 pr-3 pl-9 text-sm font-medium text-[var(--navy)] focus:border-[var(--teal)] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--teal)] py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-[var(--teal)]/90 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {loading ? "Sending link..." : "Send Magic Link"}
                </button>
                <p className="text-center text-[11px] font-medium text-[rgba(23,50,74,0.55)]">
                  No password needed — we&apos;ll email you a secure sign-in
                  link.
                </p>
              </form>
            )}
          </>
        )}

        {/* ── Password Tab ── */}
        {tab === "password" && (
          <>
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="mb-1 block text-xs font-bold text-[var(--navy)]">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[rgba(18,58,90,0.4)]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0]/50 py-2.5 pr-3 pl-9 text-sm font-medium text-[var(--navy)] focus:border-[var(--teal)] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-bold text-[var(--navy)]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[rgba(18,58,90,0.4)]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0]/50 py-2.5 pr-3 pl-9 text-sm font-medium text-[var(--navy)] focus:border-[var(--teal)] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[var(--navy)]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[rgba(18,58,90,0.4)]" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[rgba(18,58,90,0.15)] bg-[#FAF7F0]/50 py-2.5 pr-3 pl-9 text-sm font-medium text-[var(--navy)] focus:border-[var(--teal)] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[var(--navy)] py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-[var(--navy)]/90 disabled:opacity-50"
              >
                {loading
                  ? "Authenticating..."
                  : mode === "signin"
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs">
              {mode === "signin" ? (
                <p className="font-medium text-[rgba(23,50,74,0.7)]">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setError(null);
                    }}
                    className="font-bold text-[var(--teal)] hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="font-medium text-[rgba(23,50,74,0.7)]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setError(null);
                    }}
                    className="font-bold text-[var(--teal)] hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--navy)] transition hover:text-[var(--teal)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Public Website
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F0] p-4">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--teal)] border-t-transparent" />
            <span className="mt-3 text-xs font-bold text-[var(--navy)]">
              Loading login portal...
            </span>
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </main>
  );
}
