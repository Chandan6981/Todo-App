const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} = require("../controllers/todos.controller");

router.route("/")
  .post(protect, createTodo)
  .get(protect, getTodos);

router.route("/:id")
  .put(protect, updateTodo)
  .delete(protect, deleteTodo);

module.exports = router;