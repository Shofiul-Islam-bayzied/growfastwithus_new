import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";

export async function setupVite(app: Express, server: Server) {
  // Dynamic import to only load vite in development
  const { createServer: createViteServer, createLogger } = await import("vite");
  const viteConfig = await import("../vite.config").then(m => m.default);
  const { nanoid } = await import("nanoid");
  
  const viteLogger = createLogger();
  
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: ['localhost', '127.0.0.1', 'growfastwithus.com', 'www.growfastwithus.com'],
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // Check if the client template exists (should only be in development)
      if (!fs.existsSync(clientTemplate)) {
        console.error(`Client template not found at ${clientTemplate}. This suggests the app is running in development mode in a production environment.`);
        return res.status(500).send("Development server configuration error. Please set NODE_ENV=production.");
      }

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
