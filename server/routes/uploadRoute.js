import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/UploadController.js"; // Import the upload function

const router = express.Router();

// Multer setup to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Single Image Upload Route
router.post("/single", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const imageUrl = await uploadImage(req.file);
        res.json({ imageUrl });
    } catch (error) {
        res.status(500).json({ error: "Image upload failed" });
    }
});

// Multiple Images Upload Route
router.post("/multiple", upload.array("files", 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) return res.status(400).json({ error: "No files uploaded" });

        const imageUrls = await uploadImages(req.files);
        res.json({ imageUrls });
    } catch (error) {
        res.status(500).json({ error: "Multiple image upload failed" });
    }
});

export default router;
