const express = require('express')
const routes = express.Router()

const app = express()

// app.use(require('./Routes/userRoutes'))

const userRoutes = require("./src/routes/userRoutes")
const bookRoutes = require('./src/routes/bookRoutes')

app.use(express.json())

app.use("/register",userRoutes)
app.use("/login" ,userRoutes)
app.use("/logout",userRoutes)


app.use("/addBook",bookRoutes)
app.use("/viewAll", bookRoutes)
app.use("/borrowBook", bookRoutes)
app.use("/returnBook", bookRoutes)

const port = process.env.PORT || 3000
app.listen(port,() => console.log(`Server started at port ${port}`))
