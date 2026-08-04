"use client";

import Link from "next/link";
import { Download, ExternalLink, Package } from "lucide-react";

import { api } from "@/trpc/react";

function formatPrice(price: number | null | undefined, billingCycle: string | null | undefined) {
  if (price == null) return null;
  const dollarStr = `$${(price / 100).toFixed(2)}`;
  if (billingCycle === "monthly") return `${dollarStr} / month`;
  if (billingCycle === "yearly") return `${dollarStr} / year`;
  return `${dollarStr} one-time`;
}

export default function PackagesPage() {
  const { data: allPackages, isLoading: loadingPackages } = api.packages.getAll.useQuery();
  const { data: allResources, isLoading: loadingResources } = api.resources.getAll.useQuery();

  const activePackages = allPackages?.filter((p) => p.isActive) ?? [];
  // Resources has no isActive field – show all, sorted by displayOrder
  const activeResources = allResources ?? [];

  return (
    <section className="section">
      <div className="container">
        <div className="page-intro">
          <p className="eyebrow">Packages</p>
          <h1>Flexible support options for different family needs</h1>
          <p className="lead">
            Choose from custom learning packages and explore downloadable resources to support learning at home.
          </p>
        </div>

        {/* Packages Grid */}
        {loadingPackages ? (
          <div className="cards-grid three-up">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card price-card animate-pulse" style={{ minHeight: 220 }} />
            ))}
          </div>
        ) : activePackages.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
            <Package style={{ margin: "0 auto 0.5rem", opacity: 0.3 }} />
            <p><strong>No packages available at the moment.</strong></p>
            <p><small>Check back soon or contact us directly.</small></p>
          </div>
        ) : (
          <div className="cards-grid three-up">
            {activePackages.map((pkg) => {
              const priceStr = formatPrice(pkg.price, pkg.billingCycle);
              return (
                <article
                  key={pkg.id}
                  className={`card price-card${pkg.isFeatured ? " accent-card" : ""}`}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p className="eyebrow">{pkg.tagline ?? "Support Plan"}</p>
                    {pkg.isFeatured && (
                      <span style={{
                        background: "var(--gold)",
                        color: "var(--navy)",
                        borderRadius: "999px",
                        padding: "0.15rem 0.65rem",
                        fontSize: "0.65rem",
                        fontWeight: 900,
                      }}>
                        ★ Featured
                      </span>
                    )}
                  </div>
                  <h3>{pkg.name}</h3>
                  {priceStr && (
                    <p style={{ fontWeight: 900, fontSize: "1.1rem", margin: "0.25rem 0" }}>
                      {priceStr}
                    </p>
                  )}
                  {pkg.description && <p>{pkg.description}</p>}
                  {pkg.features && pkg.features.length > 0 && (
                    <ul className="bullet-list">
                      {pkg.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  )}
                  {pkg.purchaseUrl ? (
                    <a
                      className="btn btn-primary"
                      href={pkg.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                    >
                      Get Package <ExternalLink style={{ width: "1rem", height: "1rem" }} />
                    </a>
                  ) : (
                    <Link className="btn btn-primary" href="/contact">
                      Contact Us to Order
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Resource Library Section */}
        <section className="section resource-section">
          <div className="section-heading">
            <p className="eyebrow">Resource library</p>
            <h2>Downloadable resources to support home learning</h2>
          </div>

          {loadingResources ? (
            <div className="cards-grid two-column">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card animate-pulse" style={{ minHeight: 120 }} />
              ))}
            </div>
          ) : activeResources.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
              <p><small>No resources added to the library yet.</small></p>
            </div>
          ) : (
            <div className="cards-grid two-column">
              {activeResources.map((item) => (
                <article key={item.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <p className="eyebrow">{item.category}</p>
                    <h3>{item.title}</h3>
                    {item.description && (
                      <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>{item.description}</p>
                    )}
                  </div>
                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        marginTop: "1rem",
                        alignSelf: "flex-start",
                        fontSize: "0.8rem",
                        padding: "0.5rem 1rem",
                      }}
                    >
                      <Download style={{ width: "0.875rem", height: "0.875rem" }} /> Download
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
