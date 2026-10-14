require("dotenv").config();
const fs = require("node:fs");
const cloudinary = require("../config/cloudnary");
const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY
console.log(POLLINATIONS_API_KEY)
async function photoGen() {
    const prompt =
        `A vibrant, softly lit image featuring a path disappearing into a bright, hopeful horizon at sunrise. The foreground shows dew-kissed grass or a gentle flowing stream, leading the eye towards a sky filled with warm, inviting colors like soft oranges, pinks, and purples. There's a subtle lens flare or bokeh effect to enhance the dreamy and optimistic feel. No people, focusing on the beauty and serenity of the landscape`
    const params = new URLSearchParams({
        model: "flux",
        width: "1024",
        height: "1024",
        seed: "42",
    });

    const url = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?${params}`;

    const headers = {};
    console.log(POLLINATIONS_API_KEY)
    if (POLLINATIONS_API_KEY) {
        headers.Authorization = `Bearer ${POLLINATIONS_API_KEY}`;
    }


    const res = await fetch(url, { headers });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    console.log(res)
    const buffer = Buffer.from(await res.arrayBuffer());
    const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder: "ai-images" }, (err, r) => (err ? reject(err) : resolve(r)))
            .end(buffer);
    });
    console.log(result)
    fs.writeFileSync("pollinations-image.png", buffer);
    console.log("Image saved as pollinations-image.png");
}


// main().catch((err) => console.error("Error:", err.message));
module.exports = photoGen;