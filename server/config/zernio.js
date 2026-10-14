require('dotenv').config()
const { Zernio } = require('@zernio/node');
const api = "sk_15e5d404b4c3bffbd27bedd1ee482f5d77f8c72b9666fe84201dd8d4bcaa2eb6"
// const api = process.env.ZERNIO_API_KEY
console.log(api)
const zernio = new Zernio({
    apiKey: api || "",
    baseURL: "https://zernio.com/api"
});

module.exports = zernio;