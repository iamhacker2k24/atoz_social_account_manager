const express = require("express");
const protect = require("../middlewares/authMiddleWare");
const { getposts, getGenerations, generatePost } = require("../controllers/postControllers");
const upload = require("../config/multer");
const postRouter = express();




//get cehecked  done via postman 

//normal post 
//scheudeuled post
// ai post 

postRouter.post("/generatepost", generatePost);
postRouter.get("/", protect, upload.single("media"), getGenerations);
postRouter.get("/generate", protect, generatePost);
postRouter.get("/", protect, getposts);




module.exports = postRouter;