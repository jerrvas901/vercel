import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const users = db.collection("users");

    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    const passHash = await bcrypt.hash(password, 12);
    const createdAt = new Date();
    const result = await users.insertOne({ name, email, passHash, createdAt });

    return NextResponse.json(
      {
        user: {
          id: result.insertedId.toString(),
          name,
          email,
          createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register API error:", error);
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
