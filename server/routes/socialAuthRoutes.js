const express = require("express");
const { generateAuthUrl, syncAccounts } = require("../controllers/socialAuthControllers");
const protect = require("../middlewares/authMiddleWare");
const socialAuthRouter = express.Router();


//post man check done

socialAuthRouter.get("/sync", protect, syncAccounts)
socialAuthRouter.get("/:platform", protect, generateAuthUrl)



module.exports = socialAuthRouter;