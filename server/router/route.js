import { Router } from "express";

/**import all the controllers */
import * as controller from "../controller/appController.js";

import Auth, { localVariables } from "../middleware/auth.js";
import { registerMail } from "../controller/mailer.js";

const router = Router();

/**POST METHODS */
router.route("/register").post(controller.register); //register user

router.route("/registerMail").post(registerMail); //send the email

router.route("/authenticate").post(controller.verifyUser,(req, res) => res.end()); //authenticate user

router.route("/login").post(controller.verifyUser , controller.login); //login in app

router.route("/logout").post((req, res) => res.json("Logout")); //logout user


/**GET METHODS */
router.route("/user/:username").get(controller.getUser) //get user with username
router.route("/generateOTP").get(controller.verifyUser, localVariables, controller.generateOTP) //generate random OTP
router.route("/verifyOTP").get(controller.verifyUser, controller.verifyOTP) //verify OTP
router.route("/createResetSession").get(controller.createResetSession) //reset all the variables

/**PUT METHODS */
router.route("/resetPassword").put(controller.verifyUser, controller.resetPassword) //use to reset password
router.route("/updateUser").put(Auth, controller.updateUser) //use to update user profile

export default router;