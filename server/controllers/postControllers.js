
const { GoogleGenAI } = require("@google/genai");
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
            const jsonMatch = rawtext.match()
        }
        catch (err) {

        }

        // 5.36


    } catch (error) {

    }

}

//getGenerations  post 
//get /api/posts/generations  
const getGenerations = async (req, res) => {


}

//get posts  
//post /api/posts= 
const getposts = async (req, res) => {


}



//schedule  posts  
//post /api/posts= 
const schedulePost = async (req, res) => {


}

module.exports = { generatePost, getGenerations, getposts, schedulePost }