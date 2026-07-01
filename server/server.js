const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
app.use(cors());
app.use(express.json());
const uploadRoute = require("./routes/upload");
app.use("/upload", uploadRoute);
app.get("/", (req, res) => {
    res.json({ message: "Mini-RAG Backend Running 🚀" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});