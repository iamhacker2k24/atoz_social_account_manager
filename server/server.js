const express = require("express")
const cors = require("cors");
const dbConnection = require("./config/db");
const authRouter = require("./routes/authRouts");
const socialAuthRouter = require("./routes/socialAuthRoutes");
const accountRouter = require("./routes/accountRoutes");

require('dotenv').config()
const app = express();
const PORT = process.env.PORT;
app.use(express.json());

app.use(cors());



app.get("/", (req, res) => {
    res.send(" server health in good condion")
})

app.use("/api", authRouter)
app.use("/api/oauth", socialAuthRouter)
app.use("/api/accounts", accountRouter)
app.listen(PORT, async () => {
    await dbConnection()
    console.log("server started ")
})
