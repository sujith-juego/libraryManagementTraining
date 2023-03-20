const fs = require('fs')
const jwt = require('jsonwebtoken')
const process = require('process')

const { writeFile } = require('fs')

const auth = require('../middlewares/auth')
const bookData = require('../json/bookJson.json')
const userData = require('../json/userJson.json')
const bookPath = process.cwd() + "/src/json/bookJson.json"
const userPath = process.cwd() + "/src/json/userJson.json"


// Token verification
function isTokenExpired(token) {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    const decoded = JSON.parse(decodedJson)
    const exp = decoded.exp;
    const expired = (Date.now() >= exp * 1000)
    return expired
}

// To display books by 4 various parameters
const viewAllBook = async (req, res) => {
    const { token, book_id, author, category, status } = req.body
    const category1 = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()   //category ==> category1
    const author1 = author.toUpperCase()            //author ==>author1

    if (token === undefined) {
        return res.json({
            response_message: "Please login to your account",
            response_status: "426"
        })
    }
    const user = await userData.find(
        (userData) => {
            return userData.token == token
        })

    if (user) {
        // token verification
        // const decode = jwt.verify(token, process.env.SECRET);
        const expire = isTokenExpired(token)
        if (expire) {
            // login expired 
            return res.json({
                response_message: "Session Expired , Login Again",
                response_status: "425"
            })
        } else {   //token is active

            // when no parameter is given  
            if (book_id === undefined && author === undefined && category === undefined && status === undefined) {
                return res.json({
                    response_message: "Book details",
                    response_status: "200",
                    bookData
                })
            }
            //when any one parameter is given 
            // when book_id is given 
            else if (author === undefined && category === undefined && status === undefined) {
                const book = await bookData.find(    //fetching for book by book_id
                    (bookData) => {
                        return bookData.book_id == book_id
                    })
                if (!book) {  //if book not found
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })
                } else {
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            // when author1 is given
            else if (book_id === undefined && category === undefined && status === undefined) {
                const book = await bookData.filter(         //fetching for books by author name
                    (bookData) => {
                        return bookData.author == author1
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })
                } else {
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            // when category1 is given
            else if (book_id === undefined && author === undefined && status === undefined) {
                const book = await bookData.filter(         //fetching for books by category
                    (bookData) => {
                        return bookData.category == category1
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })
                } else {
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            // when status is given
            else if (book_id === undefined && author === undefined && category === undefined) {
                const book = await bookData.filter(             //fetching for books by status
                    (bookData) => {
                        return bookData.status == status
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })
                } else {
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            //when any 2 parameters are given
            //when book_id and category1 is given
            else if (author === undefined && status == undefined) {
                const book = await bookData.filter(             //filtering the bookData by book_id and category
                    (bookData) => {
                        return (bookData.book_id == book_id && bookData.category == category1)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })
                } else {
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            //when book_id and author is given
            else if (category === undefined && status == undefined) {
                const book = await bookData.filter(   //filtering the bookData by book_id and author  
                    (bookData) => {
                        return (bookData.book_id == book_id && bookData.author == author1)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })
                } else {
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            //when book_id and status is given
            else if (category == undefined && author == undefined) {
                const book = await bookData.filter(             //filtering the book data by book_id and status
                    (bookData) => {
                        return (bookData.book_id == book_id && bookData.status == status)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else {
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            //when author and category is given
            else if (book_id == undefined && status == undefined) {
                const book = await bookData.filter(             //filtering the book data by author and category
                    (bookData) => {
                        return (bookData.author == author1 && bookData.category == category1)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else {
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            //when author and status is given
            else if (book_id == undefined && category == undefined) {
                const book = await bookData.filter(             //filtering the book data by author and status
                    (bookData) => {
                        return (bookData.author == author1 && bookData.status == status)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })
                } else {
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            //when status and category is given
            else if (book_id == undefined && author == undefined) {
                const book = await bookData.filter(         //filtering book data by status and category
                    (bookData) => {
                        return (bookData.status == status && bookData.category == category1)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })
                } else {
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            //when any 3 parameters are given
            // when book_id , author ,category are given
            else if (status == undefined) {
                // Filtering book data by bookid, author and category
                const book = await bookData.filter(
                    (bookData) => {
                        return (bookData.book_id == book_id && bookData.author == author1 && bookData.category == category1)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else {
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            // when book_id , author ,status are given
            else if (category == undefined) {
                // Filtering book data by bookid, author and status
                const book = await bookData.filter(
                    (bookData) => {
                        return (bookData.book_id == book_id && bookData.author == author1 && bookData.status == status)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else {
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            // when book_id, status ,category are given
            else if (author == undefined) {
                // Filtering book data by bookid ,status and category
                const book = await bookData.filter(
                    (bookData) => {
                        return (bookData.book_id == book_id && bookData.status == status && bookData.category == category1)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else {
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            // when category, status, author are given
            else if (book_id == undefined) {
                // Filtering book data by category ,status and author
                const book = await bookData.filter(
                    (bookData) => {
                        return (bookData.category == category1 && bookData.status == status && bookData.author == author1)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })
                } else {
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            // when all are given
            else {
                // Fetching book details when all are given
                const book = await bookData.filter(
                    (bookData) => {
                        return (bookData.book_id == book_id && bookData.author == author1 && bookData.status == status && bookData.category == category1)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })
                } else {
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }


        } //else part of expire
    } //user ending
}

// To create a book
const createBook = async (req, res) => {
    const { token, book_name, author, category } = req.body
    const category1 = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()   //category ==> category1
    const author1 = author.toUpperCase()            //author ==>author1
    const book_name1 = book_name.toUpperCase()

    if (token === undefined) {
        return res.json({
            response_message: "Please login to your account",
            response_status: "426"
        })
    }
    const user = await userData.find(
        (userData) => {
            return userData.token == token
        })

    if (user) {
        // token verification
        // const decode = jwt.verify(token, process.env.SECRET)
        const expire = isTokenExpired(token)
        if (expire) {
            // login expired 
            return res.json({
                response_message: "Session Expired , Login Again",
                response_status: "425"
            })
        } else {   //token is active
            // checking for admin access
            if (user.user_role == "admin") {
                let aiid = bookData.length + 1
                // console.log(aiid)
                const obj = {
                    book_id: aiid,
                    book_name: book_name1,
                    author: author1,
                    category: category1,
                    status: '1',
                    added_by: user.user_name
                }
                bookData.push(obj);            //adding new user to the json object
                const jsonString = JSON.stringify(bookData, null, 2)

                writeFile(bookPath, jsonString, (error) => {
                    if (error) {
                        return res.json({
                            response_message: `An error has occurred  ${error}`,
                            response_status: "422"
                        })
                    } else {
                        return res.json({
                            response_message: "Book Added Successfully",
                            response_status: "200",
                            response_object: obj
                        })
                    }
                })
            }
            else {
                return res.json({
                    response_message: "Access Denied",
                    response_status: "403"
                })
            }
        }
    }
}



// to issue a book to user
const issueBook = async (req, res) => {
    const { token, book_id, required_days } = req.body
    if (token === undefined) {
        return res.json({
            response_message: "Please login to your account",
            response_status: "426"
        })
    }
    if (book_id === undefined) {
        return res.json({
            response_message: "Please do provide the book id",
            response_status: "428"
        })
    }
    const user = await userData.find(
        (userData) => {
            return userData.token == token
        })
    const book = await bookData.find(
        (bookData) => {
            return bookData.book_id == book_id
        })
    if (user) {
        //Validating token
        const expire = isTokenExpired(token)
        // console.log(expire)
        if (expire) {
            // login expired
            return res.json({
                response_message: "Session Expired, Login Again",
                response_status: "425"
            })
        }
    }
    if (book) {
        // Book issue will be done here
        if (book.status == "2") {   //checking for availability
            return res.json({
                response_message: "Book is currently unavailable.",
                response_status: "427"
            })
        }
    }
    if (user && book) {
        if (book.status == "2") {   //checking for availability
            return res.json({
                response_message: "Book is currently unavailable.",
                response_status: "427"
            })
        } else {
            //add book status ==>1
            // userdata -> add book details he has borrowed
            const Uindex = userData.indexOf(user)
            const Bindex = bookData.indexOf(book)
            // console.log(Uindex)
            // console.log(Bindex)
            // const due_day = Date.now()+required_days
            if (required_days === undefined) {
                due_day = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
                ub_obj = {
                    book_id: book.book_id,
                    required_days: 15,
                    due_day: due_day,
                    return_day: null
                }
            } else {
                due_day = new Date(Date.now() + required_days * 24 * 60 * 60 * 1000)
                ub_obj = {
                    book_id: book.book_id,
                    required_days: required_days,
                    due_day: due_day,
                    return_day: null
                }
            }
            // console.log(due_day)
            // console.log(ub_obj)
            // console.log(userData[Uindex])
            const borrow_index = user['borrowed_books'].length
            // console.log(borrow_index)
            const borrow = borrow_index + 1
            user['borrowed_books'].push(ub_obj);
            // console.log(user['borrowed_books'])
            // console.log(userData[Uindex])
            // Object.assign(userData[Uindex][1], { borrowed_books: ub_obj });
            // console.log(userData[Uindex])
            const userjsonString = JSON.stringify(userData, null, 2)
            console.log(userjsonString)
            writeFile(userPath, userjsonString, (error) => {
                if (error) {
                    return res.json({
                        response_message: `An error has occurred`,
                        response_status: "422"
                    })
                } else {
                    return res
                        .status(202)
                        .json({
                            response_message: "User issued with a book successfully",
                            response_status: "200"
                        })
                }
            })
            bookData[Bindex].status = "2"
            const jsonString = JSON.stringify(bookData, null, 2)
            writeFile(bookPath, jsonString, (error) => {
                if (error) {
                    return res.json({
                        response_message: `An error has occurred`,
                        response_status: "422"
                    })
                }
                else {
                    return res.json({
                        response_message: "Book Issued Successfully",
                        response_status: "200",
                        response_object: book
                    })
                }
            })
        }
    }
    else {
        return res.json({
            response_message: "Something went wrong",
            response_status: "403"
        })
    }
}




module.exports = { viewAllBook, createBook, issueBook }