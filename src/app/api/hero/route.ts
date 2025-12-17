import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Hero from "@/models/Hero";

// GET hero content
export async function GET() {
  try {
    await dbConnect();
    const hero = await Hero.findOne({});
    return NextResponse.json(hero);
  } catch (error) {
    console.error("Error fetching hero:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero content" },
      { status: 500 }
    );
  }
}

// POST/PUT update hero content (upsert)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const hero = await Hero.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });

    return NextResponse.json(hero);
  } catch (error) {
    console.error("Error updating hero:", error);
    return NextResponse.json(
      { error: "Failed to update hero content" },
      { status: 500 }
    );
  }
}
