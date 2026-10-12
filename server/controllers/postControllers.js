
const { GoogleGenAI } = require("@google/genai");
const Generation = require("../model/Generation");
const post = require("../model/post");


//get posts       
//post /api/posts= 
const getposts = async (req, res) => {
    try {
        const posts = await post.find({ user: req.user._id });
        res.json(posts)

    } catch (error) {
        res.status(500).json({
            msg: error?.message || "Server error "
        })
    }

}




//generate post 
//post /api/posts/generate 
const generatePost = async (req, res) => {


}

//getGenerations  post 
//get /api/posts/generations  
const getGenerations = async (req, res) => {
    try {

        const posts = await Generation.find({ user: req.user._id }).sort({
            createdAt: -1
        })
        res.json(posts)


    } catch (error) {
        res.status(500).json({
            msg: error?.message || "Server error "
        })
    }

}



//schedule  posts  
//post /api/posts= 
const schedulePost = async (req, res) => {
    try {
        const { content, platfroms, scheduledFor, status } = req.body;
        //parse platfrom if id some as a stringified arry from From data
        let parsedPlatfroms = platfroms;
        if (typeof platfroms === "string") {
            try {
                parsedPlatfroms = JSON.parse(platfroms);

            } catch (error) {
                parsedPlatfroms = platfroms.split(",")
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: error?.message || "Server error "
        })
    }

}

// 6.01

module.exports = { getposts, generatePost, getGenerations, schedulePost }