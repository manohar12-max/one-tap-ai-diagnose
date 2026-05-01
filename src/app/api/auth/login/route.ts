import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import { comparePassword, signToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json()

    if (!identifier || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDb()
    const users = db.collection("User")

    // Find user by email or mobile
    const user = await users.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isMatch = await comparePassword(password, user.password)

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const userId = user._id.toString()
    const token = signToken({ userId, email: user.email, role: user.role })

    const response = NextResponse.json(
      { 
        message: "Logged in successfully", 
        user: { id: userId, email: user.email, name: user.name, role: user.role, isDetailsFilled: user.isDetailsFilled || false } 
      },
      { status: 200 }
    )

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Login error details:", error)
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 })
  }
}
