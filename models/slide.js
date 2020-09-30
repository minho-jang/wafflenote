var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const slideSchema = new Schema({
  slide_id: String,
  title: String,
  thumbnail: String,
  audio: String,
  script: String,
  keywords: [String],
  memo: String
});

module.exports = {
  slideSchema: slideSchema,
  Slide: mongoose.model('slide', slideSchema)
}

