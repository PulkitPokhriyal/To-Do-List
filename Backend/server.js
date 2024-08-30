import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import env from "dotenv";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM todoitems ORDER by id ASC");
    const items = result.rows;
    res.json({ items });
  } catch (err) {
    console.error(err);
  }
});

app.post("/", async (req, res) => {
  try {
    const newItem = req.body.newItem; 
    await db.query("INSERT INTO todoitems (items) VALUES ($1)", [newItem]);
    res.status(201).json({ message: "Item added successfully" });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ error: "Error adding item" });
  }
});

app.patch("/edit/:id", async(req, res) => {
  try {
        await db.query(
      "UPDATE todoitems SET items=$1 WHERE id=$2",
      [req.body.newItem, req.params.id]
    );
  } catch (err) {
    console.error(err);
  }
});

app.delete("/delete", async(req, res) => {
  try {
       await db.query("DELETE FROM todoitems");
       await db.query("ALTER SEQUENCE todoitems_id_seq RESTART WITH 1;");
      res.status(200).json({ message: "All items deleted successfully" });
  } catch (err) {
      console.error("Error deleting items:", err);
      res.status(500).json({ error: "Error deleting items" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
