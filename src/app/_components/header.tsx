"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { authClient } from "@/server/better-auth/client";
import { api } from "@/trpc/react";

export function Header() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const { data: contentData } = api.content.getAll.useQuery();

  const brandName = contentData?.map?.brandName ?? "Limitless Legacy";

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="site-header">
      <div className="nav-wrap container">
        <Link href="/" className="brand-wrap">
          <Image
            src="/limitless-logo.png"
            alt="Limitless Legacy Logo"
            width={42}
            height={42}
            className="brand-logo"
            priority
          />
          <span className="brand">{brandName}</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
            Home
          </Link>
          <Link
            href="/services"
            aria-current={pathname === "/services" ? "page" : undefined}
          >
            Services
          </Link>
          <Link
            href="/packages"
            aria-current={pathname === "/packages" ? "page" : undefined}
          >
            Packages
          </Link>
          <Link
            href="/about"
            aria-current={pathname === "/about" ? "page" : undefined}
          >
            About
          </Link>
          <Link
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
          >
            Contact
          </Link>
          <Link
            href="/parent-assessment"
            aria-current={
              pathname === "/parent-assessment" ? "page" : undefined
            }
          >
            Assessment
          </Link>
          <Link
            href="/admin"
            aria-current={pathname === "/admin" ? "page" : undefined}
          >
            Admin
          </Link>
          {session ? (
            <button
              type="button"
              className="auth-nav-btn"
              onClick={() => authClient.signOut()}
            >
              Sign out ({session.user.name?.split(" ")[0] ?? "User"})
            </button>
          ) : (
            <Link href="/login" className="auth-nav-btn">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
