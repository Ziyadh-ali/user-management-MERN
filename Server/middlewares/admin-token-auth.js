import jwt from "jsonwebtoken"

const authenticate_admin_token = (req,res,next)=>{
    const authHeader = req.headers["authorization"];
    
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message :  "Unauthorized - No token provided",
        })
    }

    const token = authHeader.split(" ")[1];
    
    jwt.verify(token,process.env.ACCESS_SECRET,
        (err,decoded)=>{
            if(err){
                return res.status(401).json({
                    message : "Forbidden - Invalid or expired token"
                });
            }
            req.user = decoded
            next();
        }
    )
}
export default authenticate_admin_token