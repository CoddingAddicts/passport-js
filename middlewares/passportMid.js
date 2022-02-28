const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENTID,
      clientSecret: process.env.SECRETID,
      callbackURL: "http://localhost:5000/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  console.log(`this is the serialize user`, user);
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log("deserialize");
  console.log("this is the user ID", id);
  done(null, id);
});

module.exports = passport;
