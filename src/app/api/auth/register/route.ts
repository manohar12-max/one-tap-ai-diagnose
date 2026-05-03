import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import { hashPassword, signToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, mobile, password, name, role } = body

    if (!email || !mobile || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDb()
    const users = db.collection("User")

    // Check if user already exists
    const existingUser = await users.findOne({
      $or: [{ email }, { mobile }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    // Insert directly using native driver to bypass Prisma's replica set requirement
    const result = await users.insertOne({
      email,
      mobile,
      password: hashedPassword,
      name,
      role: role || "PATIENT",
      isDetailsFilled: false,
      createdAt: new Date(),
    })

    const user = {
      id: result.insertedId.toString(),
      email,
      name,
      role: role || "PATIENT"
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role, name: user.name })

    const response = NextResponse.json(
      { message: "User registered successfully", user, token },
      { status: 201 }
    )

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    response.cookies.set("role", user.role, {
      httpOnly: false, // Accessible by middleware
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Registration error details:", error)
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 })
  }
}
