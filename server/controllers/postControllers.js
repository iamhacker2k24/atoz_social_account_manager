
const { GoogleGenAI } = require("@google/genai");
const Generation = require("../model/Generation");
//generate post 
//post /api/posts/generate 
const generatePost = async (req, res) => {
    try {
        const { prompt, tone, generateImage } = req.body;
        const apikey = process.env.GEN_AI_API;
        if (!apikey) {
            res.status(400).json({
                message: "Gemini Api key is missing "
            })
            return;
        }

        const ai = new GoogleGenAI({ apikey });

        //generate text 

        const textResponse = await ai.interactions.create({
            model: "gemini-2.5-flash",
            input: `Generate a socail media post based  on this prompt:"${prompt}",Tone:"${tone}".
            Include relavant hashtags.Formate the response as JSON with "content" and "imagePrompt" fields.
            The "imageprompt" should be a higly descriptive prompt for an image generator that complements the post `,
            generation_config: {
                thinking_level: "low",
            },
        });
        console.log(textResponse.output_text);
        let content = " ";
        let imagePrompt = prompt;
        try {
            const rawtext = textResponse.text || " "
            const jsonMatch = rawtext.match(/\{[\s\s]*\}/);
            const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { content: rawtext, imagePrompt: prompt }
            content = data.content;
            imagePrompt = data.imagePrompt;
        }
        catch (err) {
            content = textResponse.text || " ";
        }

        // let mediaUrl = " ";
        // if (generateImage) {
        //     //leonardo image generator 
        //     try {

        //     } catch (error) {

        //     }
        // }


        const generation = await Generation.create({
            user: req.user._id,
            prompt,
            content,
        })

        generation.save();
        res.json(generation)


    } catch (error) {

    }

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

//get posts       
//post /api/posts= 
const getposts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user._id });
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

    } catch (error) {
        res.status(500).json({
            msg: error?.message || "Server error "
        })
    }

}

// 6.01

module.exports = { generatePost, getGenerations, getposts, schedulePost }