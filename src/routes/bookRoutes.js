const express = require('express')               //importing express

const { addBook,viewAll, borrowBook, returnBook, displayBorrowed } = require('../controllers/bookControllers')

const bookRoutes = express.Router()

bookRoutes.post("/addBook",addBook)             //adding new book

bookRoutes.post("/viewAll",viewAll)      // Viewing all bookks

bookRoutes.post("/borrowBook",borrowBook)             // Book issue

bookRoutes.post('/returnBook',returnBook)               // Book return

bookRoutes.post('/displayBorrowed',displayBorrowed)                 //to show the borrowed books

module.exports = bookRoutes         //exporting the book




