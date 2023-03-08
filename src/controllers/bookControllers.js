const bookData = require('../json/bookJson.json')

const fs = require('fs')
const bookLibrary = {}

bookLibrary.addBook = async(req,res) => {
    const {book_id, book_name, author, category ,accress_token } = req.body
    try {
        if(!book_id || !book_name || !author || !category){
            return res.status(400).json({message: "Please fill all the fields"})
        }
        if(accress_token!== process.env.ACCRESS_TOKEN){
            return res.status(401).json({message: "Unauthorized"})
        }
        const book = {
            book_id,
            book_name,
            author,
            category
        }
        await bookData.push(book)
        await fs.writeFile('./json/bookJson.json',JSON.stringify(bookData,null,2),(err) =>{
            if(err){
                return res.status(500).json({message: err})
            } else {
                return res.status(201).json({message: "Book added successfully",
                                             Object: obj
            })
            }
        })
        
    } catch (error) {
      console.log(error)
      return res.status(500).json({message: "Something went wrong"})  
    }
}

bookLibrary.viewAll = async(req,res) => {
    try {
        const books = await bookData
        return res.status(200).json(books)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Something went wrong"})  
    }
}

bookLibrary.borrowBook = async(req,res) => {
    const {book_id, accress_token } = req.body
    //pending 
}

bookLibrary.returnBook = async(req,res) => {
    const {book_id, accress_token } = req.body
    //pending
}

bookLibrary.displayBorrowed = async(req,res) => {
    const {accress_token } = req.body
    //pending
}

module.exports = bookLibrary