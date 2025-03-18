const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const AuthRoute = require("./routes/auth.js"); // Auth Router
const TodoRoute = require("./routes/todo.js"); // Todo Router

dotenv.config(); // ✅ Load environment variables first

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Fix CORS Issues
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://taskerapp-flax.vercel.app",
        "https://tasker.sumonahmed.info",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Allow OPTIONS for preflight
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Ensure necessary headers are allowed
    optionsSuccessStatus: 204, // ✅ Prevents unnecessary errors
  })
);

// ✅ Allow Express to parse JSON and Cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/user", AuthRoute);
app.use("/api/todos", TodoRoute);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("Hello, Express Server is running!");
});

// ✅ Global Error Handling
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Show stack trace only in development
  });
});

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
