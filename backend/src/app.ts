import express, { Request, Response } from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler";
import routes from "./routes";

const app = express();

/* ───────── Global Middleware ───────── */
const allowedOrigins = [
  "http://localhost:5173",                           // Vite dev server
  process.env.FRONTEND_URL,                          // Deployed frontend (Vercel)
].filter(Boolean) as string[];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ───────── Health Check ───────── */
app.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

/* ───────── API Routes ───────── */
app.use("/api", routes);

/* ───────── 404 Catch-All ───────── */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* ───────── Error Handler (must be last) ───────── */
app.use(errorHandler);

export default app;
