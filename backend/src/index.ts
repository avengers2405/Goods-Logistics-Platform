import express from "express";

const app = express();
app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
  res.json({
    message: "Server running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
