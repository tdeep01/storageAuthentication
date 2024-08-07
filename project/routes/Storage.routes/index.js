const express = require('express');
const fs = require('fs');
const path = require('path');
const {upload, uploadHandler} = require('../../Middleware/multer');
const { decrypt } = require('../../utils/encryption');
const File = require('../../model/File.Model');
const authenticateToken = require('../../Middleware/auth');
const rateLimiter = require('../../Middleware/rateLimiter');
const { uploadFolder, downloadFolder, storageFolder } = require('../../constants/appConstants');

const router = express.Router();

router.post('/upload', rateLimiter, authenticateToken, upload.single('file'), uploadHandler);

router.get('/download/:id', rateLimiter, authenticateToken, async (req, res) => {
    const fileId = req.params.id;

    try {
        const fileRecord = await File.findOne({ id: fileId });
        if (!fileRecord) {
            return res.status(404).json({ message: 'File not found' });
        }

        const decryptedFilename = decrypt(fileRecord.filename);

        const filePath = path.join(storageFolder + '/' + uploadFolder, fileRecord.filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        res.setHeader('Content-Disposition', `attachment; filename=${path.basename(decryptedFilename)}`);
        res.setHeader('Content-Type', fileRecord.fileType);
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        const destinationPath = path.join(storageFolder + '/' + downloadFolder, path.basename(decryptedFilename));
        fileStream.pipe(fs.createWriteStream(destinationPath));

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
