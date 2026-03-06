import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import SiteNav from "@/components/site-nav";
import { getDb } from "@/lib/mongodb";
import DashboardClient from "./dashboard-client";

export const dynamic = "force-dynamic";

async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  const db = await getDb();
  const session = (await db.collection("sessions").findOne({ token })) as
    | { userId: ObjectId; expiresAt: Date }
    | null;

  if (!session || session.expiresAt < new Date()) return null;

  const user = (await db.collection("users").findOne({ _id: session.userId })) as
    | { _id: ObjectId; name: string; email: string }
    | null;

  if (!user) return null;

  return { id: user._id.toString(), name: user.name, email: user.email };
}

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="page">
      <SiteNav current="dashboard" />
      <header className="hero">
        <span className="pill">Private Area</span>
        <h1>Dashboard</h1>
        <p className="lead">This page is protected by your database session.</p>
      </header>
      <DashboardClient name={user.name} email={user.email} />
    </div>
  );
}
