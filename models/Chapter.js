const mongoose = require('mongoose');

const yearWiseSchema = new mongoose.Schema({
  _id: false,
  "2019": { type: Number, default: 0 },
  "2020": { type: Number, default: 0 },
  "2021": { type: Number, default: 0 },
  "2022": { type: Number, default: 0 },
  "2023": { type: Number, default: 0 },
  "2024": { type: Number, default: 0 },
  "2025": { type: Number, default: 0 },
});

const chapterSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  class: { type: String, required: true },
  unit: { type: String, required: true },
  yearWiseQuestionCount: { type: yearWiseSchema, required: true },
  questionSolved: { type: Number, default: 0 },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
  isWeakChapter: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Chapter', chapterSchema);
