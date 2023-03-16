const fs = require('fs')
const jwt = require('jsonwebtoken')


const { writeFile } = require('fs')


const bookData = require('../json/bookJson.json')
const userData = require('../json/userJson.json')
// console.log(bookData)

function isTokenExpired(token) {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    const decoded = JSON.parse(decodedJson)
    const exp = decoded.exp;
    const expired = (Date.now() >= exp * 1000)
    return expired
}

const viewAllBook = async (req, res) => {
    const {token ,book_id, author, category, status} = req.body
    const category1 = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()   //category ==> category1
    const author1 = author.toUpperCase()
    // console.log(token)
    // console.log(author)
    // console.log(book_id)
    // console.log(category1)
    // console.log(status)
    // console.log(bookData)
    // console.log(userData)

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
        // console.log(user)
        // token verification
        // const decode = jwt.verify(token, process.env.SECRET);
        const expire = isTokenExpired(token)
        // console.log(expire)
        // console.log(user)
        if (expire) {
            // login expired
            return res.json({
                response_message: "Session Expired , Login Again",
                response_status: "425"
            })
        } else {

        // when no parameter is given       =>working
            if (book_id === undefined && author === undefined && category === undefined && status === undefined) {
                return res.json({
                    response_message: "Book details",
                    response_status: "200",
                    bookData
                })
            }
        //when any one parameter is given 
            // when book_id is given ==> working
            else if (author === undefined && category === undefined && status === undefined) {
                // console.log(book_id)
                const book = await bookData.find(
                    (bookData) => {
                        return bookData.book_id == book_id
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else{
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            // when author1 is given ==> working
            else if (book_id === undefined && category === undefined && status === undefined) {
                // console.log(author)
                const book = await bookData.filter(
                    (bookData) => {
                        return bookData.author == author1
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else{
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            // when category1 is given ==> working
            else if (book_id === undefined && author === undefined && status === undefined) {
                // console.log(category)
                const book = await bookData.filter(
                    (bookData) => {
                        return bookData.category == category1
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else{
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            // when status is given ==> working
            else if (book_id === undefined && author === undefined && category === undefined) {
                // console.log(status)
                const book = await bookData.filter(
                    (bookData) => {
                        return bookData.status == status
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else{
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
        //when any 2 parameters are given
            //when book_id and category1 is given
            else if(author === undefined && status == undefined){
                // console.log(book_id)
                //console.log(category1)
                const book = await bookData.filter(
                    (bookData) => {
                        return (bookData.book_id == book_id && bookData.category == category1)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else{
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            //when book_id and author is given
            else if(category === undefined && status == undefined){
                // console.log(book_id)
                //console.log(author)
                const book = await bookData.filter(
                    (bookData) => {
                        return (bookData.book_id == book_id && bookData.author == author1)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else{
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            //when book_id and status is given
            else if(category == undefined && author == undefined){
                // console.log(status)
                //console.log(book_id)
                const book = await bookData.filter(
                    (bookData) => {
                        return (bookData.book_id == book_id && bookData.status == status)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else{
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            //when author and category is given
            else if(book_id == undefined && status == undefined){
                // console.log(author1)
                //console.log(category)
                const book = await bookData.filter(
                    (bookData) => {
                        return (bookData.author == author1 && bookData.category == category1)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else{
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            //when author and status is given
            else if(book_id == undefined && category == undefined){
                // console.log(author1)
                //console.log(status)
                const book = await bookData.filter(
                    (bookData) => {
                        return (bookData.author == author1 && bookData.status == status)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else{
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            //when status and category is given
            else if(book_id == undefined && author == undefined){
                // console.log(status)
                //console.log(category)
                const book = await bookData.filter(
                    (bookData) => {
                        return (bookData.status == status && bookData.category == category1)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else{
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
        //when any 3 parameters are given
            // when book_id , author ,category are given
            else if(status == undefined){
                // console.log(book_id)
                // console.log(author)
                // console.log(category)
                const book = await bookData.filter(
                    (bookData) => {
                        return (bookData.book_id == book_id && bookData.author == author1 && bookData.category == category1)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else{
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            // when book_id , author ,status are given
            else if(category == undefined){
                // console.log(book_id)
                // console.log(author)
                // console.log(status)
                const book = await bookData.filter(
                    (bookData) => {
                        return (bookData.book_id == book_id && bookData.author == author1 && bookData.status == status)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else{
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            // when book_id, status ,category are given
            else if(author == undefined){
                // console.log(book_id)
                // console.log(status)
                // console.log(category)
                const book = await bookData.filter(
                    (bookData) => {
                        return (bookData.book_id == book_id && bookData.status == status && bookData.category == category1)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else{
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
            // when category, status, author are given
            else if(book_id == undefined){
                // console.log(status)
                // console.log(category)
                // console.log(author)
                const book = await bookData.filter(
                    (bookData) => {
                        return (bookData.category == category1 && bookData.status == status && bookData.author == author1)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })

                } else{
                    return res.json({
                        response_message: `Book details`,
                        response_status: '200',
                        book
                    })
                }
            }
        // when all are given
            else {
                // console.log(book_id)
                // console.log(author)
                // console.log(status)
                // console.log(category)
                const book = await bookData.filter(
                    (bookData) => {
                        return (bookData.book_id == book_id && bookData.author == author1 && bookData.status == status && bookData.category == category1)
                    })
                if (!book) {
                    return res.json({
                        response_message: `Book details not found`,
                        response_status: '428',
                    })
                } else{
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








module.exports = { viewAllBook }