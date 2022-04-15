/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const ObjectId = require('mongodb').ObjectID
var mongoose = require('mongoose')
chai.use(chaiHttp);

var id;

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'test'
          })
          .end((err, res) => {
            if(err){
              console.log(err)
            }
            else {
              assert.equal(res.status, 200);
              assert.equal(res.body.title, 'test');
              assert.property(res.body, '_id');
              id = res.body._id
              done();
            }
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
       chai.request(server)
          .post('/api/books')
          .end((err, res) => {
            if(err){
              console.log(err)
            }
            else {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'missing required field title');
              done();
            }
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            if(err){
              console.log(err)
            }
            else {
              assert.equal(res.status, 200);
              assert.isArray(res.body)
              res.body.forEach((book) => {
                assert.property(book, 'title');
                assert.property(book, '_id');
                assert.property(book, 'commentcount');
              })
              done();
            }
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/[id]')
          .query({
            _id: mongoose.Types.ObjectId()
          })
          .end((err, res) => {
            if(err){
              console.log(err)
            }
            else {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'no book exists')
              done();
            }
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${id}`)
          .end((err, res) => {
            if(err){
              console.log(err)
            }
            else {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, id)
              assert.property(res.body, 'title')
              assert.property(res.body, '_id')
              done();
            }
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post(`/api/books/${id}`)
          .send({
            comment: 'test'
          })
          .end((err, res) => {
            if(err){
              console.log(err)
            }
            else {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, id)
              assert.property(res.body, 'title')
              assert.property(res.body, '_id')
              assert.property(res.body, 'comments')
              assert.isArray(res.body.comments)
              done();
            }
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post(`/api/books/${id}`)
          .end((err, res) => {
            if(err){
              console.log(err)
            }
            else {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'missing required field comment')
              done()
            }
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post(`/api/books/${mongoose.Types.ObjectId()}`)
          .send({
            comment: 'test'
          })
          .end((err, res) => {
            if(err){
              console.log(err)
            }
            else {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'no book exists')
              done()
            }
          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete(`/api/books/${id}`)
          .end((err, res) => {
            if (err) {
              console.log(err)
            }
            else {
              assert.equal(res.status, 200)
              assert.equal(res.text, 'delete successful')
              done()
            }
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete(`/api/books/${mongoose.Types.ObjectId()}`)
          .end((err, res) => {
            if (err) {
              console.log(err)
            }
            else {
              assert.equal(res.status, 200)
              assert.equal(res.text, 'no book exists')
              done()
            }
          })
      });

    });

  });

});