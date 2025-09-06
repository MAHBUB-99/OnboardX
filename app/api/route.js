import { NextResponse } from "next/server";

// In-memory storage for demo 
let emergencyContacts = [];

/**
 * Handles POST requests from the Emergency Contact form.
 * Supports both JSON and multipart/form-data (with file upload).
 */
export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let data = {};

    // Case 1: FormData (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          // Store file metadata (not saving the file here)
          data[key] = {
            filename: value.name,
            type: value.type,
            size: value.size,
          };
        } else {
          // Try to parse JSON, else keep string
          try {
            data[key] = JSON.parse(value);
          } catch {
            data[key] = value;
          }
        }
      }
    } else {
      // Case 2: JSON body
      data = await req.json();
    }

    // Add timestamp / unique id
    const newEntry = { id: Date.now(), ...data };
    emergencyContacts.push(newEntry);

    console.log("Emergency Contact Submitted:", newEntry);

    return NextResponse.json(
      { success: true, message: "Form submitted successfully", data: newEntry },
      { status: 200 }
    );
  } catch (err) {
    console.error("API submit error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to submit form" },
      { status: 500 }
    );
  }
}

/**
 * Handles GET requests to fetch all submitted emergency contacts.
 */
export async function GET() {
  try {
    return NextResponse.json({ success: true, data: emergencyContacts }, { status: 200 });
  } catch (err) {
    console.error("API fetch error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
