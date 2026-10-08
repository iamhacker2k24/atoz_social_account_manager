const moongosh = require("mongoose")

const dbConnection = async () => {
    try {
        await moongosh.connect(process.env.DB_URL);
        console.log("Data base conncetd ")
    } catch (error) {
        console.error()

    }
}

module.exports = dbConnection;