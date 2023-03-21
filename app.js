const express = require('express')
const dotenv = require('dotenv')
// const routes = express.Router()
const userRoutes = require("./src/routes/userRoutes")
const bookRoutes = require("./src/routes/bookRoutes")

const app = express()

app.use(express.json())

app.use("/user", userRoutes)

app.use("/book", bookRoutes)

app.get('*', function (req, res) {
    return res
        .status(404)
        .json({ response_message: "Not Found", response_status: (404) })
})

dotenv.config()
const port = process.env.PORT || 8005
app.listen(port, () => console.log(`Server started at port ${port}`))
