const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    category: { type: String, required: true },
    folder: { type: String, required: true },
    filePath: { type: String, required: true },
    fileName: { type: String, required: true },
});

const Content = mongoose.model('Content', contentSchema);
module.exports = Content;
