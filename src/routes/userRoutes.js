const express = require('express')               //importing express

const { register, login, logout, updatePassword } = require('../controllers/userControllers')

const userRoutes = express.Router()

userRoutes.post("/register", register)      //register for new user

userRoutes.post("/login", login)             //login for existing user

userRoutes.post('/logout', logout)               //logout

userRoutes.post('/updatePassword', updatePassword)                    //updating current password


module.exports = userRoutes;      //exporting the user
