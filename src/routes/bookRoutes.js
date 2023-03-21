const express = require('express')               //importing express

const { viewAllBook, createBook, issueBook, displayBorrowedBook, returnBook } = require('../controllers/bookControllers')

const bookRoutes = express.Router()


bookRoutes.post("/createBook", createBook)      //Adding new book to library ==>admin access

bookRoutes.post("/viewAllBook", viewAllBook)             //display all book details

bookRoutes.post("/issueBook", issueBook)               //to issue abook to user

bookRoutes.post("/displayBorrowedBook", displayBorrowedBook)         //to show the borrowed books

bookRoutes.post("/returnBook", returnBook)           //to return book


module.exports = bookRoutes;      //exporting the user

