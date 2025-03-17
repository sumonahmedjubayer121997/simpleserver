//we will define all of our routes that are realted to todo like /tasks
const express = require("express");
const {
  getAllTodo,
  getSingleTodo,
  createNewTask,
  updateTask,
  deleteTask,
} = require("../controllers/todoCount");
const verifyToken = require("../utils/verify");

// initializing Router server with name router;
const router = express.Router();

// 🟢 Get All Tasks
router.get("/", verifyToken, getAllTodo);

// 🔵 Get a Single Task by ID - get
router.get("/:id", verifyToken, getSingleTodo);

// 🟡 Create a New Task - Post
router.post("/", verifyToken, createNewTask);

// 🟠 Update a Task - Put
router.put("/:id", verifyToken, updateTask);

// 🔴 Delete a Task  - Delete
router.delete("/:id", verifyToken, deleteTask);

module.exports = router;
