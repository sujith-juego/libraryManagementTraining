const express = require('express')               //importing express

const { register, login, logout } = require('../controllers/userControllers')

const auth = require('../middleware/auth')

const userRoutes = express.Router()

userRoutes.post("/register",register)      //register for new user

userRoutes.post("/login",login)             //login for existing user

userRoutes.post('/logout',auth,logout)               //logout


module.exports = userRoutes;      //exporting the user
