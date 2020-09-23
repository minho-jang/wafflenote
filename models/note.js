var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
  noteid: Number,
  title: String,
  content: String,
},
{
  timestamps: true
});

module.exports = mongoose.model('note', noteSchema);