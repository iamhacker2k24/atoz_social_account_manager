const express = require("express");
const { getAccounts, disconnectAccount } = require("../controllers/accountControllers");
const protect = require("../middlewares/authMiddleWare");
const accountRouter = express.Router();

//postman checking done perfectlu 
accountRouter.delete("/:id", protect, disconnectAccount)
accountRouter.get("/", protect, getAccounts)




module.exports = accountRouter;