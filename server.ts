import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { createServer as createViteServer } from "vite";
import { ENV } from "./src/server/config/env";
import { logger } from "./src/shared/utils/logger";
import { apiRouter } from "./src/server/routes";
import { errorHandler } from "./src/server/middleware/errorHandler";

async function startServer() {
  const app = express();
  
  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: ENV.NODE_ENV === "production" ? undefined : false,
  }));

  // Standard Middleware
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use("/api", apiRouter);

  // Error Handling Middleware (must be after routes)
  app.use(errorHandler);

  // Vite middleware for development or serve static files in production
  if (ENV.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const port = parseInt(ENV.PORT, 10);
  
  app.listen(port, "0.0.0.0", () => {
    logger.info(`Server running on port ${port} in ${ENV.NODE_ENV} mode.`);
  });
}

startServer().catch((err) => {
  logger.error("Failed to start server", err);
  process.exit(1);
});
