"use client";

import { useEffect, useState } from "react";

const ADMIN_EMAIL = "hello.limitlesslegacy@gmail.com";
const ADMIN_PASSWORD = "limitlesslegacy#1";
const STORAGE_KEY = "limitlessLegacyAdminContentV1";
const AUTH_KEY = "limitlessLegacyAdminAuthV1";

const defaultContent = {
  brandName: "Limitless Legacy",
  heroHeadline: "Personalized Learning Support Designed for Every Child",
  heroDescription:
    "Personalized learning plans, educational activities, and parent support tools created to help children build confidence, strengthen skills, and reach their potential.",
  aboutSummary:
    "Limitless Legacy creates accessible learning opportunities and practical tools for families and educators while honoring every learner’s unique path.",
  footerDescription:
    "Inclusive learning support for children, families, and educators.",
  contactEmail: "hello.limitlesslegacy@gmail.com",
  starterPackage: [
    "Best for families who want a simple starting point with practical ideas and low-pressure next steps.",
    "Supportive learning recommendations",
    "Simple home practice ideas",
    "Parent-friendly next steps",
  ].join("\n"),
  premiumPackage: [
    "Best for families who want more personalized direction and a stronger support framework.",
    "Deeper learning guidance",
    "Custom activity suggestions",
    "Expanded parent support",
  ].join("\n"),
  monthlyPackage: [
    "Best for families who want ongoing support, routine check-ins, and continued encouragement.",
    "Ongoing resource suggestions",
    "Fresh learning ideas each month",
    "Steady support and guidance",
  ].join("\n"),
  assessmentDisclaimer:
    "This assessment is designed to help families identify supportive learning resources that may benefit their child. It does not diagnose disabilities or replace professional assessments. Every child learns differently, and this tool helps connect families with appropriate support options.",
  resources: [
    "E-book: Helping a Child Who Is Uninterested, Inattentive, or Hyperactive",
    "Reading Confidence at Home",
    "Focus & Routine Toolkit",
    "Social Stories & Communication Starters",
    "Calm Moments & Emotional Regulation Guide",
    "Visual Supports & Structured Learning Guide",
  ].join("\n"),
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [content, setContent] = useState(defaultContent);
  const [saveStatus, setSaveStatus] = useState({ message: "", type: "" });

  useEffect(() => {
    try {
      const authSaved = localStorage.getItem(AUTH_KEY) === "true";
      setIsLoggedIn(authSaved);
      const savedRaw = localStorage.getItem(STORAGE_KEY);
      const savedContent = savedRaw
        ? (JSON.parse(savedRaw) as Partial<typeof defaultContent>)
        : {};
      setContent({ ...defaultContent, ...savedContent });
    } catch {
      setContent(defaultContent);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      loginForm.email.trim() === ADMIN_EMAIL &&
      loginForm.password === ADMIN_PASSWORD
    ) {
      localStorage.setItem(AUTH_KEY, "true");
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials.");
    }
  };

  const handleLogout = () => {
    localStorage.setItem(AUTH_KEY, "false");
    setIsLoggedIn(false);
  };

  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    setSaveStatus({
      message: "Changes saved locally in this browser.",
      type: "success",
    });
  };

  const handleResetDefaults = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultContent));
    setContent(defaultContent);
    setSaveStatus({ message: "Defaults restored.", type: "success" });
  };

  return (
    <section className="section">
      <div className="container admin-page">
        <div className="page-intro">
          <p className="eyebrow">Admin</p>
          <h1>Site administration</h1>
          <p className="lead">
            Use this local admin dashboard to update homepage copy, package
            details, and resource library items. Changes are saved in your browser
            only.
          </p>
        </div>

        {!isLoggedIn ? (
          <section className="card admin-card">
            <h2>Sign in</h2>
            <p className="admin-note">
              Default local login: hello.limitlesslegacy@gmail.com /
              limitlesslegacy#1
            </p>
            <form onSubmit={handleLoginSubmit} className="admin-form">
              <label>
                Email address
                <input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  required
                />
              </label>
              <button className="btn btn-primary" type="submit">
                Log in
              </button>
              {loginError && (
                <p className="form-status error" aria-live="polite">
                  {loginError}
                </p>
              )}
            </form>
          </section>
        ) : (
          <section className="card admin-card">
            <div className="admin-header">
              <div>
                <h2>Content editor</h2>
                <p className="admin-note">
                  Edit the public-facing copy for the site. Use one line per item in
                  the list fields.
                </p>
              </div>
              <button
                className="btn btn-tertiary"
                onClick={handleLogout}
                type="button"
              >
                Log out
              </button>
            </div>

            <form onSubmit={handleContentSubmit} className="admin-form">
              <div className="admin-grid">
                <label>
                  Brand name
                  <input
                    type="text"
                    value={content.brandName}
                    onChange={(e) =>
                      setContent({ ...content, brandName: e.target.value })
                    }
                  />
                </label>
                <label>
                  Hero headline
                  <textarea
                    rows={3}
                    value={content.heroHeadline}
                    onChange={(e) =>
                      setContent({ ...content, heroHeadline: e.target.value })
                    }
                  />
                </label>
                <label>
                  Hero description
                  <textarea
                    rows={3}
                    value={content.heroDescription}
                    onChange={(e) =>
                      setContent({ ...content, heroDescription: e.target.value })
                    }
                  />
                </label>
                <label>
                  About summary
                  <textarea
                    rows={4}
                    value={content.aboutSummary}
                    onChange={(e) =>
                      setContent({ ...content, aboutSummary: e.target.value })
                    }
                  />
                </label>
                <label>
                  Footer description
                  <textarea
                    rows={3}
                    value={content.footerDescription}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footerDescription: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Contact email
                  <input
                    type="email"
                    value={content.contactEmail}
                    onChange={(e) =>
                      setContent({ ...content, contactEmail: e.target.value })
                    }
                  />
                </label>
              </div>

              <div className="admin-grid two-column">
                <label>
                  Starter package description
                  <textarea
                    rows={6}
                    value={content.starterPackage}
                    onChange={(e) =>
                      setContent({ ...content, starterPackage: e.target.value })
                    }
                  />
                </label>
                <label>
                  Premium package description
                  <textarea
                    rows={6}
                    value={content.premiumPackage}
                    onChange={(e) =>
                      setContent({ ...content, premiumPackage: e.target.value })
                    }
                  />
                </label>
                <label>
                  Monthly support package description
                  <textarea
                    rows={6}
                    value={content.monthlyPackage}
                    onChange={(e) =>
                      setContent({ ...content, monthlyPackage: e.target.value })
                    }
                  />
                </label>
                <label>
                  Assessment disclaimer
                  <textarea
                    rows={6}
                    value={content.assessmentDisclaimer}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        assessmentDisclaimer: e.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <label>
                Resource library titles
                <textarea
                  rows={10}
                  value={content.resources}
                  onChange={(e) =>
                    setContent({ ...content, resources: e.target.value })
                  }
                />
              </label>

              <div className="admin-actions">
                <button className="btn btn-primary" type="submit">
                  Save changes
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleResetDefaults}
                  type="button"
                >
                  Reset defaults
                </button>
              </div>
              {saveStatus.message && (
                <p
                  className={`form-status ${
                    saveStatus.type === "success" ? "success" : "error"
                  }`}
                  aria-live="polite"
                >
                  {saveStatus.message}
                </p>
              )}
            </form>
          </section>
        )}
      </div>
    </section>
  );
}
