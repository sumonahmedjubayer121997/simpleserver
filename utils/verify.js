const jwt = require("jsonwebtoken");
const createError = require("./error");

const verifyToken = (req, res, next) => {
  console.log("🔹 Incoming Request:", req.method, req.url);
  console.log("🔹 Cookies Received:", req.cookies); // ✅ Log all received cookies

  const token = req.cookies?.auth_token; // ✅ Token stored in cookies
  console.log("🔹 Extracted Token:", token); // ✅ Debugging step

  if (!token) {
    console.error("❌ No authentication token found in cookies.");
    return next(createError(400, "Not Authenticated"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("❌ Invalid Token:", err.message);
      return next(createError(403, "Token is not valid"));
    }

    console.log("✅ Token Verified! User Data:", user);
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
