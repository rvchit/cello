import express from "express";
import api from "./api";

const app = express();
app.use("/api", api);

// Test route
app.get("/api/hi", (req, res) => {
  res.send("Hello World");
});

// start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
