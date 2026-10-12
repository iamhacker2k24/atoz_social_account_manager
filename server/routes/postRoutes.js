const express = require("express");
const protect = require("../middlewares/authMiddleWare");
const { getposts, getGenerations, generatePost } = require("../controllers/postControllers");
const upload = require("../config/multer");
const postRouter = express();




//get cehecked  done via postman 

//normal post 
//scheudeuled post
// ai post 

postRouter.get("/", protect, getposts);
postRouter.get("/generations", protect, getGenerations);
postRouter.get("/", protect, upload.single("media"), getGenerations);
postRouter.get("/generate", protect, generatePost);





module.exports = postRouter;