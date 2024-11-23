# Login and User Management System
This project is a Node.js application for managing user authentication and password recovery. It includes features like user registration, login, OTP-based password recovery, and session management, ensuring secure and efficient user operations.

## Features
1. User Registration with unique username and email validation.
2. Secure password hashing using bcrypt.
3. OTP generation and email delivery for password recovery.
4. Password reset functionality with session expiration handling.
5. Mongoose-based MongoDB operations for user data storage.
6. RESTful APIs built with Express.
7. Frontend integration for seamless user interactions.

## Tech Stack
#### Backend: Node.js, Express.js
#### Database: MongoDB with Mongoose
#### Frontend: React.js
#### Authentication: bcrypt for password hashing, custom OTP logic, jwt for token
#### Email Service: Integration with an SMTP service for email notifications (e.g., Nodemailer)
#### APIs: RESTful APIs

## Setup Instructions
### Prerequisites
1. Node.js (v16 or higher)
2. MongoDB (Local or Cloud-based)
3. SMTP service credentials for email delivery
4. React.js for the frontend interface

### Environment Variables
Create a .env file in the client directory and configure the following variables:

.env
```
REACT_APP_SERVER_DOMAIN='<server_domain>' # example 'http://localhost:8080'
```

After that create a file in the Server Folder with the name config.js and put the below code inside it.

config.js
```
export default {
    JWT_SECRET : "<secret>",
    EMAIL: "steve.franecki@ethereal.email", // testing email & password
    PASSWORD : "sMf46xCzrvdrxvuagc",
    ATLAS_URI: "<MONGODB_ATLAS_URI>"
}
```

### Installation
Clone the repository:

```
git clone https://github.com/yourusername/loginapp.git
cd loginapp
cd server 
npm install
npm start
```

On another terminal
```
cd client 
npm install
npm start
```

## API Endpoints
### Authentication
#### Register User
POST /api/register

#### Login
POST /api/login

#### Password Recovery
Generate OTP
GET /api/generateOTP

Verify OTP
GET /api/verifyOTP

Create a Reset Session
GET /api/createResetSession

Reset Password
PUT /api/resetPassword

### User Profile
Get User Data
GET /api/user/:username

Update User Profile
PUT /api//updateUser

## Frontend Integration
The React.js frontend consumes the APIs for user registration, login, and password recovery. Use axios for API calls and formik for form management.

## Common Issues and Debugging Tips
### MongoDB Connection Issues:
Ensure your MONGO_URI is correct and the MongoDB service is running.
### SMTP Configuration:
Double-check your SMTP credentials and ensure the email service allows third-party app access.
### Mongoose Deprecation Warnings:
Use async/await instead of callbacks in Mongoose operations.
### Session Expiration:
Confirm the resetSession flag is correctly managed in req.app.locals.

## Contributing
Feel free to fork this repository, make improvements, and submit pull requests. Contributions are always welcome!

## License
This project is licensed under the MIT License.