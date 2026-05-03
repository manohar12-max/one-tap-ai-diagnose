import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "default-secret"
console.log("[Auth] JWT_SECRET initialized (length):", JWT_SECRET.length)

export interface JWTPayload {
  userId: string
  email: string
  role: string
  name: string
}

export const signToken = (payload: JWTPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    console.log("[Auth] Verifying token (truncated):", token.substring(0, 15) + "...")
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error: any) {
    console.error("[Auth] Token verification failed:", error.message)
    return null
  }
}

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export const comparePassword = async (password: string, hashed: string) => {
  return bcrypt.compare(password, hashed)
}

export const getTokenFromRequest = (req: Request) => {
  // Check Authorization header first
  const authHeader = req.headers.get("Authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]
    if (token && token !== "null" && token !== "undefined") {
      return token
    }
  }

  // Check cookies
  const cookieHeader = req.headers.get("cookie")
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc: any, cookie) => {
      const trimmed = cookie.trim();
      const firstEq = trimmed.indexOf('=');
      if (firstEq !== -1) {
        const key = trimmed.substring(0, firstEq);
        let value = trimmed.substring(firstEq + 1);
        // Strip surrounding quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        acc[key] = value;
      }
      return acc;
    }, {});
    
    if (cookies["token"]) {
      return cookies["token"]
    }
  }

  console.log("[Auth] No token found in headers or cookies for path:", new URL(req.url).pathname)
  return null
}
