const moongose = require("mongoose")
const Schema = moongose.Schema;

const activitySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, ref: "User", required: true
    },
    actionType: {
        type: String, enum: ["POST_PUBLISHED", "AI_REPLAY"],
        required: true
    },
    description: {
        type: String, required: true
    },
    relatedPost: {
        type: Schema.Types.ObjectId,
        ref: "POST"
    }

}, {
    timestamps: true
})


const AcitivityLog = moongose.model("acitivity", activitySchema);
module.exports = AcitivityLog;