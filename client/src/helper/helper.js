import axios from 'axios';
import { jwtDecode } from 'jwt-decode';



axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


/** Make API Requests */


/** To get username from Token */
export async function getUsername() {
    const token = localStorage.getItem('token');
    if (!token) return Promise.reject("Cannot find Token");

    try {
        const decode = jwtDecode(token); // Decode the token
        return decode;
    } catch (error) {
        console.error("Invalid Token:", error.message);
        return Promise.reject("Invalid Token");
    }
}


/** authenticate function */
export async function authenticate(username){
    try {
        return await axios.post('/api/authenticate', { username })
    } catch (error) {
        return { error : "Username doesn't exist...!"}
    }
}

/** get User details */
export async function getUser({ username }) {
    try {
        const { data } = await axios.get(`/api/user/${username}`, {
            headers: {
                'Cache-Control': 'no-cache', // Force bypass cache
                Pragma: 'no-cache',
            },
        }); 
        return { data };
    } catch (error) {
        console.error("Error fetching user details:", error.message);
        return { error: "Error fetching user details" };
    }
}

/** register user function */
export async function registerUser(credentials){
    try {
        const { data : { msg }, status } = await axios.post(`/api/register`, credentials);

        let { username, email } = credentials;

        /** send email */
        if(status === 201){
            await axios.post('/api/registerMail', { username, userEmail : email, text : msg})
        }

        return Promise.resolve(msg)
    } catch (error) {
        const backendError = error?.response?.data?.error; // Extract error from backend response
        return Promise.reject(backendError || "Registration failed");
    }
}

/** login function */
export async function verifyPassword({ username, password }) {
    if (!username || !password) {
        throw new Error("Username and password are required");
    }

    try {
        const res = await axios.post('/api/login', { username, password });
        // Safely extract the token from the nested user object
        const token = res?.data?.user?.token;
        console.log(token)
        if (!token) {
            throw new Error("Token not found in API response");
        }

        // Save token to local storage
        localStorage.setItem('token', token);

        return res;
    } catch (error) {
        console.error("Login Error:", error.message);
        throw new Error("Login failed: " + error.message);
    }
}



/** update user profile function */
export async function updateUser(response){
    try {
        
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, { headers : { "Authorization" : `Bearer ${token}`}});

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error : "Couldn't Update Profile...!"})
    }
}

/** generate OTP */
export async function generateOTP(username) {
    try {
        const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { username } });

        // send mail with the OTP
        if (status === 201 || status === 200) {
            const { data } = await getUser({ username });
           
            const email = data?.rest?.email
            if (!email) throw new Error("Email not found for the user!");

            const text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('/api/registerMail', {
                username,
                userEmail: email,
                text,
                subject: "Password Recovery OTP",
            });
        }
        return Promise.resolve(code);
    } catch (error) {
        console.error("Error generating OTP:", error.message);
        return Promise.reject({ error });
    }
}


/** verify OTP */
export async function verifyOTP({ username, code }){
    try {
       const { data, status } = await axios.get('/api/verifyOTP', { params : { username, code }})
       return { data, status }
    } catch (error) {
        return Promise.reject(error);
    }
}

/** reset password */
export async function resetPassword({ username, password }){
    try {
        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return Promise.resolve({ data, status})
    } catch (error) {
        return Promise.reject({ error })
    }
}