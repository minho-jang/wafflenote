var mongoose = require('mongoose');
var slideModel = require('./slide');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
  note_id: String,
  title: String,
  slide_list: [slideModel.slideSchema],
});

module.exports = {
  noteSchema: noteSchema,
  Note: mongoose.model('note', noteSchema)
}
