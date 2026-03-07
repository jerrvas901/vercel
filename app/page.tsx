"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SiteNav from "@/components/site-nav";

type User = { id: string; name: string; email: string; createdAt?: string };

const projects = [
  {
    name: "Portfolio + Auth Demo",
    description:
      "A full-stack portfolio with login flow, session handling, and production deployment on Vercel.",
  },
  {
    name: "Business Landing Site",
    description:
      "A high-conversion one-page website with fast load time, clean copy hierarchy, and mobile-first layout.",
  },
  {
    name: "Student CRUD App",
    description:
      "A role-based CRUD system for managing student records, with protected routes and simple analytics.",
  },
];

const skills = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "MongoDB",
  "REST APIs",
  "Vercel",
  "Git/GitHub",
  "Responsive UI",
];

export default function HomePage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const [rName, setRName] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPass, setRPass] = useState("");

  const [lEmail, setLEmail] = useState("");
  const [lPass, setLPass] = useState("");

  const statusText = useMemo(() => {
    if (user) return `Signed in as ${user.name}`;
    return "Not signed in";
  }, [user]);

  async function readJsonSafely<T>(res: Response): Promise<T | null> {
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text) as T;
    } catch {
      return null;
    }
  }

  const refreshMe = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await readJsonSafely<{ user?: User | null }>(res);
      setUser(data?.user ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void refreshMe();
  }, [refreshMe]);

  async function register() {
    setMsg("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: rName,
          email: rEmail,
          password: rPass,
        }),
      });
      const data = await readJsonSafely<{ error?: string }>(res);
      if (!res.ok) throw new Error(data?.error || "Registration failed");
      setMsg("Registered successfully. Continue with login.");
      setTab("login");
      setLEmail(rEmail);
      setLPass("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error";
      setMsg(message);
    } finally {
      setBusy(false);
    }
  }

  async function login() {
    setMsg("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: lEmail, password: lPass }),
      });
      const data = await readJsonSafely<{ error?: string }>(res);
      if (!res.ok) throw new Error(data?.error || "Login failed");
      await refreshMe();
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error";
      setMsg(message);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setMsg("");
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setMsg("Logged out.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <SiteNav current="home" />

      <header className="hero">
        <span className="pill">Web Developer - Dar es Salaam</span>
        <h1>I build fast, clean websites that solve real business problems.</h1>
        <p className="lead">
          I focus on practical product development: strong frontend experience,
          clear backend logic, and reliable deployment. My goal is always to
          turn ideas into usable software people trust.
        </p>
        <div className="ctaRow">
          <a className="btnPrimary" href="#projects">
            View My Work
          </a>
          <a className="btnGhost" href="/about">
            Read About Me
          </a>
        </div>
      </header>

      <section id="projects" className="section">
        <h2>Selected Projects</h2>
        <div className="grid">
          {projects.map((project) => (
            <article className="card" key={project.name}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="section">
        <h2>Core Skills</h2>
        <div className="skillWrap">
          {skills.map((skill) => (
            <span key={skill} className="skill">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section id="auth" className="section">
        <h2>Database Auth Demo</h2>
        <p className="lead">
          Login takes you directly to your dashboard page after session creation.
        </p>

        <div className="authGrid">
          <div className="card">
            <div className="statusRow">
              <strong>Status:</strong> {statusText}
            </div>
            {msg ? <p className="message">{msg}</p> : null}

            <div className="tabRow">
              <button
                className={tab === "login" ? "tabBtn tabBtnActive" : "tabBtn"}
                onClick={() => setTab("login")}
                disabled={busy}
                type="button"
              >
                Login
              </button>
              <button
                className={tab === "register" ? "tabBtn tabBtnActive" : "tabBtn"}
                onClick={() => setTab("register")}
                disabled={busy}
                type="button"
              >
                Register
              </button>
            </div>

            {tab === "register" ? (
              <form
                className="form"
                onSubmit={(event) => {
                  event.preventDefault();
                  void register();
                }}
              >
                <input
                  className="input"
                  placeholder="Full name"
                  value={rName}
                  onChange={(event) => setRName(event.target.value)}
                />
                <input
                  className="input"
                  placeholder="Email"
                  type="email"
                  value={rEmail}
                  onChange={(event) => setREmail(event.target.value)}
                />
                <input
                  className="input"
                  placeholder="Password (min 6 chars)"
                  type="password"
                  value={rPass}
                  onChange={(event) => setRPass(event.target.value)}
                />
                <button className="btnPrimary" disabled={busy} type="submit">
                  Create account
                </button>
              </form>
            ) : (
              <form
                className="form"
                onSubmit={(event) => {
                  event.preventDefault();
                  void login();
                }}
              >
                <input
                  className="input"
                  placeholder="Email"
                  type="email"
                  value={lEmail}
                  onChange={(event) => setLEmail(event.target.value)}
                />
                <input
                  className="input"
                  placeholder="Password"
                  type="password"
                  value={lPass}
                  onChange={(event) => setLPass(event.target.value)}
                />
                <button className="btnPrimary" disabled={busy} type="submit">
                  Login to Dashboard
                </button>
              </form>
            )}

            {user ? (
              <div className="ctaRow">
                <a className="btnGhost" href="/dashboard">
                  Open Dashboard
                </a>
                <button
                  className="btnGhost"
                  type="button"
                  onClick={logout}
                  disabled={busy}
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>

          <div className="card">
            <h3>Pages included</h3>
            <p>Public pages: Home, About, Services.</p>
            <p>Protected page: Dashboard (requires valid session).</p>
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <h2>Let&apos;s Work Together</h2>
        <p className="lead">
          If you need a portfolio, company website, or full-stack MVP, I can
          help you design it, build it, and deploy it.
        </p>
        <div className="ctaRow">
          <a className="btnPrimary" href="mailto:gervasshukrani@gmail.com">
            Start a Project
          </a>
          <a className="btnGhost" href="/services">
            See Services
          </a>
        </div>
      </section>

      <footer className="footer">2026 Gervas Shukrani. Built with Next.js.</footer>
    </div>
  );
}
