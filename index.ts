import dotenv from "dotenv";
dotenv.config();
import { sendError } from './src/validators/response.validator';
import express, {
  Express,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import rateLimit from "express-rate-limit";

import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./src/configs/db";
import apiRouter from "./src/routes/api";
import { errorHandler } from "./src/middlewares/errorHandler";
import helmet from "helmet";
import { logRequests } from "./src/middlewares/customLogger";

// Constants
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// App
const app: Express = express();
app.use(errorHandler);
// CORS configuration
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [
  'https://indusviaggi.com',
  'https://www.indusviaggi.com',
  'https://api.indusviaggi.com',
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (require.main !== module && allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(helmet());
// parse request bodies (req.body)
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Serving static assets
app.use(express.static("public"));
// logger
app.use(morgan("combined"));
app.use(logRequests);

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15', 10)) * 60 * 1000, // e.g. 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // Limit each IP to N requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

app.use(limiter);

// API Routes
app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .send({ success: true, message: "Welcome to your Indus App API." });
});

app.use("/api/v1/", apiRouter);

// 404 handler for unknown endpoints
app.use((req, res, next) => {
  sendError(res, { message: "Endpoint not found" }, 404);
});

/* Error handler middleware */
app.use(
  ((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    sendError(res, { message: err.message }, statusCode);
    return;
  }) as ErrorRequestHandler
);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
  });
}

export default app;

