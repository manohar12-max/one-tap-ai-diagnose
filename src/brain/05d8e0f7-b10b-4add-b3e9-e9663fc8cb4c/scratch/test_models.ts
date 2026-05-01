import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function listModels() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.error("No API key found in .env");
    return;
  }

  try {
    const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await result.json();
    
    if (data.error) {
      console.error("API Error:", data.error.message);
      return;
    }

    console.log("Available models:");
    data.models?.forEach((m: any) => console.log(m.name));
  } catch (error) {
    console.error("Failed to list models:", error);
  }
}

listModels();
