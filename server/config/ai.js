
require('dotenv').config();
const OpenAI = require("openai");
const ai = new OpenAI({
    //api key name default to OPENAI_API_KEY..ok 
    baseURL: "https://tokenharbor.ai/v1",
    timeout: 60000,
    maxRetries: 2,
});


module.exports = ai;