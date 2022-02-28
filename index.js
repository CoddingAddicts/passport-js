const express = require("express");
const passport = require("./middlewares/passportMid");
const session = require("express-session");
const cookieSession = require("cookie-session");
const app = express();

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      keys: "kmeahjrtklaehta,len",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get("/gets", (req, res) => {
  console.log(req.session.cookie);
});

app.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/fine",
  })
);
async (req, res) => {};

app.get("/", (req, res) => {
  res.status(200).json({ msg: "cool things happens to cool kids" });
});

app.get("/fine", (req, res) => {
  console.log("this is the /fine user", req.user);
  res.send("fineass");
});

app.listen(5000, () => {
  console.log("Server is up on port 5000");
});
