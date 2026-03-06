import crypto from "crypto";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection("users");
    const sessions = db.collection("sessions");

    const user = (await users.findOne({ email })) as
      | { _id: ObjectId; name: string; email: string; passHash: string }
      | null;

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await sessions.insertOne({
      token,
      userId: user._id,
      expiresAt,
      createdAt: new Date(),
    });

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    const message = error instanceof Error ? error.message : String(error ?? "");
    const errorName =
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      typeof (error as { name?: unknown }).name === "string"
        ? ((error as { name: string }).name ?? "")
        : "";
    const lowerMessage = message.toLowerCase();
    const lowerName = errorName.toLowerCase();
    const isDbConnectionError =
      lowerName.includes("mongo") ||
      lowerMessage.includes("mongod") ||
      lowerMessage.includes("querysrv") ||
      lowerMessage.includes("server selection timed out") ||
      lowerMessage.includes("etimeout") ||
      lowerMessage.includes("enotfound") ||
      lowerMessage.includes("econnrefused") ||
      lowerMessage.includes("ssl routines") ||
      lowerMessage.includes("tlsv1 alert internal error") ||
      message.includes("MONGODB_URI is missing");

    if (isDbConnectionError) {
      return NextResponse.json(
        {
          error: "Database connection failed. Check MongoDB URI, DNS, and Atlas IP access.",
          ...(process.env.NODE_ENV !== "production" && message
            ? { details: message }
            : {}),
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error: "Invalid request payload",
        ...(process.env.NODE_ENV !== "production" && message
          ? { details: message }
          : {}),
      },
      { status: 400 },
    );
  }
}
