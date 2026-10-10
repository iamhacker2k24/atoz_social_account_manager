//Register user 
//Post /api/auth/register 

require('dotenv').config()
const jwt = require("jsonwebtoken")
require('dotenv').config()
const bcrypt = require("bcrypt")
const User = require("../model/User");
const salt = process.env.JWT_SECRET
console.log(salt)
const generateToken = (id) => {
    return jwt.sign({ id: id }, salt, { expiresIn: "30d" })
}


// postman check done 
const register = async (req, res) => {
    console.log(req.body)
    try {
        const { name, email, password } = req.body;
        const userExits = User.findOne({ email });
        // console.log(userExits.data)
        if (!userExits) {
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
            res.status(200).json({
                _id: user._id, name: user.name, email: user.email, token: generateToken(user._id.toString())
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


//login user 
//POST /api/auth/login


//postman  check done 

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        const user = await User.findOne({ email });
        console.log(user)
        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(400).json({
                _id: user._id, name: user.name, email: user.email, token: generateToken(user._id.toString())
            })
            return;
        }
        else {
            res.status(401).json({
                "msg": "invaild email or password "
            })
        }



    } catch (error) {
        res.status(500).json({
            msg: error.message || "Inavaid  from login"
        })

    }

}

module.exports = { register, login }
