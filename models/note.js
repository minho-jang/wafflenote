var mongoose = require('mongoose');
var slideModel = require('./slide');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
  author: String,
  title: String,
  status: String,
  slide_list: [slideModel.slideSchema],
}, { timestamps: true });

module.exports = {
  noteSchema: noteSchema,
  Note: mongoose.model('note', noteSchema)
}
