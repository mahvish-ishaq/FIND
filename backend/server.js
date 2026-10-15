const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const Transaction = mongoose.model("Transaction", new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0.01 },
  type: { type: String, enum: ["income", "expense"], required: true },
  date: { type: Date, default: Date.now }
}));
const Goal = mongoose.model("Goal", new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  target: { type: Number, required: true, min: 0.01 },
  progress: { type: Number, default: 0, min: 0 }
}));

const Reward = mongoose.model("Reward", new mongoose.Schema({
  points: { type: Number, default: 0 }
}));

app.get("/api/health", (req, res) => {
  res.json({
    application: "FIND Financial Tracker",
    status: "running",
    database: mongoose.connection.readyState === 1
      ? "connected" : "disconnected"
  });
});

app.get("/api/transactions", async (req, res) => {
  try {
    res.json(await Transaction.find().sort({ date: -1 }));
  } catch (err) {
    res.status(500).json({ error: "Could not fetch transactions" });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const { description, amount, type } = req.body;
    if (!description || !Number.isFinite(Number(amount)) ||
        Number(amount) <= 0 || !["income", "expense"].includes(type)) {
      return res.status(400).json({ error: "Invalid transaction details" });
    }
    const transaction = await Transaction.create({
      description, amount: Number(amount), type
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: "Could not save transaction" });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid transaction ID" });
    }
    const item = await Transaction.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete transaction" });
  }
});

app.get("/api/goals", async (req, res) => {
  try {
    const goals = await Goal.find().sort({ _id: -1 });
    let reward = await Reward.findOne();

    if (!reward) {
      reward = await Reward.create({ points: 0 });
    }

    res.json({ goals, points: reward.points });
  } catch (err) {
    res.status(500).json({ error: "Could not load goals" });
  }
});

app.post("/api/goals", async (req, res) => {
  try {
    const { name, target } = req.body;

    if (
      !name ||
      !Number.isFinite(Number(target)) ||
      Number(target) <= 0
    ) {
      return res.status(400).json({ error: "Invalid goal details" });
    }

    const goal = await Goal.create({
      name: name.trim(),
      target: Number(target),
      progress: 0
    });

    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: "Could not add goal" });
  }
});

app.patch("/api/goals/:id/progress", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid goal ID" });
    }

    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $inc: { progress: 100 } },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const reward = await Reward.findOneAndUpdate(
      {},
      { $inc: { points: 10 } },
      { upsert: true, new: true }
    );

    res.json({ goal, points: reward.points });
  } catch (err) {
    res.status(500).json({ error: "Could not update goal" });
  }
});

app.delete("/api/goals/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid goal ID" });
    }

    const goal = await Goal.findByIdAndDelete(req.params.id);

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json({ message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete goal" });
  }
});

app.use(express.static(path.join(__dirname, "..")));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI ||
  "mongodb://localhost:27017/findtracker";

async function start() {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");
  app.listen(PORT, "0.0.0.0", () =>
    console.log(`FIND running on port ${PORT}`)
  );
}

start().catch(err => {
  console.error("Startup failed:", err.message);
  process.exit(1);
});
