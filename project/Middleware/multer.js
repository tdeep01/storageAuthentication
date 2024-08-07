const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { encrypt } = require('../utils/encryption');
const File = require('../model/File.Model');
const { uploadFolder, downloadFolder, storageFolder } = require('../constants/appConstants');

const storageDir = path.join(__dirname, `../${storageFolder}`);
const uploadDir = path.join(storageDir, uploadFolder);
const downloadDir = path.join(storageDir, downloadFolder);

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir);
}
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /csv|xlsx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Only CSV and XLSX files are allowed!');
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: fileFilter
});

const uploadHandler = async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const uniqueId = uuidv4();
  const originalName = file.originalname;
  const fileSize = file.size;

  try {
    const encryptedFilename = encrypt(originalName);
    const fileRecord = new File({
      id: uniqueId,
      filename: encryptedFilename,
      fileType: file.mimetype,
      fileSize: fileSize,
      encryptedFilePath : uploadDir,
      createdBy: req.user.id
    });

    await fileRecord.save();

    const filePath = path.join(uploadDir, encryptedFilename);
    fs.writeFileSync(filePath, file.buffer);
    req.file.buffer = null;
    res.status(200).send({msg:'File uploaded successfully.', fileId: uniqueId});
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, uploadHandler };