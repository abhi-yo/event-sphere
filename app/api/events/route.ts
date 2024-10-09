import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Event from "../../../models/Event";

export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find({});
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    console.log("Received event data:", data); // Log received data
    const event = await Event.create(data);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
