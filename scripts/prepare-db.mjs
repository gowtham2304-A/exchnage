import { execSync } from "node:child_process";

function run() {
  if (!process.env.DATABASE_URL) {
    console.log("[prepare-db] DATABASE_URL is not set. Skipping migrations.");
    return;
  }

  try {
    console.log("[prepare-db] Running prisma migrate deploy...");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    console.log("[prepare-db] Migrations applied successfully.");
  } catch {
    console.warn("[prepare-db] Migration step failed. Continuing build.");
  }
}

run();
