"use client";

import Link from "next/link";

import { api } from "@/trpc/react";

export default function Home() {
  const { data: contentData } = api.content.getAll.useQuery();

  const heroHeadline =
    contentData?.map?.heroHeadline ??
    "Personalized Learning Support Designed for Every Child";
  const heroDescription =
    contentData?.map?.heroDescription ??
    "Personalized learning plans, educational activities, and parent support tools created to help children build confidence, strengthen skills, and reach their potential.";

  return (
    <>
      <section className="hero section">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Inclusive learning support</p>
            <h1>{heroHeadline}</h1>
            <p className="lead">{heroDescription}</p>
            <div className="cta-row">
              <Link className="btn btn-primary" href="/packages">
                Explore Learning Packages
              </Link>
              <Link className="btn btn-secondary" href="/contact">
                Get Started
              </Link>
              <Link className="btn btn-tertiary" href="/parent-assessment">
                Find the Right Support
              </Link>
            </div>
          </div>
          <aside className="hero-panel card">
            <p className="eyebrow">Who we help</p>
            <h2>Support that meets children where they are</h2>
            <ul className="check-list">
              <li>
                <strong>Parents:</strong> personalized support strategies, home
                learning activities, and development guidance.
              </li>
              <li>
                <strong>Students:</strong> learning support, practice activities,
                homework assistance, and confidence-building tools.
              </li>
              <li>
                <strong>Students With Learning Differences:</strong> customized
                activities, learning strategies, visual supports, and resources.
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container split-card card accent-card">
          <div>
            <p className="eyebrow">Not sure where to begin?</p>
            <h2>
              Answer a few thoughtful questions to discover supportive learning
              resources that may fit your child’s needs.
            </h2>
          </div>
          <Link className="btn btn-primary" href="/parent-assessment">
            Start the Assessment
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">How we work</p>
            <h2>Practical, supportive guidance for families and educators</h2>
          </div>
          <div className="cards-grid three-up">
            <article className="card feature-card">
              <h3>Learning plans</h3>
              <p>
                Structured, child-centered plans that support progress without
                overwhelming families.
              </p>
            </article>
            <article className="card feature-card">
              <h3>Home activities</h3>
              <p>
                Simple, flexible practice ideas that fit into everyday routines and
                reinforce skills at home.
              </p>
            </article>
            <article className="card feature-card">
              <h3>Parent support</h3>
              <p>
                Clear next steps, coaching tools, and helpful strategies designed
                for real life.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
