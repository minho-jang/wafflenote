const mongoose = require('mongoose');

module.exports = (url, opts) => {
  function connect() {
    mongoose.connect(url, opts, function(err) {
      if (err) {
        console.error('mongodb connection error', err);
      }
      console.log('Successfully connected to mongodb');
    });
  }
  connect();
  mongoose.connection.on('disconnected', connect);
};