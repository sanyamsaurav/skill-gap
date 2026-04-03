const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  matchScore: {
    type: Number,
    required: true,
  },
  data: {
    type: Object,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
