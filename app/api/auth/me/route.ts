import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const db = await getDb();
    const sessions = db.collection("sessions");
    const users = db.collection("users");

    const session = (await sessions.findOne({ token })) as
      | { userId: ObjectId; expiresAt: Date }
      | null;

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ user: null });
    }

    const user = (await users.findOne({ _id: session.userId })) as
      | { _id: ObjectId; name: string; email: string; createdAt?: Date }
      | null;

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt ?? null,
      },
    });
  } catch (error) {
    console.error("Auth me API error:", error);
    return NextResponse.json({ user: null }, { status: 503 });
  }
}
