import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/**
 * Centralized environment configuration.
 * Validates that all required variables are present at startup.
 */
const requiredVars: string[] = ["SUPABASE_URL", "SUPABASE_ANON_KEY"];

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    console.error(`❌  Missing required env variable: ${varName}`);
    process.exit(1);
  }
}

export const PORT: number = parseInt(process.env.PORT || "5000", 10);
export const SUPABASE_URL: string = process.env.SUPABASE_URL as string;
export const SUPABASE_ANON_KEY: string = process.env.SUPABASE_ANON_KEY as string;
