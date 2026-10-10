require('dotenv').config()
const { Zernio } = require('@zernio/node');

const api = process.env.ZERNIO_API_KEY
console.log(api)
const zernio = new Zernio({
    apiKey: api || "",
    baseURL: "https://zernio.com/api"
});

module.exports = zernio;