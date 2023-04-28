const express = require('express')
const dotenv = require('dotenv')
const userRoutes = require("./src/routes/userRoutes")   //to handle user routes
const bookRoutes = require("./src/routes/bookRoutes")   //to handle book routes

const app = express()

app.use(express.json())

app.use("/user", userRoutes)        //handling user routes

app.use("/book", bookRoutes)        //handling book routes

// to handle the undefined methods
app.get('*', function (req, res) {
    return res
        .status(404)
        .json({ response_message: "Not Found", response_status: (404) })
})
app.post('*', function (req, res) {
    return res
        .status(404)
        .json({ response_message: "Not Found", response_status: (404) })
})

dotenv.config()
const port = process.env.PORT || 8005
app.listen(port, () => console.log(`Server started at port ${port}`))
