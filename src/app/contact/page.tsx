"use client";

import { useState } from "react";

import { api } from "@/trpc/react";

export default function ContactPage() {
  const { data: contentData } = api.content.getAll.useQuery();

  const brandName = contentData?.map?.brandName ?? "Limitless Legacy";
  const contactEmail =
    contentData?.map?.contactEmail ?? "hello.limitlesslegacy@gmail.com";

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<{
    message: string;
    type: "success" | "error" | "";
  }>({ message: "", type: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({
        message: "Please complete all fields before sending.",
        type: "error",
      });
      return;
    }

    setStatus({
      message:
        "Thank you! Your message has been received.",
      type: "success",
    });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="section">
      <div className="container">
        <div className="page-intro">
          <p className="eyebrow">Contact</p>
          <h1>Reach out for support, questions, or next steps.</h1>
          <p className="lead">
            Send a message if you would like help choosing a package,
            understanding the assessment, or learning more about available
            resources.
          </p>
        </div>

        <div className="contact-layout">
          <form className="card contact-form" onSubmit={handleSubmit} noValidate>
            <label>
              Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                required
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              Send Message
              <textarea
                name="message"
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us what support you need and how we can help."
                required
              />
            </label>
            <p className="privacy-note">
              By sending this message, you agree to be contacted about your request.
            </p>
            <button className="btn btn-primary" type="submit">
              Send Message
            </button>
            {status.message && (
              <p
                className={`form-status ${
                  status.type === "success" ? "success" : "error"
                }`}
                aria-live="polite"
              >
                {status.message}
              </p>
            )}
          </form>

          <aside className="card feature-card">
            <p className="eyebrow">What to include</p>
            <h3>Helpful details</h3>
            <ul className="bullet-list">
              <li>The child’s age or grade</li>
              <li>The support area you want to focus on</li>
              <li>Any learning goals or concerns</li>
            </ul>
            <p className="mt-4">
              <strong>Email:</strong> {contactEmail}
            </p>
            <p>
              <strong>Brand:</strong> {brandName}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
