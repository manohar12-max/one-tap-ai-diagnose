import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" })

  // Clear the cookies
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  })

  response.cookies.set("role", "", {
    httpOnly: false,
    expires: new Date(0),
    path: "/",
  })

  return response
}
