import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import {
  validatePasswordStrength,
  hashPassword,
  validateAdminEmail,
  sanitizeInput,
  generateSecurePassword,
} from "@/lib/auth-utils";

export async function POST(req: Request) {
  try {
    const {
      email,
      password,
      adminSecret,
      adminLevel = "admin",
      generatePassword = false,
    } = await req.json();

    if (adminSecret !== process.env.ADMIN_SECRET) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json(
        { error: "Unauthorized access denied" },
        { status: 401 }
      );
    }

    const emailValidation = validateAdminEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    await connectToDatabase();

    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "User with this email already exists",
        },
        { status: 409 }
      );
    }

    let finalPassword = password;
    let generatedPassword = null;

    if (generatePassword) {
      finalPassword = generateSecurePassword();
      generatedPassword = finalPassword;
    }

    if (!finalPassword) {
      return NextResponse.json(
        {
          error: "Password is required",
        },
        { status: 400 }
      );
    }

    const passwordValidation = validatePasswordStrength(finalPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: "Password security requirements not met",
          details: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(finalPassword);

    const adminUser = new User({
      email: sanitizedEmail,
      password: hashedPassword,
      isAdmin: true,
      adminLevel: adminLevel,
      adminCreatedAt: new Date(),
      adminCreatedBy: process.env.ADMIN_CREATOR_ID || "system",
      isActive: true,
      loginAttempts: 0,
      accountLocked: false,
    });

    const savedUser = await adminUser.save();

    console.log(
      `🔒 ADMIN USER CREATED: ${sanitizedEmail} at ${new Date().toISOString()}`
    );

    const response: {
      message: string;
      user: {
        id: string;
        email: string;
        adminLevel: string;
        createdAt: Date;
      };
      generatedPassword?: string;
    } = {
      message: "Admin user created successfully",
      user: {
        id: savedUser._id.toString(),
        email: savedUser.email,
        adminLevel: savedUser.adminLevel,
        createdAt: savedUser.adminCreatedAt,
      },
    };

    if (generatedPassword) {
      response.generatedPassword = generatedPassword;
      console.log(`🔑 GENERATED PASSWORD: ${generatedPassword}`);
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Admin creation error:", error);
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const adminSecret = url.searchParams.get("adminSecret");

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const adminUsers = await User.find(
      { isAdmin: true },
      { password: 0, loginAttempts: 0, lockUntil: 0 }
    ).sort({ adminCreatedAt: -1 });

    return NextResponse.json({
      message: "Admin users retrieved",
      users: adminUsers.map((user) => ({
        id: user._id.toString(),
        email: user.email,
        adminLevel: user.adminLevel,
        isActive: user.isActive,
        createdAt: user.adminCreatedAt,
        lastLogin: user.lastLogin,
      })),
    });
  } catch (error) {
    console.error("Admin retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve admin users" },
      { status: 500 }
    );
  }
}
