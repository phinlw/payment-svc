import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables based on NODE_ENV
const env = process.env.NODE_ENV || "dev";
const envFileName = `.env.${env}`;
dotenv.config({ path: path.resolve(process.cwd(), envFileName) });

// console.log('envFileName', envFileName);

@Module({
  imports: [
    NestConfigModule.forRoot({
      // Dynamic env file paths based on environment
      envFilePath: [`.env.${env}`], // Fallback to .env if specific file not found
      isGlobal: true,
      // Optional: Add validation schema
      validationSchema: null, // Add Joi schema here if needed
      // Cache for better performance
      cache: true,
      expandVariables: true,
      // Ignore env file if needed (useful for production)
      ignoreEnvFile: process.env.NODE_ENV === "prod" ? true : false,
    }),
  ],
  // Optional: Export the module for use elsewhere
  exports: [NestConfigModule],
})
export class ConfigModule {
  // Optional: Add static method to get env variables
  static getEnv(key: string, defaultValue?: string): string {
    return process.env[key] !== undefined
      ? process.env[key]
      : defaultValue || "";
  }
}