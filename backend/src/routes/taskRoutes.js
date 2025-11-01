const express = require("express");

module.exports = (db) => {
  const router = express.Router();
  //To create New Task

  router.post("/", async (req, res) => {
    const { title, description, priority, due_date, status } = req.body;
    await db.run(
      "INSERT INTO tasks (title, description, priority, due_date, status) VALUES (?, ?, ?, ?, ?)",
      [title, description, priority, due_date, status || "Open"]
    );
    res.json({ message: "Task Added Successfully!" });
  });
  // To Get All Tasks

  router.get("/", async (req, res) => {
    const tasks = await db.all("SELECT * FROM tasks ORDER BY id DESC");
    res.json(tasks);
  });

  // Insight End points
  router.get("insight", async (req, res) => {
    const opneCount = await db.get(
      "SELECT COUNT(*) as count FROM tasks WHERE status = 'Open'"
    );
    const priorityCount = await db.all(
      "SELECT priority, COUNT(*) as count FROM tasks GROUP BY priority"
    );
    const soonDue = await db.get(
      "SELECT COUNT(*) as count FROM WHERE julianday(due_date) - julianday('now') <= 3 AND status = 'Open'"
    );

    //Summary
    const highPriority =
      priorityCount.find((p) => p.priority === "High")?.count || 0;
    const totalTasks = priorityCount.reduce((a, b) => a + b.count, 0);
    const hightRatio = totalTasks
      ? Math.round((highPriority / totalTasks) * 100)
      : 0;

    let summary = `You have ${openCount.count} open tasks.`;
    if (hightRatio > 50) summary += "Most of them are high priority.";
    if (soonDue.count > 0) summary += `${soonDue.count} tasks are due soon!`;

    res.json({ opneCount, priorityCount, soonDue, summary });
  });

  return router;
};
