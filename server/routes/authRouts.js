const { Router } = require("express");
const { register, login } = require("../controllers/authControllers");
const authRouter = Router();

//post checking done for this two  routes 

// here no need protect ok 
authRouter.post("/register", register)
authRouter.post("/login", login)


module.exports = authRouter;