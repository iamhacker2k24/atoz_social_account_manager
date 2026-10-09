const express = require("express");
const { generateAuthUrl, syncAccounts } = require("../controllers/socialAuthControllers");
const socialAuthRouter = express.Router();



socialAuthRouter.get("/:platfrom/url", generateAuthUrl)

socialAuthRouter.get("/sync", syncAccounts)


module.exporst = socialAuthRouter;