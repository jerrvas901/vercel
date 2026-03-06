import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("session")?.value;

  if (token) {
    const db = await getDb();
    const sessions = db.collection("sessions");
    await sessions.deleteMany({ token });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: "session",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
