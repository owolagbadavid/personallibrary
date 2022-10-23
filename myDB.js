require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoDB = process.env.DB;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

const bookSchema = new Schema({
  title: {type: String, required: true},
  comments: [String]
  
})


exports.Book = mongoose.model('Book', bookSchema)
