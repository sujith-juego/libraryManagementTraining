const fs = require('fs')             //filesystem library
const jwt = require('jsonwebtoken')
const { writeFile } = require('fs')
const bcrypt = require("bcrypt")
const generateSafeId = require('generate-safe-id')
const process = require('process')
const { cwd } = require('process')
const userData = require('../json/userJson.json')
const path = process.cwd() + "/src/json/userJson.json"
const validation = require('../middlewares/auth')

// user rigister
const register = async (req, res) => {
  const { user_name, mail, password } = req.body

  try {
    //checking if empty
    if (!(user_name && mail && password)) {
      return res
        .status(400)
        .json({ response_message: "PLEASE ENTER ALL THE FIELDS", response_status: "400" })
    }
    //mail validation
    let validEmail = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})$/
    if (!mail.match(validEmail) || (typeof user_name == "number") || (typeof password != "string")) {
      return res
        .status(401)
        .json({ response_message: "Invalid credentials", response_status: "401" })
    }

    // user exists or not
    const exixtingUser = await userData.find(
      (userData) => {
        return userData.mail == mail
      }
    )
    if (exixtingUser) {
      return res
        .status(408)
        .json({ response_message: "User Already Exists", response_status: "408" })
    }

    // if not exist then create new user
    let id = generateSafeId()         //creating unique id
    const hashedPassword = await bcrypt.hash(password, 10)     //password hashing
    // default role is student for all
    const obj = {
      user_id: id,
      user_name: user_name,
      mail: mail,
      hashedPassword: hashedPassword,
      user_role: 'student',
      token: null,
      borrowed_books: []
    }
    userData.push(obj);            //adding new user to the json object
    const jsonString = JSON.stringify(userData, null, 2)
    // await fs.promises.writeFileSync('../json/userJson.json', jsonString )     

    //   fs.writeFile('../json/userJson.json', JSON.stringify(userData,null,2),err=>{
    //     if (err) return err
    //     return res.json({
    //       response_message: "User Registered Successfully",
    //       response_status: "200",
    //       response_object: obj
    //   })
    // })
    writeFile(path, jsonString, (error) => {
      if (error) {
        return res
          .status(422)
          .json({ response_message: `An error has occurred`, response_status: "422" })
      } else {
        return res
          .status(200)
          .json({ response_message: "User Registered Successfully", response_status: "200", response_object: obj })
      }
    })
  } catch (error) {
    return res
      .status(500)
      .json({ response_message: "Something went wrong", response_status: "500" })
  }

}

// user login
const login = async (req, res) => {
  const { mail, password } = req.body
  try {
    if (!(mail && password)) {
      return res
        .status(400)
        .json({ response_message: "PLEASE ENTER ALL THE FIELDS", response_status: "400" })
    }
    const user = await userData.find((userData) => {
      return userData.mail == mail
    })
    if (!user) {
      return res
        .status(404)
        .json({ response_message: "User Not Found", response_status: "404" })
    }
    const index = userData.indexOf(user)
    const bool = await bcrypt.compare(password, user.hashedPassword)

    //  create jwt token = Authorization
    if (bool) {
      //create token
      const token = await jwt.sign({ mail: mail },
        process.env.SECRET, {
        expiresIn: '1h',
      });
      user.token = token
      //   userData.push(obj);            //adding user token to the json object
      const jsonString = JSON.stringify(userData, null, 2)

      writeFile(path, jsonString, (error) => {
        if (error) {
          return res
            .status(422)
            .json({ response_message: `An error has occurred`, response_status: "422" })
        } else {
          return res
            .status(200)
            .json({ response_message: "User Logged in Successfully", response_status: "200", token: token })
        }
      })


    } else {
      return res
        .status(412)
        .json({ response_message: "Invalid Credentials", response_status: "412" })

    }
  } catch (error) {
    {
      return res
        .status(500)
        .json({ response_message: "Something went wrong", response_status: "500" })
    }
  }
}


// Logout method
const logout = async (req, res) => {
  const token = req.body.token
  try {
    const user = await userData.find((userData) => {
      return userData.token == token
    })
    if (!(user.token == null)) {
      const index = userData.indexOf(user)
      userData[index].token = null
      const jsonString = JSON.stringify(userData, null, 2)
      writeFile(path, jsonString, (error) => {
        if (error) {
          return res
            .status(422)
            .json({ response_message: `An error has occurred`, response_status: "422" })
        } else {
          return res
            .status(202)
            .json({ response_message: "User Logged out Successfully", response_status: "202" })
        }
      })
    } else {
      return res
        .status(422)
        .json({ response_message: "An error has Occurred", response_status: "422" })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ response_message: "Something went wrong", response_status: "500" })
  }
}

//to update the password
const updatePassword = async (req, res) => {
  const { token, old_password, new_password } = req.body
  try {
    if (token === undefined || old_password === undefined || new_password === undefined) {
      return res
        .status(401)
        .json({ response_message: "PLEASE ENTER ALL THE FIELDS", response_status: "401" })
    } else {
      if (old_password == new_password) {
        return res
          .status(412)
          .json({ response_message: "New password cannot be same as old password", response_status: "412" })
      }
      const user = await userData.find((userData) => {
        return userData.token == token
      })
      // const expire = isTokenExpired(token)    //checking for token expiration
      const expire = validation.validToken(user)    //checking for token expiration
      if (!(expire)) {
        return res
          .status(401)
          .json({ response_message: "Session Expired", response_status: "401" })
      } else if (user) {
        const bool = await bcrypt.compare(old_password, user.hashedPassword)
        if (bool) {
          const hashedPassword = await bcrypt.hash(new_password, 10)
          user.hashedPassword = hashedPassword
          const jsonString = JSON.stringify(userData, null, 2)
          writeFile(path, jsonString, (error) => {
            if (error) {
              return res
                .status(422)
                .json({ response_message: `An error has occurred`, response_status: "422" })
            } else {
              return res
                .status(200)
                .json({ response_message: "Password Updated Successfully", response_status: "200" })
            }
          })
        } else {
          return res
            .status(412)
            .json({ response_message: "Invalid password", response_status: "412" })
        }
      } else {
        return res
          .status(426)
          .json({ response_message: "Please login to your account", response_status: "426" })
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ response_message: "Something went wrong", response_status: "500" })
  }
}

//exports the function
module.exports = { register, login, logout, updatePassword }
