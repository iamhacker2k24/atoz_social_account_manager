const express = require("express");
const protect = require("../middlewares/authMiddleWare");
const { getActivity } = require("../controllers/acitivityControllers");
const activityRouter = express();



activityRouter.get("/", protect, getActivity)

module.exports = activityRouter;