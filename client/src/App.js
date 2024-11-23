import React from "react";
import { createBrowserRouter, RouterProvider} from "react-router-dom"

/**import all components */
import Username from "./components/Username";
import Password from "./components/Password";
import Reset from "./components/Reset";
import Recovery from "./components/Recovery";
import Register from "./components/Register";
import PageNotFound from "./components/PageNotFound";
import Profile from "./components/Profile";

/** import middleware */
import { AuthorizeUser, ProtectRoute } from "./middleware/auth";

/** create router */
const router = createBrowserRouter([
    {
        path: "/",
        element: <Username />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/password",
        element: <ProtectRoute> <Password /></ProtectRoute>
    },
    {
        path: "/reset",
        element: <Reset />
    },
    {
        path: "/recovery",
        element: <Recovery />
    },    
    {
        path: "/profile",
        element: <AuthorizeUser> <Profile /> </AuthorizeUser>
    },    
    {
        path: "*",
        element: <PageNotFound />
    },
])

export default function App() {
    return (
        <main>
            <RouterProvider router={router} />
        </main>
    );
}
