const express = require("express");
const AuthRoute = require("./routes/auth.js"); // Auth Router
const TodoRoute = require("./routes/todo.js"); //Todo Router
const bodyParser = require("body-parser"); //Body-Parser
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

// ✅ Enable CORS before defining routes
// ✅ Enable CORS for frontend requests
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

// Middleware to parse JSON requests
app.use(express.json());

//Auth Router
app.use("/api/user", AuthRoute);

//Todo Router
app.use("/api/todos", TodoRoute);

// Default route
app.get("/", (req, res) => {
  res.send("Hello, Express Server is running on port 5000!");
});

//Handling Global Error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ error: message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
