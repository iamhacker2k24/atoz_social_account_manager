//Register user 
//Post /api/auth/register 

const jwt = require("jsonwebtoken")
const bcrypt = requie("bcrypt")
const User = require("../model/User");
const salt = process.env.SALT
console.log(salt)
const generateToken = (id) => {
    return jwt.sign(id, salt)
}

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExits = User.findOne({ email });
        if (userExits) {
            res.status(400).json({
                msg: "User already exits "
            })
            return;
        }
        const hashPass = await bcrypt.hash(password, 10);
        console.log(hashPass);
        const user = await User.create({ name, email, password: hashPass });
        user.save();
        if (user) {
            res.status(400).json({
                _id: user._id, name: user.name, email: user.email
            })
        }
        else {
            res.status(400).json({
                "msg": "invaild userdata"
            })
        }



    } catch (error) {
        res.status(500).json({
            msg: error.message || "Inavaid  from register"
        })

    }

}




module.exports = { register }
