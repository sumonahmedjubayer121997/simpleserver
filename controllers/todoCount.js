const Todo = require("../models/todoModel");
const connectedToDB = require("../utils/connect");
const createError = require("../utils/error");

//userId coming from jwt.sign as i defined userId: user._id;

//Sample of task data
// let tasks = [
//   { id: 1, title: "Learn Express", completed: false },
//   { id: 2, title: "Build a MERN App", completed: false },
// ];

async function getAllTodo(req, res, next) {
  await connectedToDB();
  // console.log(req.user.userId);
  const selectedUserTodos = await Todo.find({ userID: req.user.userId });
  res.status(200).send(selectedUserTodos);
  //res.status(200).json(tasks);
}
async function getSingleTodo(req, res, next) {
  try {
    await connectedToDB();

    // 🔍 Fetch the Todo by ID
    const todoById = await Todo.findById(req.params.id);

    // 🚨 If Todo is not found, return 404 error
    if (!todoById) {
      return next(createError(404, "Todo not found"));
    }

    // 🔒 Ensure the user owns the todo
    if (todoById.userID.toString() !== req.user.userId) {
      return next(createError(403, "Not authorized to access this todo"));
    }

    // ✅ Send the found Todo
    res.status(200).json(todoById);
  } catch (error) {
    console.error("❌ Error fetching todo:", error);
    next(createError(500, "Internal Server Error"));
  }
}

// async function getSingleTodo(req, res, next) {
//   await connectedToDB();
//   //getting todo's ID
//   const todoById = await Todo.findById(req.params.id);
//   //checking there is having any id or nt
//   if (!todoById) {
//     return next(createError(404, "Todo not found"));
//   }

//   if (todoById.userID.toString() !== req.params.id) {
//     return next(createError(404, "Not authorised"));
//   }
//   res.status(200).json(todoById);

//   //res.send(`Getting single Task based on single ID - ${req.params.id}`);
// }

async function createNewTask(req, res, next) {
  //console.log(req.body);
  //console.log("🔍 Authenticated User:", req.user); // Check if req.user exists
  if (!req.body || !req.body.title) {
    next(createError(400, "Title is required"));
  }
  await connectedToDB();
  console.log("🔍 Debug - Authenticated User:", req.user);
  const newTodo = new Todo({
    title: req.body.title,
    description: req.body.description || "", // ✅ Default empty if missing
    tags: req.body.tags || [], // ✅ Default empty array if missing
    priority: req.body.priority || "Medium", // ✅ Default to "Medium"
    isFavorite: req.body.isFavorite || false, // ✅ Default to false
    isCompleted: req.body.isCompleted || false, // ✅ Default to false
    userID: req.user.userId, // ✅ Ensure this is being assigned
    //_id:crypto.RandomUID(); //automaticallly willl be generated;
  });
  await newTodo.save();
  res.send(newTodo);
}

async function updateTask(req, res, next) {
  const updatedTaskID = req.params.id;

  if (!req.body) {
    return next(createError(404, "Missing Fields"));
  }

  try {
    await connectedToDB();
    const todoById = await Todo.findById(req.params.id);

    if (!todoById) {
      return next(createError(404, "Task not found"));
    }

    // 🔒 Ensure the logged-in user owns the task
    if (todoById.userID.toString() !== req.user.userId) {
      return next(createError(403, "Not authorized to access this todo"));
    }

    console.log("🔍 Before Update:", todoById);

    // ✅ Update fields properly
    const { title, description, tags, priority, isFavorite, isCompleted } =
      req.body;

    if (title !== undefined) todoById.title = title;
    if (description !== undefined) todoById.description = description;
    if (tags !== undefined) todoById.tags = Array.isArray(tags) ? tags : [];

    // ✅ Convert `priority` to the correct enum case
    const validPriorities = ["Low", "Medium", "High"];
    if (priority !== undefined) {
      const formattedPriority =
        typeof priority === "string"
          ? priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()
          : "Medium"; // ✅ Ensure first letter is uppercase

      if (!validPriorities.includes(formattedPriority)) {
        return next(createError(400, `Invalid priority value: ${priority}`));
      }

      todoById.priority = formattedPriority;
    }

    if (isFavorite !== undefined) todoById.isFavorite = isFavorite;
    if (isCompleted !== undefined) todoById.isCompleted = isCompleted;

    console.log("✅ Updating Task With:", {
      title,
      description,
      tags,
      priority: todoById.priority,
      isFavorite,
      isCompleted,
    });

    await todoById.save();

    console.log("✅ After Update:", todoById);

    res.status(200).json({
      message: "Todo updated successfully",
      todo: todoById,
    });
  } catch (error) {
    console.error("❌ Error updating todo:", error);
    next(createError(500, "Internal Server Error"));
  }
}

async function deleteTask(req, res, next) {
  try {
    const taskId = req.params.id;

    await connectedToDB();

    // 🔍 Fetch the Todo by ID
    const todoById = await Todo.findById(taskId);

    // 🚨 If Todo is not found, return 404 error
    if (!todoById) {
      return next(createError(404, "Todo not found"));
    }

    // 🔒 Ensure the user owns the todo
    if (todoById.userID.toString() !== req.user.userId) {
      return next(createError(403, "Not authorized to delete this todo"));
    }

    // 🗑️ Delete the todo
    await Todo.findByIdAndDelete(taskId);

    // ✅ Send success response
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting todo:", error);
    next(createError(500, "Internal Server Error"));
  }
}

module.exports = {
  getAllTodo,
  getSingleTodo,
  createNewTask,
  updateTask,
  deleteTask,
};
