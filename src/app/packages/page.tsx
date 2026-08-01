import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Packages | Limitless Legacy",
  description:
    "Starter, premium, and monthly support packages with downloadable resource library.",
};

const packages = [
  {
    eyebrow: "Starter Package",
    title: "Starter Package",
    description:
      "Best for families who want a simple starting point with practical ideas and low-pressure next steps.",
    bullets: [
      "Supportive learning recommendations",
      "Simple home practice ideas",
      "Parent-friendly next steps",
    ],
    accent: false,
  },
  {
    eyebrow: "Premium Package",
    title: "Premium Package",
    description:
      "Best for families who want more personalized direction and a stronger support framework.",
    bullets: [
      "Deeper learning guidance",
      "Custom activity suggestions",
      "Expanded parent support",
    ],
    accent: true,
  },
  {
    eyebrow: "Monthly Support Package",
    title: "Monthly Support Package",
    description:
      "Best for families who want ongoing support, routine check-ins, and continued encouragement.",
    bullets: [
      "Ongoing resource suggestions",
      "Fresh learning ideas each month",
      "Steady support and guidance",
    ],
    accent: false,
  },
];

const resources = [
  {
    title: "E-book: Helping a Child Who Is Uninterested, Inattentive, or Hyperactive",
    description:
      "Supportive ideas for families navigating attention and engagement concerns.",
  },
  {
    title: "Reading Confidence at Home",
    description:
      "Practical ways to build stronger reading habits and confidence.",
  },
  {
    title: "Focus & Routine Toolkit",
    description:
      "Simple tools for structure, task follow-through, and steadier routines.",
  },
  {
    title: "Social Stories & Communication Starters",
    description:
      "Helpful supports for social understanding, language, and everyday interactions.",
  },
  {
    title: "Calm Moments & Emotional Regulation Guide",
    description:
      "Gentle strategies for big feelings, self-regulation, and recovery.",
  },
  {
    title: "Visual Supports & Structured Learning Guide",
    description:
      "Clear visual tools and organization ideas for consistent learning support.",
  },
];

export default function PackagesPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="page-intro">
          <p className="eyebrow">Packages</p>
          <h1>Flexible support options for different family needs</h1>
          <p className="lead">
            Pricing cards currently use placeholders. Each plan includes a future
            Payhip purchase link field once payment links are available.
          </p>
        </div>

        <div className="cards-grid three-up">
          {packages.map((pkg) => (
            <article
              key={pkg.title}
              className={`card price-card ${pkg.accent ? "accent-card" : ""}`}
            >
              <p className="eyebrow">{pkg.eyebrow}</p>
              <h3>{pkg.title}</h3>
              <p>{pkg.description}</p>
              <ul className="bullet-list">
                {pkg.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <Link className="btn btn-primary" href="/contact">
                Purchase link coming soon
              </Link>
            </article>
          ))}
        </div>

        <section className="section resource-section">
          <div className="section-heading">
            <p className="eyebrow">Resource library</p>
            <h2>Downloadable resources to support home learning</h2>
          </div>
          <div className="cards-grid two-column">
            {resources.map((item) => (
              <article key={item.title} className="card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
