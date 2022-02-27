const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("./middleware/PassportGoogle");
const Start = require("./utils/connectDb");
const { RefreshToken } = require("./utils/TokenSchema");
require("dotenv").config;

const App = express();
App.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

App.get(
  "/auth/google/redirect",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  async (req, res) => {
    //we get the user
    //if you want to see the full user you can
    //console.log(req.user)
    const { _id } = req.user;
    try {
      //Create a jwt's Both Of them and then send them
      //AT = accses Token
      //RT = refresh Token
      const AT = jwt.sign({ id: _id }, process.env.JWTACSESSTOKENSECRET, {
        expiresIn: process.env.ACSESSTOKENTIME,
      });
      const RT = await RefreshToken.CreateToken(_id);
      res.status(200).json({ AT, RT });
    } catch (error) {
      res.status(500).json({ msg: "Something Went Wrong" });
      console.log(error);
    }
  }
);

App.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

App.get(
  "/auth/redirect",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
App.get("/", (req, res) => {
  res.send("Jello");
});

//THis is the end point that verifies the life of the RT and make a new AT
App.get("/refreshtoken", RefreshTokenMid);

const StartServer = async () => {
  try {
    Start(process.env.URI);
    App.listen(5000, () => {
      console.log(`Server Is up on http://localhost:5000`);
    });
  } catch (err) {
    console.log(err);
  }
};

StartServer();
