const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport_github2 = require("passport-github2");
const UserModel = require("../utils/UserModel");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENTID,
      clientSecret: process.env.SECRETID,
      callbackURL: "http://localhost:5000/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      //we get the infromation needed for this example
      //but if you want to get the full profile object
      //console.log(profile)
      const { email, name, email_verified, picture } = profile._json;
      //we verify if the user exists
      const UserExist = await UserModel.findOne({ email });
      //if it does we send return the user to the redirect url
      if (UserExist) {
        return done(null, User);
      }
      //else we create a new user and we send it to the redirect url
      const NewUser = await UserModel.create({
        email,
        name,
        verified: email_verified,
        picture,
      });
      done(null, NewUser);
    }
  )
);

passport.use(
  new passport_github2(
    {
      clientID: process.env.GITHUBCLIENTID,
      clientSecret: process.env.GITHUBSECRETID,
      callbackURL: "http://localhost:5000/auth/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      //the same logic as the Google auth 
      done(null, profile);
    }
  )
);

module.exports = passport;
