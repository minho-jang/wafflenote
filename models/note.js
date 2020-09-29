var mongoose = require('mongoose');
var slideSchema = require('./slide')
var Schema = mongoose.Schema;

var noteSchema = new Schema({
  note_id: mongoose.Schema.Types.ObjectId,
  title: String,
  slide_list: [slideSchema],
});

module.exports = mongoose.model('note', noteSchema);