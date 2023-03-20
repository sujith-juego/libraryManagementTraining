const express = require('express')               //importing express

const { viewAllBook , createBook , issueBook } = require('../controllers/bookControllers')

const bookRoutes = express.Router()

// add , view, isse ,return

bookRoutes.post("/createBook", createBook)      //Adding new book to library ==>admin access

bookRoutes.post("/viewAllBook", viewAllBook)             //display all book details

bookRoutes.post("/issueBook",issueBook)               //to issue abook to user

// bookRoutes.post("/returnBook",returnBook)           //to return book


module.exports = bookRoutes;      //exporting the user


// 3=>  , getAllBook, issueBook, returnBook
