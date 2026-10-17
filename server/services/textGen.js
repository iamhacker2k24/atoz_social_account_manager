import OpenAI from "openai";

const client = new OpenAI({
    // apiKey:process.env.TOKENHARBOR,
    apiKey: "thk_live_XpkW09EOlwsXcFqYIA30LkX42wxridGT34F3oRKdJdPMjgr7MPNlvvkAP8Ma7h9F",
    baseURL: "https://tokenharbor.ai/v1",
    timeout: 60000,
    maxRetries: 2,
});

const MODEL = "deepseek-v4.1-flash:free";


function str_json(response) {
    if (response && typeof response === "object") {
        return response;
    }

    if (typeof response !== "string") {
        throw new Error("AI response is not a string or JSON object.");
    }

    let text = response.trim();

    // Remove Markdown code fences.
    text = text
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();

    try {
        return JSON.parse(text);
    } catch {
        // Fallback: extract a JSON object from surrounding text.
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");

        if (start === -1 || end <= start) {
            throw new Error("AI did not return valid JSON.");
        }

        return JSON.parse(text.slice(start, end + 1));
    }
}

export async function main({
    prompt,
    tone = "medium",
    ImagePrompt = false,
    platform = "linkedin",
}) {
    // if (!process.env.TOKENHARBOR_API_KEY) {
    //     throw new Error("TOKENHARBOR_API_KEY is missing from .env");
    // }

    // if (!prompt || typeof prompt !== "string") {
    //     throw new Error("A valid post prompt is required.");
    // }

    const systemPrompt = `
You are an expert social media content strategist and AI image-prompt writer.

Your task is to create an engaging social media post tailored to the specified platform.

RULES:
1. Understand the user's topic and preserve their original intent.
2. Write natural, engaging, grammatically correct content.
3. Adapt the format, vocabulary, length, and style to the target platform.
4. Use the requested tone.
5. Include relevant hashtags naturally in the content.
6. Avoid generic filler, repetitive phrases, fabricated facts, and unsupported claims.
7. Use emojis sparingly when appropriate for the platform.
8. Do not add explanations, comments, or Markdown outside the JSON.
9. Return exactly two string fields: "content" and "imagePrompt".
10. If image generation is disabled, "imagePrompt" MUST be an empty string.
11. If image generation is enabled, create a detailed, visually coherent
    image-generation prompt that complements the post. Describe the subject,
    composition, setting, lighting, color palette, visual style, and aspect ratio.
    Do not include text in the image unless specifically requested.

OUTPUT FORMAT:
{
  "content": "The complete social media post, including relevant hashtags",
  "imagePrompt": "Detailed image prompt, or an empty string"
}

Return valid JSON only. Escape quotation marks and special characters correctly.
`;

    const userPrompt = `
Target platform: ${platform}
Topic and instructions: ${prompt}
Requested tone: ${tone}
Generate image prompt: ${ImagePrompt ? "YES" : "NO"}

Create the final post for publication on the specified platform.
`;

    try {
        const res = await client.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            temperature: 0.7,
        });

        const raw = res.choices?.[0]?.message?.content;

        if (!raw) {
            throw new Error("The AI returned an empty response.");
        }

        const result = str_json(raw);

        // Validate the response structure.
        if (
            typeof result.content !== "string" ||
            typeof result.imagePrompt !== "string"
        ) {
            throw new Error(
                'Invalid response: expected string fields "content" and "imagePrompt".'
            );
        }

        if (!ImagePrompt && result.imagePrompt !== "") {
            result.imagePrompt = "";
        }

        console.log("Generated social media post:");
        console.log(JSON.stringify(result, null, 2));

        return result;
    } catch (error) {
        console.error("Social post generation failed:", error.message);
        throw error;
    }
}

// Example usage
main({
    prompt:
        "I am going to launch a mobile study app for students, built with React Native. Highlight how it can help students study more effectively.",
    tone: "professional and engaging",
    ImagePrompt: false,
    platform: "linkedin",
})