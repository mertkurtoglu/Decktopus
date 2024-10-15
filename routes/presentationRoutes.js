const express = require('express');
const router = express.Router();
const presentationController = require('../controllers/presentationController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes
router.get('/presentations', presentationController.getPresentations);
router.post('/presentations', upload.single('thumbnail_image'), presentationController.createPresentation);
router.put('/presentations/:id', presentationController.renamePresentation);
router.delete('/presentations/:id', presentationController.deletePresentation);

module.exports = router;
