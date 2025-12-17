import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";

// POST - Create initial admin user (one-time use)
export async function POST() {
  try {
    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 400 }
      );
    }

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Admin credentials not configured in environment variables" },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
      name: "Admin",
      role: "superadmin",
    });

    return NextResponse.json(
      { message: "Admin created successfully", email: admin.email },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error seeding admin:", error);
    return NextResponse.json(
      { error: "Failed to seed admin" },
      { status: 500 }
    );
  }
}
