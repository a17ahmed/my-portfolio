import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { ContactInfo, ContactMessage } from "@/models/Contact";
import { sendEmail, generateContactEmailHtml } from "@/lib/email";

// GET contact info
export async function GET() {
  try {
    await dbConnect();
    const contactInfo = await ContactInfo.findOne({});
    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact info" },
      { status: 500 }
    );
  }
}

// POST - either update contact info (admin) or submit contact message (public)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    // If it's a contact form submission (has name, email, subject, message)
    if (body.name && body.email && body.subject && body.message) {
      // Save to database
      const contactMessage = new ContactMessage(body);
      await contactMessage.save();

      // Send email notification
      const recipientEmail = process.env.CONTACT_EMAIL || "a17irfan@gmail.com";

      try {
        await sendEmail({
          to: recipientEmail,
          subject: `Portfolio Message: ${body.subject}`,
          html: generateContactEmailHtml({
            name: body.name,
            email: body.email,
            subject: body.subject,
            message: body.message,
          }),
          replyTo: body.email,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the request if email fails - message is still saved
      }

      return NextResponse.json(
        { message: "Message sent successfully", id: contactMessage._id },
        { status: 201 }
      );
    }

    // Otherwise it's an admin updating contact info
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contactInfo = await ContactInfo.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error("Error with contact:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
