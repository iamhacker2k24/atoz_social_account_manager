const express = require("express");
const { generateAuthUrl, syncAccounts } = require("../controllers/socialAuthControllers");
const socialAuthRouter = express.Router();



socialAuthRouter.get("/sync", syncAccounts)

// check done by post man woring 
// socialAuthRouter.get("/:platfrom", generateAuthUrl)



module.exports = socialAuthRouter;