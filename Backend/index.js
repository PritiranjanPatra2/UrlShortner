import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import { nanoid } from "nanoid";
import urlModel from "./models/Url.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.URL;

app.post("/add", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "Original URL is required." });
    }

    const existingUrl = await urlModel.findOne({ originalUrl });
    if (existingUrl) {
      return res
        .status(200)
        .json({ shortUrl: `https://urlshortner-8kl7.onrender.com/${existingUrl.shortUrl}` });
    }

    const shortUrl = nanoid();
    const newUrl = new urlModel({ originalUrl, shortUrl });
    await newUrl.save();

    return res
      .status(201)
      .json({ shortUrl: `http://localhost:${PORT}/${shortUrl}` });
  } catch (error) {
    console.error("Error adding URL:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const url = await urlModel.findOne({ shortUrl: id });

    if (!url) {
      return res.status(404).json({ error: "URL not found." });
    }

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Error retrieving URL:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log("Database connected successfully.");
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });   
