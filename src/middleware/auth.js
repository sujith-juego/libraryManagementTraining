const jwt=require('jsonwebtoken')

//secret key
const SECRET_KEY="Library"

//auth function
const auth=(req,res,next)=>{
    try{
        let token=req.headers.authorization
        if(token){
            let user=jwt.verify(token,SECRET_KEY) // token verify
            req.user_id=user.id
        }else{
            return res.json({
                response_message:"Unauthorized User",
                response_status:"401"
            })
        }
        next()
    }catch(error){
        res.json({
            response_message:"Unauthorized User",
            response_status:"401"
        })
    }
}

//exports the function
module.exports=auth
