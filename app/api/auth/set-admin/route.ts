import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, adminSecret } = await req.json();
    
    // Check if the correct admin secret is provided
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    // Find the user and update their admin status
    const user = await User.findOneAndUpdate(
      { email },
      { isAdmin: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Admin status updated successfully",
      user: {
        id: user._id.toString(),
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Set admin error:', error);
    return NextResponse.json(
      { error: "Error updating admin status" },
      { status: 500 }
    );
  }
}