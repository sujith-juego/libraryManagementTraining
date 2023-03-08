const express = require('express')               //importing express

const { register, login, logout } = require('../controllers/userControllers')

const userRoutes=express.Router()

userRoutes.post("/Register",register)      //register for new user

userRoutes.post("/login",login)             //login for existing user

userRoutes.delete('/logout',logout)               //logout


module.exports = userRoutes;      //exporting the user