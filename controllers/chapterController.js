// const fs = require('fs');
// const path = require('path');
// const Chapter = require('../models/Chapter');
// const { validateChaptersArray } = require('../utils/validateJSON');
// const { redisClient } = require('../config/redisClient');

// // @desc    Get all chapters with filtering, pagination, caching
// // @route   GET /api/v1/chapters
// // @access  Public
// exports.getChapters = async (req, res, next) => {
//   try {
//     const { class: cls, unit, status, isWeakChapter, subject, page = 1, limit = 10 } = req.query;

//     // Build filter object
//     const filter = {};
//     if (cls) filter.class = cls;
//     if (unit) filter.unit = unit;
//     if (status) filter.status = status;
//     if (isWeakChapter !== undefined) filter.isWeakChapter = isWeakChapter === 'true';
//     if (subject) filter.subject = subject;

//     // Pagination logic
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const total = await Chapter.countDocuments(filter);

//     const chapters = await Chapter.find(filter)
//       .skip(skip)
//       .limit(parseInt(limit));

//     const response = {
//       success: true,
//       count: chapters.length,
//       total,
//       page: parseInt(page),
//       pages: Math.ceil(total / parseInt(limit)),
//       data: chapters
//     };

//     // Cache the response for 1 hour (3600 seconds)
//     if (req.cacheKey) {
//       await redisClient.setex(req.cacheKey, 3600, JSON.stringify(response));
//     }

//     res.status(200).json(response);
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Get a single chapter by ID
// // @route   GET /api/v1/chapters/:id
// // @access  Public
// exports.getChapterById = async (req, res, next) => {
//   try {
//     const chapter = await Chapter.findById(req.params.id);
//     if (!chapter) {
//       return res.status(404).json({ success: false, error: 'Chapter not found' });
//     }
//     res.status(200).json({ success: true, data: chapter });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Upload chapters JSON file (admin only stub)
// // @route   POST /api/v1/chapters
// // @access  Private (Admin required) - authentication stub
// exports.uploadChapters = async (req, res, next) => {
//   try {
//     // For simplicity, assume a middleware has authenticated and set req.user.role
//     if (!req.user || req.user.role !== 'admin') {
//       return res.status(403).json({ success: false, error: 'Unauthorized' });
//     }

//     // File upload is handled by multer; file is at req.file.path
//     if (!req.file) {
//       return res.status(400).json({ success: false, error: 'No file uploaded' });
//     }

//     // Read and parse JSON
//     const filePath = path.resolve(req.file.path);
//     const rawData = fs.readFileSync(filePath, 'utf8');
//     let chaptersArray;
//     try {
//       chaptersArray = JSON.parse(rawData);
//       if (!Array.isArray(chaptersArray)) {
//         throw new Error('JSON is not an array');
//       }
//     } catch (parseErr) {
//       return res.status(400).json({ success: false, error: 'Invalid JSON format' });
//     }

//     // Validate each chapter
//     const { valid, invalid } = await validateChaptersArray(chaptersArray);

//     // Insert valid chapters
//     let insertedDocs = [];
//     try {
//       insertedDocs = await Chapter.insertMany(valid);
//     } catch (insertErr) {
//       // handle bulk insert errors if any
//       console.error('InsertMany error:', insertErr);
//     }

//     // Invalidate cache for GET /api/v1/chapters
//     await redisClient.del(`chapters:/api/v1/chapters`);

//     res.status(200).json({
//       success: true,
//       insertedCount: insertedDocs.length,
//       failedCount: invalid.length,
//       errors: invalid
//     });
//   } catch (err) {
//     next(err);
//   }
// };
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Chapter = require('../models/Chapter');
const { validateChaptersArray } = require('../utils/validateJSON');
const { redisClient } = require('../config/redisClient');

// @desc    Get all chapters with filtering, pagination, caching
// @route   GET /api/v1/chapters
// @access  Public
exports.getChapters = async (req, res, next) => {
  try {
    const { class: cls, unit, status, isWeakChapter, subject, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (cls) filter.class = cls;
    if (unit) filter.unit = unit;
    if (status) filter.status = status;
    if (isWeakChapter !== undefined) filter.isWeakChapter = isWeakChapter === 'true';
    if (subject) filter.subject = subject;

    // Pagination logic
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Chapter.countDocuments(filter);

    const chapters = await Chapter.find(filter)
      .skip(skip)
      .limit(parseInt(limit));

    const response = {
      success: true,
      count: chapters.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: chapters
    };

    // Cache the response for 1 hour (3600 seconds)
    if (req.cacheKey) {
      await redisClient.setex(req.cacheKey, 3600, JSON.stringify(response));
    }

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single chapter by ID
// @route   GET /api/v1/chapters/:id
// @access  Public
exports.getChapterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Check for valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, error: 'Chapter not found' });
    }

    const chapter = await Chapter.findById(id);
    if (!chapter) {
      return res.status(404).json({ success: false, error: 'Chapter not found' });
    }
    res.status(200).json({ success: true, data: chapter });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload chapters JSON file (admin only stub)
// @route   POST /api/v1/chapters
// @access  Private (Admin required) - authentication stub
exports.uploadChapters = async (req, res, next) => {
  try {
    // For simplicity, assume a middleware has authenticated and set req.user.role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    // File upload is handled by multer; file is at req.file.path
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Read and parse JSON
    const filePath = path.resolve(req.file.path);
    const rawData = fs.readFileSync(filePath, 'utf8');
    let chaptersArray;
    try {
      chaptersArray = JSON.parse(rawData);
      if (!Array.isArray(chaptersArray)) {
        throw new Error('JSON is not an array');
      }
    } catch (parseErr) {
      return res.status(400).json({ success: false, error: 'Invalid JSON format' });
    }

    // Validate each chapter
    const { valid, invalid } = await validateChaptersArray(chaptersArray);

    // Insert valid chapters
    let insertedDocs = [];
    try {
      insertedDocs = await Chapter.insertMany(valid);
    } catch (insertErr) {
      // handle bulk insert errors if any
      console.error('InsertMany error:', insertErr);
    }

    // Invalidate cache for GET /api/v1/chapters
    await redisClient.del(`chapters:/api/v1/chapters`);

    res.status(200).json({
      success: true,
      insertedCount: insertedDocs.length,
      failedCount: invalid.length,
      errors: invalid
    });
  } catch (err) {
    next(err);
  }
};
