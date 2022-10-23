/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const {Book} = require('../myDB.js');
const {body, validationResult} = require('express-validator');
module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

        
      Book.find().then(result=>{
        const output = result.map(item=> ({"_id": item._id, "title": item.title, "commentcount": item.comments.length}))
        return res.json(output)
      })
      .catch(err=>res.json({'error': 'Database error'}))
    })
    
    .post(body('title').trim()
    .isLength({ min: 1 })
    .escape(),
      function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
  const errors = validationResult(req);
      if(!errors.isEmpty()){return res.send('missing required field title')}
      
        
    Book.create({
      'title': title
    }).then(result => {
     const output = {_id: result._id, title: result.title}
      return res.json(output)
    }).catch(err =>res.json({'error': 'Database error'}))
      
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'

      Book.deleteMany().then(result=> {
        console.log(`${result.deletedCount} items deleted`)
        res.send('complete delete successful')
      })
      .catch(err =>res.json({'error': 'Database error'}))
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      Book.findById(bookid).then(result=>{
        if(!result){return res.send('no book exists')}

        const output = {title: result.title, _id: result._id, comments: result.comments}
        return res.json(output);
      })
      .catch(err=>res.json({'error': 'Database error'}))
    })
    
    .post(body('comment').trim()
    .isLength({ min: 1 })
    .escape(),
      function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
const errors = validationResult(req);
      if(!errors.isEmpty()){return res.send('missing required field comment')}
  
      
      Book.findById(bookid).then(result=>{
        if(!result){return res.send('no book exists')}
       result.comments.push(comment)
        result.save()
        const output = {title: result.title, _id: result._id, comments: result.comments, commentcount: result.comments.length}
        return res.json(output);
      })
      .catch(err=>{
        console.log(err)
        res.json({'error': 'Database error'})})
   
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful
      
      Book.deleteOne({_id: bookid}).then(result=>{
        if(!result.deletedCount){return res.send('no book exists')}
        return res.send('delete successful')
      })
      .catch(err=>res.json({error: 'Database error'}))
      
    });
  
};
