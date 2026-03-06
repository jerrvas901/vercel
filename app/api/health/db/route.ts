import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  const startedAt = Date.now();

  try {
    const db = await getDb();
    await db.command({ ping: 1 });

    return NextResponse.json({
      ok: true,
      status: "connected",
      dbName: db.databaseName,
      durationMs: Date.now() - startedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error ?? "");
    const errorName =
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      typeof (error as { name?: unknown }).name === "string"
        ? ((error as { name: string }).name ?? "")
        : "UnknownError";

    return NextResponse.json(
      {
        ok: false,
        status: "disconnected",
        durationMs: Date.now() - startedAt,
        error: "Database connection failed",
        ...(process.env.NODE_ENV !== "production"
          ? { details: { name: errorName, message } }
          : {}),
      },
      { status: 503 },
    );
  }
}
