const { Router } = require("express");
const { register, login } = require("../controllers/authControllers");
const protect = require("../middlewares/authMiddleWare");
const authRouter = Router();

//post checking done for this two  routes
authRouter.post("/register", register)
authRouter.post("/login", login)


module.exports = authRouter;