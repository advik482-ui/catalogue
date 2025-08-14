import { type NextRequest, NextResponse } from "next/server"
import { FirebaseService } from "@/lib/firebase"

export async function GET() {
  try {
    const users = await FirebaseService.getAllUsers()
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validate required fields
    if (!userData.name || !userData.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const userId = await FirebaseService.createUser({
      name: userData.name,
      email: userData.email,
      status: userData.status || "active",
      role: userData.role || "user",
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return NextResponse.json({
      success: true,
      userId,
      message: "User created successfully",
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
