import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";

// GET - Fetch all approved reviews (public)
export async function GET() {
  try {
    await dbConnect();
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST - Submit a new review (public, but needs approval)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate required fields
    const { userName, email, company, rating, text, videoUrl } = body;
    if (!userName || !email || !company || !rating || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Create review (not approved by default)
    const review = await Review.create({
      userName,
      email,
      company,
      rating,
      text,
      videoUrl: videoUrl || undefined,
      approved: false,
    });

    return NextResponse.json(
      { success: true, message: "Review submitted successfully! It will be visible after approval.", review },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
