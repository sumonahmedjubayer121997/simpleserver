const express = require("express");
const { register, login, logout } = require("../controllers/authCont");

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.post("/logout", logout);

// Use module.exports instead of export default
module.exports = router;
