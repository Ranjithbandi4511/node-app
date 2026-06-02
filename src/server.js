require("dotenv").config();

const express = require("express");
const { connectDb, closeDb } = require("./db");
const usersRouter = require("./routes/users");

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok okay, check db working..." });
});

app.use("/api/users", usersRouter);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? "Internal server error" : err.message,
  });
});

async function main() {
  await connectDb();

  const server = app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`\n${signal} received, shutting down...`);
    server.close(async () => {
      await closeDb();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});
