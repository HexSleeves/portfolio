import "dotenv/config";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import { createServer } from "http";
import { pathToFileURL } from "url";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { assertProductionEnv, ENV } from "./env";
import { serveStatic, setupVite } from "./vite";
import { closeDb } from "../db";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.get("/healthz", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  return app;
}

async function startServer() {
  assertProductionEnv();

  const app = createApp();
  const server = createServer(app);

  if (ENV.nodeEnv === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  server.listen(ENV.port, "::", () => {
    console.log(`Server running http://localhost:${ENV.port}`);
  });

  process.on("SIGTERM", () => {
    server.close(async () => {
      await closeDb();
      process.exit(0);
    });
  });
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  startServer().catch(error => {
    console.error(error);
    process.exit(1);
  });
}
