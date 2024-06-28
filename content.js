const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Content = require('../models/Content'); // Update with your model path

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/create-folder', async (req, res) => {
    const { category, name } = req.body;
    try {
        const newFolder = new Content({ category, name, isFolder: true });
        await newFolder.save();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error });
    }
});

router.post('/upload', upload.single('document'), async (req, res) => {
    const { category, folder } = req.body;
    const filePath = req.file.path;
    try {
        const newDocument = new Content({ category, name: req.file.filename, filePath, folder });
        await newDocument.save();
        res.json({ message: 'File uploaded successfully' });
    } catch (error) {
        res.json({ message: 'Error uploading document', error });
    }
});

router.get('/:category', async (req, res) => {
    const { category } = req.params;
    try {
        const items = await Content.find({ category });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching content', error });
    }
});

module.exports = router;
