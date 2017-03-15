var path = require('path');
var book_model = require('../models/book');

module.exports = (function() {
    'use strict';
    var router = require('express').Router();

    router.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", 'Content-Type');
        next();
    });

    router.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../', 'index.html'));
    });

    router.get('/api', function(req, res) {
        res.json({ message: 'Welcome to BookGenius API!'});
    });

    router.route('/api/books')
        .get(function(req, res) {
            // *Todo*
            // Should we expose this endpoint?
            // *Todo*
            book_model.find()
                .then(function(result) {
                    res.json({payload: result, status_code: 1});
                })
                .catch(function(err) {
                    res.json({message: err, status_code: 0});
                });
        })
        .post(function(req, res) {
            // *Todo*
            // Should use MIME type: multipart/form-data for larger payload.
            // Currently using: x-www-form-urlencoded
            // Do validation on post data before db actions.
            // Who is allowed to post content? Regular users?
            // *Todo*
            var book_title = req.body.title;
            var book_author = req.body.author;

            var Book = new book_model();
            Book.name = book_title;
            Book.author = book_author;

            Book.save()
                .then(function(Book) {
                    res.json({message: "'" + book_title + "' by " + book_author + " succesfully added to database.", _id: Book._id, status_code: 1});
                })
                .catch(function(err) {
                    res.json({message: "An error occured while adding to the database: " + err, status_code: 0});
                });
        });

    router.route('/api/books/:book_id')
        .get(function(req, res) {
            var book_id = req.params.book_id;
            book_model.findById(book_id)
                .then(function(Book) {
                    // returns null if not found
                    res.json({payload: Book, status_code: 1});
                })
                .catch(function(err) {
                    res.json({message: "An error occured: " + err, status_code: 0});
                });
        })
        .put(function(req, res) {
            // *Todo*
            // Do validation on post data before db actions.
            // Check if user has permission to edit given book.
            // Must pass in token
            // *Todo*
            var book_id = req.params.book_id;
            var book_title = req.body.title;
            var book_author = req.body.author;

            book_model.findById(book_id)
                .then(function(Book) {
                    if (book_title) {
                        Book.name = book_title;
                    }
                    if (book_author) {
                        Book.author = book_author;
                    }
                    Book.save()
                        .then(function(Book) {
                            res.json({message: "'" + Book.name + "' by " + Book.author + " succesfully updated.", _id: Book._id, status_code: 1});
                        })
                        .catch(function(err) {
                            res.json({message: "An error occured while updating the database: " + err, status_code: 0});
                        });
                })
                .catch(function(err) {
                    res.json({message: "An error occured: " + err, status_code: 0});
                });
        })
        .delete(function(req, res) {
            // *Todo*
            // Do validation on post data before db actions.
            // Check if user has permission to delete given book
            // Must pass in token
            // *Todo*
            var book_id = req.params.book_id;
            book_model.findByIdAndRemove(book_id)
                .then(function(Book) {
                    res.json({message: "'" + Book.name + "' by " + Book.author + " succesfully deleted from database.", status_code: 1});
                })
                .catch(function(err) {
                    res.json({message: "An error occured while deleting from the database: " + err, status_code: 0});
                });
        });

    router.route('/api/books/filter')
        .post(function(req, res) {
            var searchTerm = req.body.query;
            if (searchTerm && searchTerm.length >= 3) {
              // *Todo*
              // Do validation on post data before db actions.
              // *Todo*

              // Not working - wrong but expected results
              // var regex = new RegExp("[" + searchTerm + "]{3,}", 'i');
              // Simple regex used in place.
              var regex = new RegExp(searchTerm, 'i');

              book_model.find({$or:[{'name': regex}, {'author': regex}]})
                  .then(function(result) {
                      res.json({payload: result, status_code: 1});
                  })
                  .catch(function(err) {
                      res.json({message: err, status_code: 0});
                  });
            }
            else {
                res.json({message: "Search term must be longer than 3 characters.", status_code: 0});
            }
        });
        return router;
})();
