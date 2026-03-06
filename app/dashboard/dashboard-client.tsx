"use client";

import { useRouter } from "next/navigation";

type DashboardClientProps = {
  name: string;
  email: string;
};

export default function DashboardClient({ name, email }: DashboardClientProps) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <section className="section">
      <h2>Welcome, {name}</h2>
      <p className="lead">Signed in with {email}. This is your private dashboard.</p>
      <div className="kpiGrid">
        <article className="card kpi">
          <h3>Projects</h3>
          <p>3 active demos in your portfolio.</p>
        </article>
        <article className="card kpi">
          <h3>Inquiries</h3>
          <p>5 recent client messages this month.</p>
        </article>
        <article className="card kpi">
          <h3>Status</h3>
          <p>Authentication and database are running correctly.</p>
        </article>
      </div>
      <div className="ctaRow">
        <button className="btnGhost" type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </section>
  );
}
