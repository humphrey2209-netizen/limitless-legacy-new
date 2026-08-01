import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Limitless Legacy",
  description: "Practical, personalized learning support for every next step.",
};

const services = [
  {
    title: "Reading Success Package",
    description:
      "Personalized reading activities, phonics and comprehension support, home reading strategies, progress tracking suggestions.",
  },
  {
    title: "Learning Support Package",
    description:
      "Skill-building exercises, parent recommendations, learning routines.",
  },
  {
    title: "Parent Coaching Package",
    description:
      "Home learning ideas, behavior support strategies, daily routines, confidence-building activities.",
  },
  {
    title: "Homework Helper",
    description:
      "Concept explanations, examples, independent learning support.",
  },
  {
    title: "Study Success Package",
    description:
      "Personalized study plans, practice activities, learning strategies.",
  },
  {
    title: "Autism Learning Support",
    description:
      "Visual schedules, social stories, routine supports, learning activities.",
  },
  {
    title: "Dyslexia Reading Support",
    description:
      "Phonics activities, decoding practice, reading fluency support.",
  },
  {
    title: "ADHD Learning Support",
    description:
      "Organization strategies, focus activities, study routines.",
  },
];

export default function ServicesPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="page-intro">
          <p className="eyebrow">Services</p>
          <h1>Practical, personalized learning support for every next step.</h1>
          <p className="lead">
            Choose the support path that best matches a child’s needs, routines,
            and confidence-building goals.
          </p>
        </div>

        <div className="cards-grid two-column service-grid">
          {services.map((service) => (
            <article key={service.title} className="card feature-card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
