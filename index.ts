import dotenv from "dotenv";
dotenv.config();

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
const allowedOrigins = [
  'https://indusviaggi.com',
  'https://www.indusviaggi.com',
  'https://api.indusviaggi.com',
  'http://localhost:3000'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    /*if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }*/
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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
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
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

/* Error handler middleware */
app.use(
  ((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ success: false, message: err.message });

    return;
  }) as ErrorRequestHandler
);

// app.listen(PORT, () => {
//   console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
// });

export default app;

