const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number, // Store file size as a number
        required: true
    },
    encryptedFilePath: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    }
});

const File = mongoose.model('File', fileSchema);

module.exports = File;