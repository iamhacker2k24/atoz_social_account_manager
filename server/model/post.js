const moongose = require("mongoose")
const Schema = moongose.Schema;

const postSchema = new Schema({
    user: {
        type: { type: Schema.Types.ObjectId, ref: "User", required: true }
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
    platfrom: {
        type: String, enum: ["twitter", "linkdin", "facebook", "instagram", "facebook_page", "linkdin_page", "instagram_business"], required: true
    },
    scheduledFor: { type: Date, require: true },
    status: {
        type: String, enum: ["connected", "disconnected "], default: "connected"
    },

}, {
    timestamps: true
})


const post = moongose.model("post", post);
module.exports = post;