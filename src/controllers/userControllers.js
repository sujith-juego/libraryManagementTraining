const userData = require('../json/userJson.json')

const fs = require('fs')             //filesystem library
const jwt = require('jsonwebtoken')
const util = require('util')
const { writeFile } = require('fs')
const bcrypt = require("bcrypt")
const generateSafeId = require('generate-safe-id')
const { error } = require('console')
const { signAccessToken } = require('../utils/jwtToken')

const register = async (req, res) => {
  const { user_name, mail, user_role, password} = req.body

  try {
    //checking if empty
    if (!(user_name && mail && password && user_role) ) {             
      return res.json({
        response_message: "PLEASE ENTER ALL THE FIELDS",
        response_status: "400"
      })
    }
    //mail validation
    let validEmail = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})$/                                     
    if (!mail.match(validEmail) || (typeof user_name == "number") || (typeof password != "string") || (typeof user_role != "string")) {
      return res.json({
        response_message: "Invalid credentials",
        response_status: "401"
      })
    }

    // user exists or not
    const exixtingUser = await userData.find(
      (userData) => {
        return userData.mail == mail
      }
    )
    if (exixtingUser) {
      return res.json({
        response_message: "User Already Exists",
        response_status: "404"
      })
    }

    //return res.json(userData)  //==>working

    // if not exist then create new user
    let id = generateSafeId()         //creating unique id
    const hashedPassword = await bcrypt.hash(password,10)     //password hashing
    // return res.json(id)    =>working
    // let index = userData.length + 1
    const obj = {
      user_id: id,
      user_name: user_name,
      mail: mail,
      hashedPassword: hashedPassword,
      user_role: user_role
    }
    // return res.json(obj) ===>working
    userData.push(obj);            //adding new user to the json object
    // return res.json(userData)==>working
    const jsonString = JSON.stringify(userData, null, 2)
    // await fs.promises.writeFileSync('../json/userJson.json', jsonString )     
    
    // fs.writeFile('../json/userJson.json', JSON.stringify(userData,null,2))

      const path = '/home/sujithprabhu/Desktop/Project111/libraryManagement/src/json/userJson.json'
      writeFile(path, jsonString, (error) => {
        if (error) {
          return res.json({
            response_message:`An error has occurred  ${error}`,
            response_status:"422"
        })
      } else {
        return res.json({
        response_message: "User Registered Successfully",
        response_status: "200",
        response_object: obj
      })
    }
    })
    }catch(error) {
      console.log(error);
      return res.json({
        response_message: "Something went wrong",
        response_status: "500"
      })
    }
    
}

const login = async (req, res) => {
  const { mail, password } = req.body
  try {
    if (!(mail && password) ) {             
      return res.json({
        response_message: "PLEASE ENTER ALL THE FIELDS",
        response_status: "400"
      })
    }
    const user = await userData.find((userData) => {
      return userData.mail == mail
    })
// console.log(user)        //==>working
    if (!user) {
      return res.json({
        response_message: "User Not Found",
        response_status: "404"
      })
    }

    // const hashedPassword = await bcrypt.hash(password,10)     //password hashing
    // console.log(hashedPassword)
    //  to compare the passwords
    const bool = await  bcrypt.compare(password,user.hashedPassword)
    // console.log(bool)

    //  create jwt token = Authorization
    if (bool) {
      const accessToken = await signAccessToken(user.mail)
      // const accessToken = jwt.sign(user, secret)
    //  send JWT token to frontend requestor
      res.status(200).send({ accessToken: accessToken })
      } else {
        return res.json({
          response_message: "Invalid password",
          response_status:"412"
    })
  }
  



    // } else {
    //   return res.json({
    //     response_message:"Login Successful",
    //     response_status:200
    //   })
    // }


  // res.send(`Mail: ${mail} Password: ${password}`);
  } catch (error) {
    res.send(error)
  }
}







const logout = async (req, res) => {
}

//exports the function
module.exports = { register, login, logout }


