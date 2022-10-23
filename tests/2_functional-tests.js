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

chai.use(chaiHttp);

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
let bookTestId;
  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
        .request(server)
        .post('/api/books')
        .send({"title":"The Book"})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'The Book')
          bookTestId = res.body._id
          assert.hasAllKeys(res.body, ["_id", "title"])
          
          done();
        });
        //done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
chai
        .request(server)
        .post('/api/books')
        .send()
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field title')
          done();
        });
        
        //done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
      chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.hasAllKeys(res.body[0], ['commentcount', 'title', '_id']);
        done();
      });
        
        //done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
        .request(server)                      
      .get('/api/books/635468549178365344256261')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists')
          done();
        });

        //done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
      chai
        .request(server)                      
      .get(`/api/books/${bookTestId}`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.hasAllKeys(res.body, ['title', '_id', 'comments']);
          assert.isArray(res.body.comments)
          done();
        });

        
        //done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
        .request(server)
        .post(`/api/books/${bookTestId}`)
        .send({comment:'A comment'})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.hasAllKeys(res.body, ['_id', 'comments', 'title', 'commentcount']);
          assert.isArray(res.body.comments);
          assert.equal(res.body.comments.length, res.body.commentcount)
          done();
        });

        //done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
         chai
        .request(server)
        .post(`/api/books/${bookTestId}`)
        .send()
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field comment')
          done();
        });

        //done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
        .request(server)
        .post(`/api/books/635468549178365344256261`)
        .send({comment: 'A comment'})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists')
          done();
        });
        //done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
  chai
        .request(server)
        .delete(`/api/books/${bookTestId}`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful')
          done();
        });
      
        
        //done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){

        chai
        .request(server)
        .delete(`/api/books/635468549178365344256261`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists')
          done();
        });
  
        //done();
      });

    });

  });

});
