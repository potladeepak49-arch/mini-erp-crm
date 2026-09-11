import dotenv from "dotenv";
import app from "./app";
import pool from "./config/database";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");

    console.log("PostgreSQL connected successfully");

   app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();