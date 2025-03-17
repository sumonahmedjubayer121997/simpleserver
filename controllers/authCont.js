const User = require("../models/userModel");
const connectedToDB = require("../utils/connect");
const createError = require("../utils/error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// async function register(req, res, next) {
//   const data = req.body;
//   console.log(data);
//   if (!data?.email || !data?.password) {
//     return next(createError(400, "Missing fields"));
//   }
//   await connectedToDB();
//   const alreadyRegistered = await User.exists({ email: data.email });
//   if (alreadyRegistered) {
//     return next(createError(400, "User already exists"));
//   }
//   //res.send(`Register Router - ${req.body.email}`);
//   const salt = bcrypt.genSaltSync(10);
//   const hash = bcrypt.hashSync(req.body.password, salt);
//   const newUser = new User({ ...req.body, password: hash });
//   res.send(newUser);
//   console.log(req.body.email, hash);
// }

async function register(req, res, next) {
  try {
    const data = req.body;
    console.log("🟢 Received Data:", data);

    // 🔴 Check if email & password are provided
    if (!data?.email || !data?.password) {
      return next(createError(400, "Missing fields"));
    }

    // 🟢 Connect to MongoDB
    await connectedToDB();

    // 🔴 Check if user already exists
    const alreadyRegistered = await User.exists({ email: data.email });
    if (alreadyRegistered) {
      return next(createError(400, "User already exists"));
    }

    // 🟢 Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);

    // 🟢 Create new user object
    const newUser = new User({ ...data, password: hash });

    console.log("🔄 Saving user to database...");

    // 🔴 **Ensure user is saved in MongoDB**
    const savedUser = await newUser.save();

    console.log("✅ User Successfully Saved:", savedUser);
    // 🔍 Debug: Log the saved `userId`
    console.log("🆔 Saved User ID:", savedUser._id);

    // 🔴 Send response **after** saving
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("❌ Error Registering User:", error);
    return next(createError(500, "Internal Server Error"));
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // 🛑 Check if email and password exist
    if (!email || !password) {
      return next(createError(400, "Email and Password are required"));
    }

    // 🔍 Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(401, `Invalid Credentials - ${email} nt exists`));
    }

    // 🔐 Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(
        createError(401, "Invalid Credentials - Password didnt match ")
      );
    }
    // 🔍 Debug: Log the user ID before signing the token
    console.log("🆔 Logging In User ID:", user._id);

    // 🔑 Generate a JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } //Token will expire in within 1h;
    );

    // 🔴 Set token in HTTP-only cookie
    res.cookie("auth_token", token, {
      httpOnly: true, // Prevent access from JavaScript (XSS protection)
      secure: process.env.NODE_ENV === "production", // Secure in production (HTTPS)
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 60 * 60 * 1000, // 1h
    });

    console.log("✅ User Successfully Login:", user);

    // ✅ Send response with token
    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

//logout function
async function logout(req, res, next) {
  try {
    // 🔴 Clear the auth token cookie
    res.cookie("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "strict",
      expires: new Date(0), // Set cookie expiration to past date
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("❌ Error in Logout:", error);
    return next(createError(500, "Internal server error"));
  }
}

module.exports = { register, login, logout };
