const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  link: { type: mongoose.Schema.Types.ObjectId, ref: 'Link' },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
