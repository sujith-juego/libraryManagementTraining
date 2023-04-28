const jwt = require('jsonwebtoken')

// token validation
const validToken = async (user) => {
    const token = user.token

    const payloadBase64 = token.split('.')[1]
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString()
    const decoded = JSON.parse(decodedJson)
    const exp = decoded.exp
    const expired = (Date.now() >= exp * 1000)

    const confirm = jwt.verify(token, process.env.SECRET)
    // console.log(confirm)
    if (confirm.mail === user.mail) {
        return expired
    }
}

module.exports = { validToken }
