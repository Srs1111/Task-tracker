const sqlite3 = require("sqlite3").verbose();

const { open } = require("sqlite");
const path = require("path");

async function initDB() {
  const dbPath = path.join(__dirname, "../../task_tracker.db");
  console.log("Using database files at:", dbPath);
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("Datbase Connection Succefully");
    return db;
  } catch (err) {
    console.error("error Opening Databse", err);
    throw err;
  }
}

async function createTable(db) {
  if (!db) {
    throw new Error("Database not intitialized - db  is undefined");
  }
  await db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT CHECK(priority IN ("Low", "Medium", "High")),
        due_date TEXT,
        status TEXT CHECK(status IN ('Open', "In Progress", "Done")) DEFAULT "Open"
        )
    `);
}

module.exports = { initDB, createTable };
