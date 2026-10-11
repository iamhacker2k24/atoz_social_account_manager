const express = require("express");
const { getAccounts, disconnectAccount } = require("../controllers/accountControllers");
const protect = require("../middlewares/authMiddleWare");

const accountRouter = express.Router();



accountRouter.get("/", protect, getAccounts)
accountRouter.delete("/:id", protect, disconnectAccount)




module.exports = accountRouter;