
require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");
// const apikey = 
console.log(process.env.GEN_AI_API)
const ai = new GoogleGenAI({
    apiKey: process.env.GEN_AI_API
});
module.exports = ai;

