var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  google_id: String,
  name: String,
  email: String,
  phone_number: Number,
  use_count: Number,
  use_time: Number,
  remain_time: Number,
  note_list: [String],
  certification: {
    privacy_policy: Boolean,
    terms_of_use: Boolean
  }
}, { timestamps: true });

module.exports = {
  userSchema: userSchema,
  User: mongoose.model('user', userSchema)
}
