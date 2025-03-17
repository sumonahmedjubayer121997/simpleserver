const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  //Mongoose automatetically modify that;
  // _id: {
  //   type: mongoose.Schema.Types.ObjectId, // 🔍 Explicitly defining _id (optional)
  //   default: () => new mongoose.Types.ObjectId(), // ✅ Ensures automatic generation
  // },

  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Todo Must have an owner"],
  },
  title: {
    type: String,
    required: [true, "Must have to provide title"],
  },
  description: {
    type: String,
    required: false, // ✅ Optional field
  },
  tags: {
    type: [String], // ✅ Array of strings
    required: false,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"], // ✅ Restrict values
    default: "Medium",
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
