const fs = require('fs')
const process = require('process')

// Importing date-and-time module
const date = require('date-and-time')

const { writeFile } = require('fs')

const bookData = require('../json/bookJson.json')
const userData = require('../json/userJson.json')
const validation = require('../middlewares/auth')
const bookPath = process.cwd() + "/src/json/bookJson.json"
const userPath = process.cwd() + "/src/json/userJson.json"


//formatted date
function format(inputDate) {
    let date, month, year;
    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();

    date = date
        .toString()
        .padStart(2, '0');

    month = month
        .toString()
        .padStart(2, '0');

    return `${month}/${date}/${year}`;
}


// To display books by 4 various parameters
const viewAllBook = async (req, res) => {
    const { token, book_id, author, category, status } = req.body
    if (!(category === undefined)) {
        const category1 = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()   //category ==> category1
    }
    if (!(author === undefined)) {
        const author1 = author.toUpperCase()            //author ==>author1
    }

    if (token === undefined) {
        return res
            .status(426)
            .json({ response_message: "Please login to your account", response_status: "426" })
    }
    const user = await userData.find(
        (userData) => {
            return userData.token == token
        })

    if (user) {
        // token verification
        const expire = validation.validToken(user)    //checking for token expiration
        if (!(expire)) {
            // login expired 
            return res
                .status(425)
                .json({ response_message: "Session Expired , Login Again", response_status: "425" })
        } else {   //token is active

            // when no parameter is given  
            if (book_id === undefined && author === undefined && category === undefined && status === undefined) {
                return res
                    .status(200)
                    .json({ response_message: "Book details", response_status: "200", response_object: bookData })
            }
            //when any one parameter is given 
            // when book_id is given 
            else if (author === undefined && category === undefined && status === undefined) {
                const book = await bookData.find(    //fetching for book by book_id
                    (bookData) => {
                        return bookData.book_id == book_id
                    })
                if (!book) {  //if book not found
                    return res
                        .status(428)
                        .json({ response_message: `Book details not found`, response_status: '428' })
                } else {
                    return res
                        .status(200)
                        .json({ response_message: `Book details`, response_status: '200', response_object: book })
                }
            }
            // when author1 is given
            else if (book_id === undefined && category === undefined && status === undefined) {
                const book = await bookData.filter(         //fetching for books by author name
                    (bookData) => {
                        return bookData.author == author1
                    })
                if (!book) {
                    return res
                        .status(428)
                        .json({ response_message: `Book details not found`, response_status: '428' })
                } else {
                    return res
                        .status(200)
                        .json({ response_message: `Book details`, response_status: '200', response_object: book })
                }
            }
            // when category1 is given
            else if (book_id === undefined && author === undefined && status === undefined) {
                const book = await bookData.filter(         //fetching for books by category
                    (bookData) => {
                        return bookData.category == category1
                    })
                if (!book) {
                    return res
                        .status(428)
                        .json({ response_message: `Book details not found`, response_status: '428' })
                } else {
                    return res
                        .status(200)
                        .json({ response_message: `Book details`, response_status: '200', response_object: book })
                }
            }
            // when status is given
            else if (book_id === undefined && author === undefined && category === undefined) {
                const book = await bookData.filter(             //fetching for books by status
                    (bookData) => {
                        return bookData.status == status
                    })
                if (!book) {
                    return res
                        .status(428)
                        .json({ response_message: `Book details not found`, response_status: '428' })
                } else {
                    return res
                        .status(200)
                        .json({ response_message: `Book details`, response_status: '200', response_object: book })
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
                    return res
                        .status(428)
                        .json({ response_message: `Book details not found`, response_status: '428' })
                } else {
                    return res
                        .status(200)
                        .json({ response_message: `Book details`, response_status: '200', response_object: book })
                }
            }
            //when book_id and author is given
            else if (category === undefined && status == undefined) {
                const book = await bookData.filter(   //filtering the bookData by book_id and author  
                    (bookData) => {
                        return (bookData.book_id == book_id && bookData.author == author1)
                    })
                if (!book) {
                    return res
                        .status(428)
                        .json({ response_message: `Book details not found`, response_status: '428' })
                } else {
                    return res
                        .status(200)
                        .json({ response_message: `Book details`, response_status: '200', response_object: book })
                }
            }
            //when book_id and status is given
            else if (category == undefined && author == undefined) {
                const book = await bookData.filter(             //filtering the book data by book_id and status
                    (bookData) => {
                        return (bookData.book_id == book_id && bookData.status == status)
                    })
                if (!book) {
                    return res
                        .status(428)
                        .json({ response_message: `Book details not found`, response_status: '428' })

                } else {
                    return res
                        .status(200)
                        .json({ response_message: `Book details`, response_status: '200', response_object: book })
                }
            }
            //when author and category is given
            else if (book_id == undefined && status == undefined) {
                const book = await bookData.filter(             //filtering the book data by author and category
                    (bookData) => {
                        return (bookData.author == author1 && bookData.category == category1)
                    })
                if (!book) {
                    return res
                        .status(428)
                        .json({ response_message: `Book details not found`, response_status: '428' })

                } else {
                    return res
                        .status(200)
                        .json({ response_message: `Book details`, response_status: '200', response_object: book })
                }
            }
            //when author and status is given
            else if (book_id == undefined && category == undefined) {
                const book = await bookData.filter(             //filtering the book data by author and status
                    (bookData) => {
                        return (bookData.author == author1 && bookData.status == status)
                    })
                if (!book) {
                    return res
                        .status(428)
                        .json({ response_message: `Book details not found`, response_status: '428' })
                } else {
                    return res
                        .status(200)
                        .json({ response_message: `Book details`, response_status: '200', response_object: book })
                }
            }
            //when status and category is given
            else if (book_id == undefined && author == undefined) {
                const book = await bookData.filter(         //filtering book data by status and category
                    (bookData) => {
                        return (bookData.status == status && bookData.category == category1)
                    })
                if (!book) {
                    return res
                        .status(428)
                        .json({ response_message: `Book details not found`, response_status: '428' })
                } else {
                    return res
                        .status(200)
                        .json({ response_message: `Book details`, response_status: '200', response_object: book })
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
                    return res
                        .status(428)
                        .json({ response_message: `Book details not found`, response_status: '428' })

                } else {
                    return res
                        .status(200)
                        .json({ response_message: `Book details`, response_status: '200', response_object: book })
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
                    return res
                        .status(428)
                        .json({ response_message: `Book details not found`, response_status: '428' })
                } else {
                    return res
                        .status(200)
                        .json({ response_message: `Book details`, response_status: '200', response_object: book })
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
                    return res
                        .status(428)
                        .json({ response_message: `Book details not found`, response_status: '428' })
                } else {
                    return res
                        .status(200)
                        .json({ response_message: `Book details`, response_status: '200', response_object: book })
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
                    return res
                        .status(428)
                        .json({ response_message: `Book details not found`, response_status: '428' })
                } else {
                    return res
                        .status(200)
                        .json({ response_message: `Book details`, response_status: '200', response_object: book })
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
                    return res
                        .status(428)
                        .json({ response_message: `Book details not found`, response_status: '428' })
                } else {
                    return res
                        .status(200)
                        .json({ response_message: `Book details`, response_status: '200', response_object: book })
                }
            }
        } //else part of expire
    } //user ending 
    else {
        return res
            .status(426)
            .json({ response_message: "Please login to your account", response_status: "426" })
    }
}

// To create a book
const createBook = async (req, res) => {
    const { token, book_name, author, category } = req.body
    const category1 = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()   //category ==> category1
    const author1 = author.toUpperCase()            //author ==>author1
    const book_name1 = book_name.toUpperCase()

    if (token === undefined) {
        return res
            .status(426)
            .json({ response_message: "Please login to your account", response_status: "426" })
    }
    const user = await userData.find(
        (userData) => {
            return userData.token == token
        })

    if (user) {
        // token verification
        const expire = validation.validToken(user)    //checking for token expiration
        if (!(expire)) {
            // login expired 
            return res
                .status(425)
                .json({ response_message: "Session Expired , Login Again", response_status: "425" })
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
                        return res
                            .status(422)
                            .json({ response_message: `An error has occurred`, response_status: "422" })
                    } else {
                        return res
                            .status(200)
                            .json({ response_message: "Book Added Successfully", response_status: "200", response_object: obj })
                    }
                })
            }
            else {
                return res
                    .status(403)
                    .json({ response_message: "Access Denied", response_status: "403" })
            }
        }
    } else {
        return res
            .status(426)
            .json({ response_message: "Please login to your account", response_status: "426" })
    }
}



// to issue a book to user
const issueBook = async (req, res) => {
    const { token, book_id, required_days } = req.body
    if (token === undefined) {
        return res
            .status(426)
            .json({ response_message: "Please login to your account", response_status: "426" })
    }
    if (book_id === undefined) {
        return res
            .status(428)
            .json({ response_message: "Please do provide the book id", response_status: "428" })
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
        // const expire = isTokenExpired(token)
        const expire = validation.validToken(user)    //checking for token expiration
        // console.log(expire)
        if (!(expire)) {
            // login expired
            return res
                .status(425)
                .json({ response_message: "Session Expired, Login Again", response_status: "425" })
        }
    } else {
        return res
            .status(426)
            .json({ response_message: "Please login to your account", response_status: "426" })
    }
    if (book) {
        // Book issue will be done here
        if (book.status == "2") {   //checking for availability
            return res
                .status(427)
                .json({ response_message: "Book is currently unavailable.", response_status: "427" })
        }
    }
    if (user && book) {
        //add book status ==>2
        // userdata -> add book details he has borrowed
        const Uindex = userData.indexOf(user)
        const Bindex = bookData.indexOf(book)
        // console.log(Uindex)
        // console.log(Bindex)
        // const due_day = Date.now()+required_days
        if (required_days === undefined) {
            due = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
            due_day = format(due)
            issued = new Date(Date.now())
            ub_obj = {
                book_id: book.book_id,
                issued_date: format(issued),
                required_days: 15,
                due_day: due_day,
                return_day: null
            }
        } else {
            due = new Date(Date.now() + required_days * 24 * 60 * 60 * 1000)
            due_day = format(due)
            issued = new Date(Date.now())
            ub_obj = {
                book_id: book.book_id,
                issued_date: format(issued),
                required_days: required_days,
                due_day: due_day,
                return_day: null
            }
        }
        // console.log(due_day)
        // console.log(ub_obj)
        // console.log(userData[Uindex])
        // const borrow_index = user['borrowed_books'].length
        // // console.log(borrow_index)
        // const borrow = borrow_index + 1
        user['borrowed_books'].push(ub_obj);
        // console.log(user['borrowed_books'])
        // console.log(userData[Uindex])
        // Object.assign(userData[Uindex][1], { borrowed_books: ub_obj });
        // console.log(userData[Uindex])
        const userjsonString = JSON.stringify(userData, null, 2)
        // console.log(userjsonString)
        writeFile(userPath, userjsonString, (error) => {
            if (error) {
                return res
                    .status(422)
                    .json({ response_message: `An error has occurred`, response_status: "422" })
            } else {
                return res
                    .status(200)
                    .json({ response_message: "Book Issued Successfully", response_status: "200" , response_object: book })
            }
        })
        bookData[Bindex].status = "2"
        const jsonString = JSON.stringify(bookData, null, 2)
        writeFile(bookPath, jsonString, (error) => {
            if (error) {
                return res
                    .status(422)
                    .json({ response_message: `An error has occurred`, response_status: "422" })
            }
            else {
                return res
                    .status(200)
                    .json({ response_message: "Book Issued Successfully", response_status: "200", response_object: book })
            }
        })
    }
    else {
        return res
            .status(403)
            .json({ response_message: "Something went wrong", response_status: "403" })
    }
}

// To view the borrowed books
const displayBorrowedBook = async (req, res) => {
    const { token } = req.body
    if (token === undefined) {
        return res
            .status(426)
            .json({ response_message: "Please login to your account", response_status: "426" })
    }
    const user = await userData.find(
        (userData) => {
            return userData.token == token
        })
    // console.log(user)
    if (user) {
        // const expire = isTokenExpired(token)
        const expire = validation.validToken(user)    //checking for token expiration
        // console.log(expire)
        if (!(expire)) {
            // login expired
            return res
                .status(425)
                .json({ response_message: "Session Expired, Login Again", response_status: "425" })
        } else {
            const books = await user['borrowed_books']
            return res
                .status(200)
                .json({ response_message: "Borrowed book details", response_status: '200', response_object: books })
        }
    }
    else {
        return res
            .status(426)
            .json({ response_message: "Please login to your account", response_status: "426" })
    }
}

//To return the book
const returnBook = async (req, res) => {
    const { token, book_id } = req.body
    if (token === undefined) {
        return res
            .status(426)
            .json({ response_message: "Please login to your account", response_status: "426" })
    }
    if (book_id === undefined) {
        return res
            .status(427)
            .json({ response_message: "Please do provide valid book id", response_status: "427" })
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
        // const expire = isTokenExpired(token)
        const expire = validation.validToken(user)    //checking for token expiration
        // console.log(expire)
        if (!(expire)) {
            // login expired
            return res
                .status(425)
                .json({
                    response_message: "Session Expired, Login Again",
                    response_status: "425"
                })
        }
    } else {
        return res
            .status(426)
            .json({ response_message: "Please login to your account", response_status: "426" })
    }
    if (book) {
        // Book return will be done here
        if (book.status == "1") {   //checking for returned already or not
            return res
                .status(429)
                .json({
                    response_message: "Book is returned already",
                    response_status: "429"
                })
        }
    } else {
        return res
            .status(427)
            .json({ response_message: "Please do provide valid book id", response_status: "427" })
    }
    if (user && book) {
        //add book status ==>1
        // userdata -> add book details he has returned
        const Uindex = userData.indexOf(user)
        const Bindex = bookData.indexOf(book)
        // console.log(Uindex)
        // console.log(Bindex)
        const returnd = new Date(Date.now())
        const return_day = format(returnd)
        // const diffInMs   = new Date(return_day) - new Date(book.issued_date)
        // const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
        // const moment = require('moment');
        // const diffInDays = moment(returnd).diff(moment(book.due_day), 'days');
        // console.log(diffInDays)
        // const delay = date.subtract( return_day, book.due_day ).toDays()
        // console.log(delay)


        const borrow = user['borrowed_books']
        // console.log(borrow)
        const bbook = await borrow.find(
            (borrow) => {
                return borrow.book_id == book_id
            })
        // console.log(bbook)
        const bbindex = borrow.indexOf(bbook)
        // console.log(bbindex)
        const delay = date.subtract(new Date(return_day), new Date(bbook.due_day)).toDays()
        // console.log(delay)

        ub_obj = {
            book_id: book_id,
            issued_date: bbook.issued_date,
            required_days: bbook.required_days,
            due_day: bbook.due_day,
            return_day: return_day,
            delay_days: delay
        }
        // bbook = ub_obj
        user['borrowed_books'][bbindex] = ub_obj
        const userjsonString = JSON.stringify(userData, null, 2)
        writeFile(userPath, userjsonString, (error) => {
            if (error) {
                return res
                    .status(422)
                    .json({
                        response_message: `An error has occurred`,
                        response_status: "422"
                    })
            } else {
                return res
                    .status(200)
                    .json({
                        response_message: `Book Returned Successfully with a delay of ${delay}`,
                        response_status: "200"
                    })
            }
        })
        bookData[Bindex].status = "1"
        const jsonString = JSON.stringify(bookData, null, 2)
        writeFile(bookPath, jsonString, (error) => {
            if (error) {
                return res
                    .status(422)
                    .json({
                        response_message: `An error has occurred`,
                        response_status: "422"
                    })
            } else {
                return res
                    .status(200)
                    .json({
                        response_message: `Book Returned Successfully`,
                        response_status: "200",
                        response_object: book
                    })
            }
        })
    } else {
        return res
            .status(403)
            .json({
                response_message: "Something went wrong",
                response_status: "403"
            })
    }
}




module.exports = { viewAllBook, createBook, issueBook, displayBorrowedBook, returnBook }



