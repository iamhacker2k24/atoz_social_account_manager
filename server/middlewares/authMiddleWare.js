require('dotenv').config()
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const protect = async (req, res, next) => {
    try {
        let token;
        // console.log("working stared in protect ");
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            try {
                token = req.headers.authorization.split(" ")[1];
                // console.log(token)
                const decode = jwt.verify(token, process.env.JWT_SECRET)
                req.user = await User.findById(decode.id).select("-password")
                // console.log(req.user)//all cehecked 
                console.log("verification done from protect ")
                next();

            } catch (error) {
                res.status(401).json({
                    msg: "Error from authmiddle ware"
                })
            }
        }
        else {
            res.status(401).json({
                msg: "auth  issu  from protect router "
            })
        }
    } catch (error) {
        console.log(`error from ${error.message}`)
    }
}

module.exports = protect