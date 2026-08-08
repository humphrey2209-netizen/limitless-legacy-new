"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle, Lock, Mail, Shield, User } from "lucide-react";

import { authClient } from "@/server/better-auth/client";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/admin";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGithubSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: redirectTo,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to sign in with GitHub";
      setError(msg);
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

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-[rgba(18,58,90,0.12)] bg-white p-8 shadow-xl">
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
            {mode === "signin"
              ? "Sign in to Limitless Legacy"
              : "Create your Account"}
          </h1>
          <p className="mt-1 text-xs font-medium text-[rgba(23,50,74,0.7)]">
            Access the admin dashboard and site management tools
          </p>
        </div>

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

        <div className="mt-6">
          <button
            type="button"
            onClick={handleGithubSignIn}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[rgba(18,58,90,0.18)] bg-white px-4 py-2.5 text-sm font-bold text-[var(--navy)] transition hover:border-[var(--teal)] hover:bg-[#FAF7F0] disabled:opacity-50"
          >
            <GithubIcon className="h-4 w-4 text-[var(--navy)]" />
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-[rgba(18,58,90,0.1)]" />
          <span className="absolute bg-white px-3 text-[11px] font-extrabold tracking-wider text-[rgba(18,58,90,0.5)] uppercase">
            Or with email
          </span>
        </div>

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
