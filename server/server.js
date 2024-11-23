import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');

const port = 8080;

app.get("/", (req, res) => {
    res.status(200).json("Hello world")  
});

/*Routes */
app.use("/api", router);

/**Start server only after connecting to database */
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });        
    } catch (error) {
        console.log("Cannot connect to server", error);
    }
}).catch((error) => {
    console.log("Invalid database connection", error);
});


