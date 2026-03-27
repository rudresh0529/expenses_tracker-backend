require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);

let db;

// CONNECT DB
async function connectDB() {
  try {
    await client.connect();
    db = client.db("expenseDB");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("DB ERROR:", err);
  }
}
connectDB();

// ROOT
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});


// ==========================
// 📊 EXPENSES
// ==========================

// ADD
app.post("/api/expenses", async (req, res) => {
  try {
    const { title, amount, category, createdAt } = req.body;

    const result = await db.collection("expenses").insertOne({
      title,
      amount: Number(amount),
      category,
      createdAt: createdAt || new Date()
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET
app.get("/api/expenses", async (req, res) => {
  try {
    const data = await db.collection("expenses")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/api/expenses/:id", async (req, res) => {
  try {
    await db.collection("expenses").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/api/expenses/:id", async (req, res) => {
  try {
    await db.collection("expenses").deleteOne({
      _id: new ObjectId(req.params.id)
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================
// 💰 SAVINGS
// ==========================

// ADD
app.post("/api/savings", async (req, res) => {
  try {
    const { amount, createdAt } = req.body;

    await db.collection("savings").insertOne({
      amount: Number(amount),
      createdAt: createdAt || new Date()
    });

    res.json({ message: "Saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET
app.get("/api/savings", async (req, res) => {
  try {
    const data = await db.collection("savings")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/api/savings/:id", async (req, res) => {
  try {
    await db.collection("savings").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/api/savings/:id", async (req, res) => {
  try {
    await db.collection("savings").deleteOne({
      _id: new ObjectId(req.params.id)
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================
// 🚀 START SERVER
// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});