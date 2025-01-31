var express = require('express');
var router = express.Router();
const userController = require("../controllers/users");

router.post("/", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/all", userController.getAllUsers);

module.exports = router;
