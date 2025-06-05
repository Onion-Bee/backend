// Validates each chapter object against schema rules (basic check).
// More advanced validation can use Joi or other validators.
const mongoose = require('mongoose');
const Chapter = require('../models/Chapter');

const validateChaptersArray = async (chaptersArray) => {
  const valid = [];
  const invalid = [];

  for (const [index, chapObj] of chaptersArray.entries()) {
    const chapter = new Chapter(chapObj);
    try {
      await chapter.validate();
      valid.push(chapObj);
    } catch (err) {
      invalid.push({ index, errors: err.errors });
    }
  }
  return { valid, invalid };
};

module.exports = { validateChaptersArray };