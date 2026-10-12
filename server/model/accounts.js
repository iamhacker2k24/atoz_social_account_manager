const moongose = require("mongoose")
const Schema = moongose.Schema;

const accountSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, ref: "User", required: true
    },
    platfrom: {
        type: String, enum: ["twitter", "linkedin", "facebook", "instagram", "facebook_page", "linkedin_page", "instagram_business"], required: true
    },
    handle: {
        type: String, required: true
    },
    zernioAccountId: {
        type: String,
        required: true
    },
    status: {
        type: Boolean, enum: [true, false], default: false
    },
    avatarUrl: {
        type: String
    },
    lastSyncedAt: {
        type: Date
    }

}, {
    timestamps: true
})


const Account = moongose.model("Account", accountSchema);
module.exports = Account;