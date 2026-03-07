"use client";

import Link from "next/link";
import Image from "next/image";

type SiteNavProps = {
  current?: "home" | "about" | "services" | "dashboard";
};

export default function SiteNav({ current }: SiteNavProps) {
  return (
    <nav className="nav">
      <Link className="brand" href="/">
        <Image
          src="/site-logo.svg"
          alt="Gervas Shukrani logo"
          width={44}
          height={44}
          className="brandLogo"
          priority
        />
        <span>Gervas Shukrani</span>
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
