"use client";

import { api } from "@/trpc/react";

export default function AboutPage() {
  const { data: contentData } = api.content.getAll.useQuery();

  const brandName = contentData?.map?.brandName ?? "Limitless Legacy";
  const aboutSummary =
    contentData?.map?.aboutSummary ??
    `${brandName} creates accessible learning opportunities and practical tools for families and educators while honoring every learner’s unique path.`;

  return (
    <section className="section">
      <div className="container">
        <div className="page-intro">
          <p className="eyebrow">About</p>
          <h1>Educator-led, inclusive, practical, and child-centered support.</h1>
          <p className="lead">{aboutSummary}</p>
        </div>

        <div className="cards-grid three-up">
          <article className="card feature-card">
            <h3>Educator-led guidance</h3>
            <p>
              Support ideas are grounded in real-world learning experience and
              practical classroom-informed thinking.
            </p>
          </article>
          <article className="card feature-card">
            <h3>Inclusive by design</h3>
            <p>
              We focus on supportive resources that respect different learning
              needs, strengths, and family routines.
            </p>
          </article>
          <article className="card feature-card">
            <h3>Practical next steps</h3>
            <p>
              Families receive clear, manageable tools that help them move
              forward without feeling overwhelmed.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
