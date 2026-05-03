import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
console.log("Using JWT_SECRET:", JWT_SECRET);

const payload = {
  userId: "test-user-id",
  email: "test@example.com",
  role: "DOCTOR",
  name: "Test Doctor"
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
console.log("Signed Token:", token);

try {
  const verified = jwt.verify(token, JWT_SECRET);
  console.log("Verified Payload:", verified);
  console.log("Signature Verification: SUCCESS");
} catch (error: any) {
  console.error("Signature Verification: FAILED");
  console.error("Error:", error.message);
}
