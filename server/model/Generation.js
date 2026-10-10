const moongose = require("mongoose")
const Schema = moongose.Schema;

const generataionSchema = new Schema({
    user: {
        type: { type: Schema.Types.ObjectId, ref: "User", required: true }
    },
    prompt: {
        type: String, required: true
    },
    content: {
        type: String,
        required: true
    },
    mediaUrl: {
        type: String
    },
    mediaType: {
        type: String, enum: ["image", "video"]
    },
    tone: {
        type: String
    },




}, {
    timestamps: true
})


const Generation = moongose.model("Generation", generataionSchema);
module.exports = Generation;