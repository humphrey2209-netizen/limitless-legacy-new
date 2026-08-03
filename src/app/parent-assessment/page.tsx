"use client";

import { useState } from "react";

import { api } from "@/trpc/react";

interface AssessmentAnswers {
  age?: string;
  grade?: string;
  supportAreas?: string[];
  challenges?: string[];
  preferences?: string[];
  goals?: string[];
}

type CheckboxStepName = keyof Omit<AssessmentAnswers, "age" | "grade">;

interface ContextStep {
  title: string;
  subtitle: string;
  type: "context";
  name?: never;
  options?: never;
}

interface CheckboxStep {
  title: string;
  subtitle: string;
  type: "checkbox";
  name: CheckboxStepName;
  options: string[];
}

type Step = ContextStep | CheckboxStep;

const steps: Step[] = [
  {
    title: "Child context",
    subtitle:
      "Tell us a little about your child so the recommendations can be age-appropriate.",
    type: "context",
  },
  {
    title: "Support areas",
    subtitle:
      "Choose the learning support areas that feel most relevant right now.",
    type: "checkbox",
    name: "supportAreas",
    options: [
      "Reading & Literacy Support",
      "Concentration & Focus Support",
      "Social Skills Support",
      "Behavior & Emotional Support",
      "Learning Differences Support",
    ],
  },
  {
    title: "Grouped challenge selection",
    subtitle:
      "Select the challenge group or groups that best describe what your child needs help with.",
    type: "checkbox",
    name: "challenges",
    options: [
      "Reading and comprehension challenges",
      "Focus, attention, and task follow-through challenges",
      "Social interaction and communication challenges",
      "Behavior, emotions, and routines challenges",
      "Learning differences and structured support challenges",
    ],
  },
  {
    title: "Learning preferences",
    subtitle: "Select the ways your child learns best.",
    type: "checkbox",
    name: "preferences",
    options: [
      "Visual supports",
      "Hands-on activities",
      "Movement activities",
      "Listening activities",
      "Short structured activities",
      "Repetition and practice",
      "Games and interactive learning",
    ],
  },
  {
    title: "Goals",
    subtitle: "Choose the outcomes that matter most right now.",
    type: "checkbox",
    name: "goals",
    options: [
      "Become a stronger reader",
      "Improve focus and independence",
      "Develop better social skills",
      "Manage emotions and behavior",
      "Build confidence",
      "Develop skills needed for school success",
    ],
  },
];

const ageOptions = ["3–5 years", "6–8 years", "9–12 years", "13+ years"];
const gradeOptions = [
  "Preschool",
  "Kindergarten",
  "Grade 1–2",
  "Grade 3–5",
  "Grade 6+",
];

export default function ParentAssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    supportAreas: [],
    challenges: [],
    preferences: [],
    goals: [],
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const submitMutation = api.assessment.submit.useMutation();

  const isStepValid = () => {
    if (currentStep === 0) {
      return Boolean(answers.age && answers.grade);
    }
    const step = steps[currentStep];
    if (step?.type === "checkbox") {
      const selections = answers[step.name];
      return Boolean(selections && selections.length > 0);
    }
    return false;
  };

  const handleCheckboxChange = (name: CheckboxStepName, value: string) => {
    const current = answers[name] ?? [];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    setAnswers({ ...answers, [name]: next });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
      submitMutation.mutate({
        childAge: answers.age,
        childGrade: answers.grade,
        supportAreas: answers.supportAreas ?? [],
        challenges: answers.challenges ?? [],
        preferences: answers.preferences ?? [],
        goals: answers.goals ?? [],
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({
      supportAreas: [],
      challenges: [],
      preferences: [],
      goals: [],
    });
    setIsCompleted(false);
  };

  const buildRecommendations = () => {
    const supportAreas = answers.supportAreas ?? [];
    const plans: { title: string; items: string[] }[] = [];
    const resources: { title: string; description: string }[] = [];

    if (supportAreas.includes("Reading & Literacy Support")) {
      plans.push({
        title: "Reading Success Plan",
        items: [
          "Personalized reading activities",
          "Phonics support",
          "Comprehension practice",
          "Confidence-building activities",
        ],
      });
      resources.push({
        title: "Reading Confidence at Home",
        description:
          "Practical ways to strengthen reading confidence and habits at home.",
      });
    }

    if (supportAreas.includes("Concentration & Focus Support")) {
      plans.push({
        title: "Focus & Learning Skills Plan",
        items: [
          "Focus-building activities",
          "Learning routines",
          "Organization strategies",
          "Task completion support",
        ],
      });
      resources.push({
        title: "Focus & Routine Toolkit",
        description:
          "Helpful structure, routines, and support for focus and follow-through.",
      });
      resources.push({
        title:
          "E-book: Helping a Child Who Is Uninterested, Inattentive, or Hyperactive",
        description:
          "Supportive guidance for families navigating attention and engagement needs.",
      });
    }

    if (supportAreas.includes("Social Skills Support")) {
      plans.push({
        title: "Social & Emotional Growth Plan",
        items: [
          "Social stories",
          "Emotion activities",
          "Communication strategies",
          "Confidence-building exercises",
        ],
      });
      resources.push({
        title: "Social Stories & Communication Starters",
        description:
          "Friendly tools for social understanding and everyday communication.",
      });
    }

    if (supportAreas.includes("Behavior & Emotional Support")) {
      plans.push({
        title: "Social & Emotional Growth Plan",
        items: [
          "Social stories",
          "Emotion activities",
          "Communication strategies",
          "Confidence-building exercises",
        ],
      });
      resources.push({
        title: "Calm Moments & Emotional Regulation Guide",
        description:
          "Gentle strategies for emotional regulation, recovery, and calm routines.",
      });
      resources.push({
        title:
          "E-book: Helping a Child Who Is Uninterested, Inattentive, or Hyperactive",
        description:
          "Supportive guidance for families navigating attention and engagement needs.",
      });
    }

    if (supportAreas.includes("Learning Differences Support")) {
      plans.push({
        title: "Neurodiverse Learning Support Plan",
        items: [
          "Autism-friendly resources",
          "ADHD support strategies",
          "Visual supports",
          "Structured learning activities",
        ],
      });
      resources.push({
        title: "Visual Supports & Structured Learning Guide",
        description:
          "Clear structure, visuals, and organized learning support for everyday use.",
      });
      resources.push({
        title:
          "E-book: Helping a Child Who Is Uninterested, Inattentive, or Hyperactive",
        description:
          "Supportive guidance for families navigating attention and engagement needs.",
      });
    }

    if (supportAreas.length > 1) {
      plans.push({
        title: "Complete Learning Support Package",
        items: [
          "Personalized learning plan",
          "Weekly activities",
          "Parent guidance",
          "Personalized learning resources",
        ],
      });
    }

    // Deduplicate plans and resources
    const uniquePlans: typeof plans = [];
    const seenPlanTitles = new Set<string>();
    plans.forEach((p) => {
      if (!seenPlanTitles.has(p.title)) {
        seenPlanTitles.add(p.title);
        uniquePlans.push(p);
      }
    });

    const uniqueResources: typeof resources = [];
    const seenResourceTitles = new Set<string>();
    resources.forEach((r) => {
      if (!seenResourceTitles.has(r.title)) {
        seenResourceTitles.add(r.title);
        uniqueResources.push(r);
      }
    });

    return { uniquePlans, uniqueResources };
  };

  const step = steps[currentStep] ?? steps[0];
  if (!step) return null;

  return (
    <section className="section">
      <div className="container assessment-layout">
        <div className="page-intro">
          <p className="eyebrow">Assessment</p>
          <h1>Parent Learning Support Assessment</h1>
          <p className="lead">
            This assessment is designed to help families identify supportive
            learning resources that may benefit their child. It does not diagnose
            disabilities or replace professional assessments. Every child learns
            differently, and this tool helps connect families with appropriate
            support options.
          </p>
        </div>

        <section className="card assessment-shell">
          <div className="assessment-header">
            <div>
              <p className="eyebrow">Step progress</p>
              <h2>Find a supportive learning path</h2>
            </div>
            <p className="step-indicator" aria-live="polite">
              {isCompleted
                ? "Assessment complete"
                : `Step ${currentStep + 1} of ${steps.length}`}
            </p>
          </div>

          <div className="assessment-disclaimer" role="note">
            <strong>Disclaimer:</strong> This assessment is designed to help
            families identify supportive learning resources that may benefit their
            child. It does not diagnose disabilities or replace professional
            assessments. Every child learns differently, and this tool helps
            connect families with appropriate support options.
          </div>

          {!isCompleted ? (
            <div className="assessment-screen">
              <div className="step-copy">
                <h3>{step.title}</h3>
                <p>{step.subtitle}</p>
              </div>

              {step.type === "context" ? (
                <>
                  <fieldset className="question-block">
                    <legend>Age</legend>
                    <div className="choice-grid choice-grid-single">
                      {ageOptions.map((opt) => (
                        <label key={opt} className="choice">
                          <input
                            type="radio"
                            name="age"
                            value={opt}
                            checked={answers.age === opt}
                            onChange={(e) =>
                              setAnswers({ ...answers, age: e.target.value })
                            }
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="question-block">
                    <legend>Grade</legend>
                    <div className="choice-grid choice-grid-single">
                      {gradeOptions.map((opt) => (
                        <label key={opt} className="choice">
                          <input
                            type="radio"
                            name="grade"
                            value={opt}
                            checked={answers.grade === opt}
                            onChange={(e) =>
                              setAnswers({ ...answers, grade: e.target.value })
                            }
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </>
              ) : (
                <fieldset className="question-block">
                  <legend>{step.title}</legend>
                  <div className="choice-grid">
                    {step.type === "checkbox" &&
                      step.options.map((opt) => {
                        const fieldName = step.name;
                        const selected = (answers[fieldName] ?? []).includes(
                          opt
                        );
                        return (
                          <label key={opt} className="choice">
                            <input
                              type="checkbox"
                              name={fieldName}
                              value={opt}
                              checked={selected}
                              onChange={() =>
                                handleCheckboxChange(fieldName, opt)
                              }
                            />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}
            </div>
          ) : (
            <div className="assessment-screen">
              <div className="step-copy">
                <h3>Your support recommendations</h3>
                <p>
                  Based on your selections, these resources and learning plans
                  may be a helpful next step.
                </p>
              </div>

              <div className="results-summary card-lite">
                <p>
                  <strong>Age:</strong> {answers.age ?? "Not selected"} ·{" "}
                  <strong>Grade:</strong> {answers.grade ?? "Not selected"}
                </p>
                <p>
                  <strong>Support areas:</strong>{" "}
                  {answers.supportAreas?.join(", ") ?? "Not selected"}
                </p>
                <p>
                  <strong>Goals:</strong>{" "}
                  {answers.goals?.join(", ") ?? "Not selected"}
                </p>
              </div>

              {(() => {
                const { uniquePlans, uniqueResources } = buildRecommendations();
                return (
                  <div className="results-grid">
                    {uniquePlans.map((plan) => (
                      <article key={plan.title} className="result-card">
                        <h4>{plan.title}</h4>
                        <ul>
                          {plan.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </article>
                    ))}
                    {uniqueResources.map((res) => (
                      <article
                        key={res.title}
                        className="result-card result-card-soft"
                      >
                        <h4>{res.title}</h4>
                        <p>{res.description}</p>
                      </article>
                    ))}
                  </div>
                );
              })()}

              <p className="result-note">
                This tool does not diagnose or judge a child based on selections.
                It simply helps connect families with supportive learning options.
              </p>
            </div>
          )}

          <div className="cta-row assessment-controls">
            {!isCompleted && (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  type="button"
                >
                  Back
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  type="button"
                >
                  {currentStep === steps.length - 1 ? "Finish" : "Next"}
                </button>
              </>
            )}
            <button
              className="btn btn-tertiary"
              onClick={handleRestart}
              type="button"
            >
              Restart
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}
