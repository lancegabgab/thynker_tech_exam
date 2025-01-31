const User = require("../models/users");
const bcrypt = require("bcrypt");
const { createAccessToken } = require("../auth"); 

module.exports.registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      mobileNo: req.body.mobileNo,
    });

    await newUser.save();
    return res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Error in registration:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ errors });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.loginUser = (req, res) => {
  return User.findOne({ email: req.body.email })
    .then((result) => {
      if (result == null) {
        return res.status(404).send({ error: "No Email Found" });
      } else {
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

        if (isPasswordCorrect) {
          const accessToken = createAccessToken(result); 
          return res.status(200).send({ access: accessToken });
        } else {
          return res.status(401).send({ message: "Email and password do not match" });
        }
      }
    })
    .catch((err) => {
      console.error("Error in logging in", err);
      return res.status(500).send({ error: "Cannot log in." });
    });
};

module.exports.getAllUsers = (req, res) => {
  return User.find({})
    .then((result) => {
      res.status(200).send({ result });
    })
    .catch((err) => {
      console.error("Error in getting all info", err);
      return res.status(500).send({ error: "Failed to get details of user." });
    });
};
