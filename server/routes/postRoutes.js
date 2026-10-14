const express = require("express");
const protect = require("../middlewares/authMiddleWare");
const { ComposePost, PublishedPost } = require("../controllers/postControllers");
const upload = require("../config/multer");
const postRouter = express();




// Schedule page  full router 
postRouter.post("/composepost", protect, upload.array("media", 10), ComposePost);
postRouter.get("/publishedpost", protect, PublishedPost);
// postRouter.get("/upcommingpost", protect, UpcommingPost);





module.exports = postRouter;