// Task Manager API (with due dates + mark-all-done)
const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "./tasks.json";

// ----- storage helpers -----
function getTasks() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, "utf8") || "[]";
  let tasks = JSON.parse(raw);

  // migrate older tasks (no due field)
  tasks = tasks.map(t => ({
    id: t.id,
    title: t.title,
    done: !!t.done,
    due: t.due || null,         // ISO date string or null
    createdAt: t.createdAt || Date.now(),
    completedAt: t.completedAt || (t.done ? Date.now() : null)
  }));
  return tasks;
}

function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// ----- routes -----
app.get("/", (req, res) => res.send("Task Manager API is running ✅"));

// all tasks
app.get("/tasks", (req, res) => {
  res.json(getTasks());
});

// create task  { title: string, due?: "YYYY-MM-DD" }
app.post("/tasks", (req, res) => {
  const { title, due } = req.body || {};
  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "title is required" });
  }
  const tasks = getTasks();
  const newTask = {
    id: Date.now(),
    title: title.trim(),
    done: false,
    due: (due && typeof due === "string") ? due : null, // keep as date string
    createdAt: Date.now(),
    completedAt: null
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

// update task by id  { title?, done?, due? }
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const body = req.body || {};
  const tasks = getTasks();
  const t = tasks.find(x => x.id === id);
  if (!t) return res.status(404).json({ error: "Task not found" });

  if (typeof body.title === "string") t.title = body.title.trim();
  if (typeof body.due === "string" || body.due === null) t.due = body.due ?? null;
  if (typeof body.done === "boolean") {
    t.done = body.done;
    t.completedAt = body.done ? (t.completedAt || Date.now()) : null;
  }

  saveTasks(tasks);
  res.json(t);
});

// delete task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  let tasks = getTasks();
  const before = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  if (before === tasks.length) return res.status(404).json({ error: "Task not found" });
  saveTasks(tasks);
  res.json({ success: true });
});

// NEW: mark all as done
app.put("/tasks/mark-all-done", (req, res) => {
  const tasks = getTasks().map(t => ({
    ...t,
    done: true,
    completedAt: t.completedAt || Date.now()
  }));
  saveTasks(tasks);
  res.json({ success: true, count: tasks.length });
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
