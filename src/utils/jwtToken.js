const jwt = require('jsonwebtoken')
const createError = require('http-errors')



module.exports = {
    signAccessToken: (mail)=> {
        // return mail
        // return new Promise((resolve,reject)=> {
        //     const payload = {
        //         mail : mail
        //     }
        //     const secret = "Library"
        //     const options= {
        //         expiresIn: '1h'
        //     }
        //     jwt.sign(payload,secret,options,(err,token)=>{
        //         if(err) reject(err)
        //         resolve(token)
        //     })
        // })
        const payload = {
            mail : mail
        }
        const secret = "Library"
        const options= {
            expiresIn: '1h'
        }
        const token = jwt.sign(payload,secret,options)
        return token
    }
}