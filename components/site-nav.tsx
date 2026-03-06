"use client";

import Link from "next/link";

type SiteNavProps = {
  current?: "home" | "about" | "services" | "dashboard";
};

export default function SiteNav({ current }: SiteNavProps) {
  return (
    <nav className="nav">
      <Link className="brand" href="/">
        Gervas Shukrani
      </Link>
      <div className="links">
        <Link className={current === "home" ? "activeLink" : ""} href="/">
          Home
        </Link>
        <Link className={current === "about" ? "activeLink" : ""} href="/about">
          About
        </Link>
        <Link
          className={current === "services" ? "activeLink" : ""}
          href="/services"
        >
          Services
        </Link>
        <Link
          className={current === "dashboard" ? "activeLink" : ""}
          href="/dashboard"
        >
          Dashboard
        </Link>
      </div>
    </nav>
  );
}
