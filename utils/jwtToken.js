const jwt = require('jsonwebtoken')
const createError = require('http-errors')



module.exports = {
    signAccessToken: (user_id)=> {
        return new Promise(resolve,reject)=> {
            const payload = {
                name : "yours truly"
            }
            const secret = process.env.SECRET_KEY
            const options= {}
            jwt.sign(payload,secret,options,(err,token)=>{
                if(err) reject(err)
                resolve(token)
            })
        }
    }
}