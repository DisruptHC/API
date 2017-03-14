var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = Promise;
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;

var book_model = require('./models/book');

var db_username = "DisruptHC";
var db_password = "HenryRutgers";
var db_url = "mongodb://" + db_username + ":" + db_password + "@ds123370.mlab.com:23370/bookgenius";
mongoose.connect(db_url);

var router = express.Router();

router.use(function(req, res, next) {
    // console.log('Make sure that user is authenticated!');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'Welcome to BookGenius API!'});
});

router.route('/books')
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

router.route('/books/:book_id')
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

// Search path
router.route('/books/filter')
    .post(function(req, res) {
        var searchTerm = req.body.query;
        if (searchTerm.length >= 3) {
          // *Todo*
          // Do validation on post data before db actions.
          // Regex not perfect but somewhat works... Any three consecutive characters from user string matched
          // *Todo*
          var regex = new RegExp("[" + searchTerm + "]{3,}", 'i');
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

app.use('/api', router);

app.listen(port);
console.log('Server listening on port ' + port);
