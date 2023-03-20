const userData = require('../json/userJson.json')

const fs = require('fs')             //filesystem library
const jwt = require('jsonwebtoken')
const { writeFile } = require('fs')
const bcrypt = require("bcrypt")
const generateSafeId = require('generate-safe-id')
const process = require('process')
const { cwd } = require('process')
const { token } = require('morgan')
const path = process.cwd() + "/src/json/userJson.json"

function isTokenExpired(token) {
  const payloadBase64 = token.split('.')[1];
  const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
  const decoded = JSON.parse(decodedJson)
  const exp = decoded.exp;
  const expired = (Date.now() >= exp * 1000)
  return expired
}


const register = async (req, res) => {
  const { user_name, mail, password } = req.body

  try {
    //checking if empty
    if (!(user_name && mail && password)) {
      return res.json({
        response_message: "PLEASE ENTER ALL THE FIELDS",
        response_status: "400"
      })
    }
    //mail validation
    let validEmail = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})$/
    if (!mail.match(validEmail) || (typeof user_name == "number") || (typeof password != "string")) {
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
    const hashedPassword = await bcrypt.hash(password, 10)     //password hashing
    // return res.json(id)    =>working
    // let index = userData.length + 1


    const obj = {
      user_id: id,
      user_name: user_name,
      mail: mail,
      hashedPassword: hashedPassword,
      user_role: 'student',
      token: null,
      borrowed_books: []
    }
    // return res.json(obj) ===>working
    userData.push(obj);            //adding new user to the json object
    // return res.json(userData)==>working
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
        return res.json({
          response_message: `An error has occurred  ${error}`,
          response_status: "422"
        })
      } else {
        return res.json({
          response_message: "User Registered Successfully",
          response_status: "200",
          response_object: obj

        })

      }
    })
  } catch (error) {
    // console.log(error);
    return res.json({
      response_message: "Something went wrong",
      response_status: "500"
    })
  }

}

const login = async (req, res) => {
  const { mail, password } = req.body
  try {
    if (!(mail && password)) {
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
    const index = userData.indexOf(user)
    // console.log(index)
    const bool = await bcrypt.compare(password, user.hashedPassword)
    // console.log(bool)

    //  create jwt token = Authorization
    if (bool) {

      //create token
      const token = await jwt.sign({ mail: mail },
        process.env.SECRET, {
        expiresIn: '1h',
      });
      // console.log(token)
      user.token = token
      // console.log(user) //==>working
      //   userData.push(obj);            //adding user token to the json object
      // return res.json(userData) //==>working
      const jsonString = JSON.stringify(userData, null, 2)

      writeFile(path, jsonString, (error) => {
        if (error) {
          return res.json({
            response_message: `An error has occurred  ${error}`,
            response_status: "422"
          })
        } else {
          return res
            .status(200)
            .json({ message: "User Logged in Successfully", token })
        }
      })


    } else {
      return res.json({
        response_message: "Invalid password",
        response_status: "412"
      })

    }
  } catch (error) {
    {
      return res.json({
        response_message: "Something went wrong",
        response_status: "500"
      })
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
    // console.log(user)        //==>working
    if (!(user.token == null)) {
      const index = userData.indexOf(user)
      // console.log(index)
      userData[index].token = null
      const jsonString = JSON.stringify(userData, null, 2)
      writeFile(path, jsonString, (error) => {
        if (error) {
          return res.json({
            response_message: `An error has occurred  ${error}`,
            response_status: "422"
          })
        } else {
          return res
            .status(202)
            .json({ message: "User Logged out Successfully" })
        }
      })
    }
    return res.json({
      response_message: "An error has Occurred",
      response_status: "423"
    })
  } catch (error) {
    return res.json({
      response_message: "Something went wrong",
      response_status: "500"
    })
  }
}

//to update the password
const updatePassword = async (req, res) => {
  const { token, old_password, new_password } = req.body
  try {
    if (token === undefined || old_password === undefined || new_password === undefined) {
      return res.json({
        response_message: "PLEASE ENTER ALL THE FIELDS",
        response_status: "400"
      })
    } else {
      if(old_password == new_password){
        return res.json({
          response_message: "New password cannot be same as old password",
          response_status: "412"
        })
      }
      const user = await userData.find((userData) => {
        return userData.token == token
      })
      // console.log(user)
      const expire = isTokenExpired(token)    //checking for token expiration
      if (expire) {
        return res.json({
          response_message: "Session Expired",
          response_status: "401"
        })
      } else {
        const bool = await bcrypt.compare(old_password, user.hashedPassword)
        if (bool) {
          const hashedPassword = await bcrypt.hash(new_password, 10)
          user.hashedPassword = hashedPassword
          const jsonString = JSON.stringify(userData, null, 2)
          writeFile(path, jsonString, (error) => {
            if (error) {
              return res.json({
                response_message: `An error has occurred  ${error}`,
                response_status: "422"
              })
            } else {
              return res.json({
                response_message: "Password Updated Successfully",
                response_status: "200"
              })
            }
          })
        } else {
          return res.json({
            response_message: "Invalid password",
            response_status: "412"
          })
        }
      }
    }
  } catch (error) {
    return res.json({
      response_message: "Something went wrong",
      response_status: "500"
    })
  }
}





//exports the function
module.exports = { register, login, logout, updatePassword }


