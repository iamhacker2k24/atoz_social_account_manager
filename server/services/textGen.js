const ai = require("../config/ai");
// now lets convert strings to json as requirement 
const str_json = (response) => {
    try {
        if (typeof response !== "string") {
            return response;
        }
        let text = response.trim();
        // Remove Markdown code fences: ```json ... ``` or ``` ... ```
        text = text.replace(/^```(?:json)?\s*/i, "");
        text = text.replace(/\s*```$/, "");
        // Parse the cleaned JSON string
        return JSON.parse(text.trim());
    } catch (error) {
        console.log(`error from json converter ${error.message}`)
    }
}
const genText = async ({ prompt, tone, ImagePrompt, platfrom }) => {
    try {
        const interaction = await ai.interactions.create({
            model: "gemini-2.5-flash",
            input: `Generate a social media post for ${platfrom} based on: "${prompt}", Tone: "${tone}".
            Include relevant hashtags. Return ONLY valid JSON with exactly two fields: "content" and "imagePrompt".
            No Markdown, code fences, or extra text. If ImagePrompt is true, generate a highly descriptive image-generation 
            prompt that complements the post; otherwise, set "imagePrompt" to an empty string. ImagePrompt: ${ImagePrompt}.
            Strictly follow this JSON format: {"content":"Post text with hashtags","imagePrompt":"Image description or empty string"}.`,
            generation_config: {
                thinking_level: "low",
            },
        });
        const data = interaction.output_text
        const response = str_json(data)
        console.log(response)
        return response;
    } catch (error) {
        console.log(`error fro text generations  by ai ${error.message}`)
    }
}
genText("a post for new app publishing ", "medium", true, "linkedin");













// const rawtext = textResponse.text || " "
// const jsonMatch = rawtext.match(/\{[\s\s]*\}/);
// const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { content: rawtext, imagePrompt: prompt }
// content = data.content;
// imagePrompt = data.imagePrompt;












