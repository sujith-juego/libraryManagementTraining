const express = require('express')
const dotenv = require('dotenv')
// const routes = express.Router()
const userRoutes = require("./src/routes/userRoutes")


const app = express()

// app.use(require('./Routes/userRoutes'))

app.use(express.json())

app.use("/user",userRoutes)



// app.use("/addBook",bookRoutes)
// app.use("/viewAll", bookRoutes)
// app.use("/borrowBook", bookRoutes)
// app.use("/returnBook", bookRoutes)

dotenv.config()
const port = process.env.PORT || 8005
app.listen(port,() => console.log(`Server started at port ${port}`))
