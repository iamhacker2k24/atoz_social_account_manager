const express = require("express");
const { getAccounts, addAccount, disconnectAccount } = require("../controllers/accountControllers");
const protect = require("../middlewares/authMiddleWare");

const accountRouter = express.Router();



accountRouter.get("/", protect, getAccounts)
accountRouter.post("/", protect, addAccount)
accountRouter.delete("/:id", protect, disconnectAccount)




module.exports = accountRouter;