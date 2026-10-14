
//get all activity 
//get /api/acitivity 

const AcitivityLog = require("../model/activity")

const getActivity = async (req, res) => {
    try {
        const acitivity = await AcitivityLog.find({
            user: req.user._id
        }).sort({ createdAt: -1 })
        res.json(acitivity)
    } catch (error) {
        res.status(500).json({ msg: error?.message || "server error " })
    }
}

module.exports = { getActivity };