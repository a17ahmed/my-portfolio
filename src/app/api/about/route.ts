import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import About from "@/models/About";

// GET about content
export async function GET() {
  try {
    await dbConnect();
    const about = await About.findOne({});
    return NextResponse.json(about);
  } catch (error) {
    console.error("Error fetching about:", error);
    return NextResponse.json(
      { error: "Failed to fetch about content" },
      { status: 500 }
    );
  }
}

// POST/PUT update about content (upsert)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const about = await About.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });

    return NextResponse.json(about);
  } catch (error) {
    console.error("Error updating about:", error);
    return NextResponse.json(
      { error: "Failed to update about content" },
      { status: 500 }
    );
  }
}
