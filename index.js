const express = require("express");
const app = express();
const PORT = 3000;
const { Pool } = require("pg");

app.use(express.json());

//Database Connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tasks_db",
  password: "tasks123",
  port: "5432",
});

//Create Table Function
async function createTasksTable() {
  try {
    await pool.query(
      `
            CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            description TEXT NOT NULL,
            status VARCHAR(100) NOT NULL
        );
            `
    );
    console.log("Tasks table created!");
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

// GET /tasks - Get all tasks
app.get("/tasks", async (request, response) => {
  try {
    const result = await pool.query("SELECT * FROM tasks");
    response.json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send("Server issue encountered.");
  }
});

// POST /tasks - Add a new task
app.post("/tasks", async (request, response) => {
  const { description, status } = request.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (description, status) VALUES ($1, $2) RETURNING *",
      [description, status]
    );
    response.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).send("Server issue encountered.");
  }
});

// PUT /tasks/:id - Update a task's status
app.put("/tasks/:id", async (request, response) => {
  const { status } = request.body;
  const { id } = request.params;

  try {
    const result = await pool.query(
      "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    if (result.rowCount === 0) {
      return response.status(404).send("Task not found.");
    }
    response.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).send("Server issue encountered.");
  }
});

// DELETE /tasks/:id - Delete a task
app.delete("/tasks/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    if (result.rowCount === 0)
      return response.status(404).send("Task not found.");
    response.send("Task deleted!");
  } catch (error) {
    console.error(error);
    response.status(500).send("Server issue encountered.");
  }
});

//Initialize databse, start server
createTasksTable().then(() =>
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
);
