import nodemailer from "nodemailer";
import Mailgen from "mailgen";

import ENV from "../config.js";

//https://ethereal.email/create
let nodeConfig ={
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: ENV.EMAIL,
          pass: ENV.PASSWORD,
        },
};

let transport = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: "https://mailgen.js/"
    }
});

/** POST: http://localhost:8080/api/registerMail 
 * @param : {
    "username" : "example123",
    "userEmail": "example@gmail.com",
    "text": "Welcome to Mailgen! Please verify your email by clicking on the link below.",
    "subject": "Signup Successful"
 }
*/
export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    // body of the email
    var email = {
        body: {
            name: username,
            intro: text || 'Welcome to Mailgen!',
            action: {
                instructions: 'To get started, click here:',
                button: {
                    color: '#22BC66',
                    text: 'Confirmation',
                    link: 'https://mailgen.js/'
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    var emailBody = MailGenerator.generate(email);

    let message = {
        from: ENV.EMAIL,
        to: userEmail,
        subject: subject || "Signup Successful",
        html: emailBody
    };

    transport.sendMail(message)
        .then(() => {
            return res.status(201).json({ msg: "You should receive mail from us" });
        })
        .catch(error => res.status(500).json({ error: error , msg: "Error in sending mail"}));
}
    