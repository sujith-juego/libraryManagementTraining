const userData = require('../json/userJson.json')

// const { v4: uuidv4 } = require('uuid');

const fs = require('fs');             //filesystem library

const register = async (req, res) => {
  const { user_name, mail, password, user_role } = req.body
  try {
    //checking if empty
    if (!user_name || !mail || !password || !user_role) {             
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
    // if not exist then create new user
    //   let index = uuidv4();//generating unique id for particular user
    let index = userData.length + 1
    const obj = {
      user_id: index,
      user_name: user_name,
      mail: mail,
      user_role: user_role
    }
    await userData.push(obj);            //adding new user to the json object
    await fs.writeFile('./json/userJson.json', JSON.stringify(userData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: err })
      }
      else {
        return res.json({
          response_message: "User Registered Successfully",
          response_status: "200",
          response_object: obj
        })
      }
    })
  } catch (error) {
    console.log(error);
    return res.json({
      response_message: "Something went wrong",
      response_status: "500"
    })
  }
}
const login = async (req, res) => {
  const { mail, password } = req.body

}

const logout = async (req, res) => {
}

//exports the function
module.exports = { register, login, logout }


