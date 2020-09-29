var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var slideSchema = new Schema({
  slide_id: mongoose.Schema.Types.ObjectId,
  title: String,
  thumbnail: String,
  audio: String,
  script: String,
  keywords: [String]
});

module.exports = mongoose.model('slide', slideSchema);