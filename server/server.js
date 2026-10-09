const express = require("express")
const cors = require("cors");
const dbConnection = require("./config/db");
const authRouter = require("./authRouts");
require('dotenv').config()
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());



app.get("/", (req, res) => {
    res.send(" server health very good condion")
})

app.use("/api", authRouter)
app.listen(PORT, async () => {
    await dbConnection()
    console.log("server started ")
})

// 3.57