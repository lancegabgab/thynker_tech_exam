const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET_KEY || "gabgab";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Google Profile:", profile);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
  };
  return jwt.sign(data, secret, {});
};

module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (typeof token === "undefined") {
    return res.send({ auth: "Failed. No Token" });
  } else {
    token = token.slice(7, token.length);

    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        return res.send({ auth: "Failed", message: err.message });
      } else {
        req.user = decodedToken;
        next();
      }
    });
  }
};