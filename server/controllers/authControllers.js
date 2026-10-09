//Register user 
//Post /api/auth/register 

const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../model/User");
const salt = process.env.JWT_SECRET
console.log(salt)
const generateToken = (id) => {
    return jwt.sign(id, salt, { expiresIn: "30d" })
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



const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = User.findOne({ email });
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
