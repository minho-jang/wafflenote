var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const authEmailSchema = new Schema({
  email: String,
  code: String,
  expired: Date
});

module.exports = {
  authEmailSchema: authEmailSchema,
  AuthEmail: mongoose.model('authEmail', authEmailSchema)
}

