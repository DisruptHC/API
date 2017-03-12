var mongoose = require('mongoose');
var schema = mongoose.Schema;

// Define Book schema
var book_schema = new schema({
  name: String,
  author: String
});

var book_model = mongoose.model('Book', book_schema);

module.exports = book_model;
