const express = require("express");
const cors = require("cors");
const { initDB, createTable } = require("./src/db/db");
const taskRoutes = require("./src/routes/taskRoutes");
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    const db = await initDB();
    await createTable(db);
    app.use("/tasks", taskRoutes(db));

    app.listen(PORT, () =>
      console.log(`Backend running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Error starting Server", err);
  }
}

startServer();
