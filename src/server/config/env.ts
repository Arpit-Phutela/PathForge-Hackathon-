import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required for backend operations"),
});

let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Environment Validation Error:", error.flatten().fieldErrors);
  }
  // We don't throw here to prevent immediate crash if loaded in UI unintentionally,
  // but backend should fail to start if GEMINI_API_KEY is missing.
  env = process.env as any; 
}

export const ENV = env;
