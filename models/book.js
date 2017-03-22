var mongoose = require('mongoose');
var schema = mongoose.Schema;

// Define Book schema
// Fields
//    Name (String) - Book's Name
//    Author (String) - Book's Author
//    *Owners (Array) - List of book's owners which have the permission to update and delete book
//    *Text? (String) - Text

var book_schema = new schema({
  name: String,
  author: String,
  text: String
});

var book_model = mongoose.model('Book', book_schema);

module.exports = book_model;
