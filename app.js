import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Import the routes
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/user.js";
import companyRouter from "./routes/company.js";
import clientRouter from "./routes/client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/company", companyRouter);
app.use("/client", clientRouter);

//Add error handler and 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Invalid Endpoint Requested." });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
