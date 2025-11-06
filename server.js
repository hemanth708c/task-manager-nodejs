// Task Manager API – CRUD + Categories + Due Dates + Mark-All-Done + Clear-Completed
const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "./tasks.json";

// ----- Helpers -----
function getTasks() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, "utf8") || "[]";
  let tasks = JSON.parse(raw);

  // Normalize old tasks
  tasks = tasks.map(t => ({
    id: t.id,
    title: t.title || "Untitled Task",
    done: !!t.done,
    due: t.due || null,
    category: t.category || "General",
    createdAt: t.createdAt || Date.now(),
    completedAt: t.completedAt || (t.done ? Date.now() : null)
  }));
  return tasks;
}

function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// ----- Routes -----

// Root test
app.get("/", (req, res) => res.send("✅ Task Manager API is running"));

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(getTasks());
});

// Create new task  { title, due?, category? }
app.post("/tasks", (req, res) => {
  const { title, due, category } = req.body || {};
  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "title is required" });
  }

  const tasks = getTasks();
  const newTask = {
    id: Date.now(),
    title: title.trim(),
    done: false,
    due: (due && typeof due === "string") ? due : null,
    category: (category && typeof category === "string") ? category.trim() : "General",
    createdAt: Date.now(),
    completedAt: null
  };

  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

// ----- Bulk actions (placed before /tasks/:id to avoid conflicts) -----

// Mark all tasks as done
app.put("/tasks/actions/mark-all-done", (req, res) => {
  const tasks = getTasks().map(t => ({
    ...t,
    done: true,
    completedAt: t.completedAt || Date.now()
  }));
  saveTasks(tasks);
  res.json({ success: true, count: tasks.length });
});

// Clear all completed tasks
app.delete("/tasks/actions/clear-completed", (req, res) => {
  const all = getTasks();
  const remaining = all.filter(t => !t.done);
  const removed = all.length - remaining.length;
  saveTasks(remaining);
  res.json({ success: true, removed, remaining: remaining.length });
});

// ----- Item routes -----

// Update task by ID  { title?, done?, due?, category? }
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const body = req.body || {};
  const tasks = getTasks();
  const t = tasks.find(x => x.id === id);
  if (!t) return res.status(404).json({ error: "Task not found" });

  if (typeof body.title === "string") t.title = body.title.trim();
  if (typeof body.due === "string" || body.due === null) t.due = body.due ?? null;
  if (typeof body.category === "string") t.category = body.category.trim() || "General";
  if (typeof body.done === "boolean") {
    t.done = body.done;
    t.completedAt = body.done ? (t.completedAt || Date.now()) : null;
  }

  saveTasks(tasks);
  res.json(t);
});

// Delete task by ID
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  let tasks = getTasks();
  const before = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  if (before === tasks.length) return res.status(404).json({ error: "Task not found" });
  saveTasks(tasks);
  res.json({ success: true });
});

// Server start
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
