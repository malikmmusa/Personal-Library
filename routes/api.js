'use strict';
const ObjectId = require('mongodb').ObjectID

module.exports = function (app) {

  var mongoose = require('mongoose')
  mongoose.connect(process.env.DB, { 
    useNewUrlParser: true,  
    useUnifiedTopology: true 
  });
  
  const { Schema } = mongoose
  const bookSchema = new Schema ({
    title: {
      type: String,
      require: true
    },
    _id: {
      type: String,
      require: true
    },
    comments: Array,
    commentcount: {
      type: Number, 
      default: 0
    }
  }, {
    versionKey: false
  })

  let Book = mongoose.model("Book", bookSchema)
  
  app.route('/api/books')
    .get(function (req, res){
      Book.find((err, books) => {
        if (err){
          console.log(err)
        }
        else {
          res.json(books)
        }
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if (!title){
        return res.send('missing required field title')
      }

      const id = mongoose.Types.ObjectId()
      const newBook = new Book({title: title, _id: id})
      newBook.save((err, book) => {
        if (err){
          console.log(err)
        }
        else {
          res.send(book)
        }
      })
    })
    
    .delete(function(req, res){
      Book.deleteMany((err, books) => {
        if (err){
          console.log(err)
        }
        else {
          res.send('complete delete successful')
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      Book.findById(bookid, (err, book) => {
        if (!book){
          console.log(err)
          res.send('no book exists')
        }
        else {
          res.json({"_id": bookid, "title": book.title, "comments": book.comments}) 
        }
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment){
        return res.send('missing required field comment')
      }
      //json res format same as .get
      Book.findByIdAndUpdate(bookid, {$push: {comments: comment}, $inc: {'commentcount': 1}}, {new: true}, (err, book) => {
        if (!book){
          console.log(err)
          res.send('no book exists')
        }
        else {
          res.json({"_id": bookid, "title": book.title, "comments": book.comments}) 
        }
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid, (err, book) => {
        if (!book){
          console.log(err)
          res.send('no book exists')
        }
        else {
          res.send('delete successful')
        }
      })
    });
  
};
