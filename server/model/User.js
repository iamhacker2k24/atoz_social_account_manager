const { default: mongoose } = require("mongoose");
const moongose = require("mongoose")
const Schema = moongose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    zernioProfileId: {
        type: String
    }



}, {
    timestamps: true
}
)


const User = mongoose.model("User", userSchema)

module.exports = User;