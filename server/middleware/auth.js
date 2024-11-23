import jwt from "jsonwebtoken";
import ENV from "../config.js";

export default async function Auth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        
        //retrive user detai of logged in user
        const decoded_token =await jwt.verify(token, ENV.JWT_SECRET)

        req.user = decoded_token;

        //res.json(decoded_token);
        next();        
    } catch (error) {
        res.status(401).json({ error: "Aunthentication failed " });
    }
} 

export function localVariables(req, res, next){
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next();
}