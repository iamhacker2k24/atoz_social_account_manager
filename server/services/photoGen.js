require("dotenv").config();
const fs = require("node:fs");
const cloudinary = require("../config/cloudnary");
// const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY
const POLLINATIONS_API_KEY = "sk_9srPS7E9LCnMd15u3CNcPgIHB2MAZ0BN"

console.log(POLLINATIONS_API_KEY)

async function photoGen({ prompt }) {
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
    // const result = await new Promise((resolve, reject) => {
    //     cloudinary.uploader
    //         .upload_stream({ folder: "ai-images" }, (err, r) => (err ? reject(err) : resolve(r)))
    //         .end(buffer);
    // });
    console.log(result)
    fs.writeFileSync("pollinations-image.png", buffer);
    console.log("Image saved as pollinations-image.png");
}


// main().catch((err) => console.error("Error:", err.message));
// module.exports = photoGen;

photoGen("A clean, modern photorealistic image for a LinkedIn post: a close-up, over-the-shoulder view of a university student holding a smartphone in one hand while sitting at a bright study desk. The phone screen shows an abstract mobile study app interface with soft blue and violet cards, progress rings, and simple icons, but no readable text. In the background, softly blurred: an open notebook, a laptop, a cup of coffee, and a small plant. Natural window light, warm highlights, calm and focused mood. Color palette: modern edtech blues, purples, white, and soft neutral wood tones. Style: professional, optimistic, high-quality product photography, shallow depth of field, 16:9 aspect ratio. No text, no logos, no watermarks")