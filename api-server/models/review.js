var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
  author: String,
  content: String
}, { timestamps: true });

module.exports = {
  reviewSchema,
  Review: mongoose.model('review', reviewSchema)
}

