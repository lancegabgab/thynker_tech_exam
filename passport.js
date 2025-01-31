require('dotenv').config();  

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

console.log("Client ID:", process.env.GOOGLE_CLIENT_ID); 
console.log("Client Secret:", process.env.GOOGLE_CLIENT_SECRET);  

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,  
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,  
      callbackURL: "http://localhost:3000/auth/google/callback",  
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("User Profile:", profile);
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

module.exports = passport;
