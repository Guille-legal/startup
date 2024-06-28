const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    category: { type: String, required: true },
    name: { type: String, required: true },
});

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;
