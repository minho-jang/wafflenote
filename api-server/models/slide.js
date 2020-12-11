var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const slideSchema = new Schema({
  slide_id: Number,
  title: String,
  originImagePath: String,
  smallImage: String,
  audio: String,
  script: String,
  tags: [String],
  memo: String,
  startTime: String,
  endTime: String,
});

module.exports = {
  slideSchema: slideSchema,
  Slide: mongoose.model('slide', slideSchema)
}

