const Todo = require("../models/Todo");

// CREATE TODO
exports.createTodo = async (req, res) => {
  const { title, description, priority, category, dueDate } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Task title is required" });
  }

  try {
    const todo = await Todo.create({
      title: title.trim(),
      description,
      priority,
      category,
      dueDate,
      user: req.user._id,
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET TODOS
exports.getTodos = async (req, res) => {
  try {
    const { filter, priority, search } = req.query;

    let query = { user: req.user._id };

    if (filter === "active") query.completed = false;
    if (filter === "completed") query.completed = true;
    if (priority) query.priority = priority;

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const todos = await Todo.find(query).sort({ createdAt: -1 });

    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TODO

exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Check ownership
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Update fields safely
    if (req.body.title !== undefined)
      todo.title = req.body.title.trim();

    if (req.body.description !== undefined)
      todo.description = req.body.description;

    if (req.body.priority !== undefined)
      todo.priority = req.body.priority;

    if (req.body.category !== undefined)
      todo.category = req.body.category;

    if (req.body.dueDate !== undefined)
      todo.dueDate = req.body.dueDate;

    if (req.body.completed !== undefined)
      todo.completed = req.body.completed;

    const updatedTodo = await todo.save();

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TODO
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await todo.deleteOne();

    res.json({ message: "Todo removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};