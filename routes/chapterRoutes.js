const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const { getChapters, getChapterById, uploadChapters } = require('../controllers/chapterController');
const { cache } = require('../middleware/cache');

// Configure multer to store uploaded JSON files in "uploads/"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/json') {
    cb(null, true);
  } else {
    cb(new Error('Only JSON files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Public routes
router.get('/', cache, getChapters);
router.get('/:id', getChapterById);

// Protected (admin) routes
// NOTE: Authentication middleware is assumed; here we proceed directly
router.post('/', upload.single('file'), uploadChapters);

module.exports = router;