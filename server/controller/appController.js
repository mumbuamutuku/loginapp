import UserModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import ENV from "../config.js";

// Example authentication middleware
export async function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).send({ error: "Authentication required" });
    }
    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        req.user = { userId: decoded.id }; // Populate req.user
        next();
    } catch (err) {
        return res.status(403).send({ error: "Invalid token" });
    }
}

export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method === "GET" ? req.query : req.body;

        if (!username) {
            return res.status(400).send({ error: "Username is required" });
        }

        const exist = await UserModel.findOne({ username });
        if (!exist) {
            return res.status(404).send({ error: "User not found" });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("VerifyUser Error:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
}


/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;

        const userExist = await UserModel.findOne({ username });
        if (userExist) {
            return res.status(400).send({ error: "Please use unique username" });
        }

        const emailExist = await UserModel.findOne({ email });
        if (emailExist) {
            return res.status(400).send({ error: "Please use unique email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({
            username,
            password: hashedPassword,
            profile: profile || '',
            email
        });

        const result = await user.save();
        
        return res.status(201).send({ msg: "User Register Successfully" });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).send({ error: error.message || "Internal Server Error" });
    }
}


/**POST: http://localhost:8080/login
 * @description Login user
 * @param {object} req request object
 * @param {object} res response object
 * @param: [
 * "username": "example123",
 * "password": "Password@123]
 */
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {            
            return res.status(404).send({ error: "User not found" });
        }        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ error: "Invalid password" });
        }
        const token = jwt.sign({
                username: user.username,
                id: user._id
             }, ENV.JWT_SECRET, {
                expiresIn: "24h"
            })
        return res.status(200).send({ msg: "User logged in successfully",
            user: {
                username: user.username,
                email: user.email,
                profile: user.profile,
                token
            }
         });
    } catch (error) {        
        return res.status(500).send({ error: error.message || "Internal Server Error" });
    }       
}

/**GET: http://localhost:8080/user/:username */
export async function getUser(req, res) {
    const { username } = req.params;

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {            
            return res.status(501).send({ error: "User not found" });        
        }   
        const { password, ...rest } = Object.assign({}, user.toJSON());            
        return res.status(200).send({ rest });                                          
    } catch (error) {
        return res.status(500).send({ error: error.message || "Internal Server Error" });
    }
}

/**PUT: http://localhost:8080/updateUser */
// export async function updateUser(req, res) {
//     try {
        
//         //const userId = req.query.id;
//         const { id } = req.user;
//         console.log(id);
        
//         if(id){
//             const body = req.body;

//             // update the data
//             await UserModel.updateOne({ _id : id }, body, function(err, data){
//                 if(err) {
//                     console.error("Error updating user:", err);
//                     return res.status(500).send({ error: "Failed to update user" });
//                 }
//                 return res.status(201).send({ msg : "Record Updated...!"});
//             })

//         }else{
//             return res.status(401).send({ error : "User Not Found...!"});
//         }

//     } catch (error) {
//         console.error("UpdateUser Error:", error);
//         return res.status(401).send({ error });
//     }
// }

export async function updateUser(req, res) {
    try {
        const { id } = req.user; // Extract userId from authenticated request

        if (!id) {
            return res.status(401).send({ error: "User Not Found" });
        }

        const body = req.body;

        if (!Object.keys(body).length) {
            return res.status(400).send({ error: "No data provided for update" });
        }

        const result = await UserModel.updateOne({ _id: id }, body);
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: "User not found" });
        }

        return res.status(200).send({ msg: "Record Updated!" });
    } catch (error) {
        console.error("UpdateUser Error:", error);
        return res.status(500).send({ error: error.message || "Internal Server Error" });
    }
}



/**GET: http://localhost:8080/generateOTP */
export async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenerator.generate(6, {
        digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
    }, (err, otp) => {
        if (err) {
            return res.status(500).send({ error: "Failed to generate OTP" });
        }
        return res.status(200).send({ otp });
    });
    res.status(201).send({ code: req.app.locals.OTP });
}


/**GET: http://localhost:8080/verifyOTP */
export async function verifyOTP(req, res) {
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; //reset OTP value
        req.app.locals.resetSession = true;
        return res.status(201).send({ msg: "OTP verified" });
    }
    return res.status(400).send({ error: "Invalid OTP" });
}

/**GET: http://localhost:8080/createResetSession */
export async function createResetSession(req, res) {
    if(req.app.locals.resetSession){
        // req.app.locals.resetSession = false; //allow only one reset session
        // return res.status(201).send({ msg: "Reset Session Created Access Granted" });
        return res.status(201).send({ flag : req.app.locals.resetSession})
    }
    return res.status(400).send({ error: "Reset Session Already Created Session Expired" });
}

/**PUT: http://localhost:8080/resetPassword */
export async function resetPasswords(req, res) {
    try {

        if(!req.app.locals.resetSession){
            return res.status(404).send({ error: "Reset Session Expired" });
        }
        const { username, password } = req.body;

        // Check if username exists
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).send({ error: "Username not found" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password
        const result = await UserModel.updateOne({ username }, { password: hashedPassword });
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: "Failed to update password" });
        }

        // Optionally reset the session state
        req.app.locals.resetSession = false;

        return res.status(201).send({ msg: "Password reset successfully" });
    } catch (error) {
        console.error("ResetPassword Error:", error);
        return res.status(500).send({ error: error.message || "Internal Server Error" });
    }
}
export async function resetPassword(req, res) {
    try {
        if (!req.app.locals.resetSession) {
            return res.status(440).send({ error: "Session expired!" });
        }

        const { username, password } = req.body;

        // Find the user
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).send({ error: "Username not found" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password
        const result = await UserModel.updateOne(
            { username: user.username },
            { password: hashedPassword }
        );

        // Check if the update was successful
        if (result.modifiedCount === 0) {
            return res.status(500).send({ error: "Failed to update the record" });
        }

        req.app.locals.resetSession = false; // Reset session flag
        return res.status(201).send({ msg: "Record updated successfully!" });

    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(500).send({ error: error.message || "Internal Server Error" });
    }
}
