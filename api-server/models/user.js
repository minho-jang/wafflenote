var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  wafflenote_id: String,
  password: String,
  google_id: String,
  name: String,
  phone_number: String,
  use_count: Number,
  use_time: Number,
  remain_time: Number,
  note_list: [String],
  agree: {
    privacy_policy: Boolean,
    terms_of_use: Boolean,
    advertise_sms: Boolean,
    advertise_email: Boolean
  },
  salt: String
}, { timestamps: true });

module.exports = {
  userSchema: userSchema,
  User: mongoose.model('user', userSchema)
}
