const express = require("express");
const router = express.Router();
const fs = require("fs");
const pdf = require("pdf-parse");

const upload = require("../utils/multerConfig");
const chunkText = require("../utils/chunkText");
const generateEmbedding = require("../utils/embedding");

router.post("/", upload.single("file"), async (req, res) => {
    try {
        // Read uploaded PDF
        const buffer = fs.readFileSync(req.file.path);

        // Extract text from PDF
        const data = await pdf(buffer);

        // Split text into chunks
        const chunks = chunkText(data.text, 100);

        // Generate embeddings for each chunk
        const embeddings = [];

        for (const chunk of chunks) {
            const embedding = await generateEmbedding(chunk);

            embeddings.push({
                text: chunk,
                embedding
            });
        }

        console.log("Total Chunks:", chunks.length);
        console.log("Embedding Dimension:", embeddings[0].embedding.length);

        res.json({
            success: true,
            totalChunks: chunks.length,
            embeddingDimension: embeddings[0].embedding.length,
            embeddings
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Error processing PDF"
        });
    }
});

module.exports = router;