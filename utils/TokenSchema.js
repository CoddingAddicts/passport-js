const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const JwtSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  Token: { type: String },
  expAt: Date,
});

JwtSchema.statics.CreateToken = async function (_id) {
  let expiredAt = new Date();
  expiredAt.setSeconds(expiredAt.getSeconds() + 60);
  let _token = jwt.sign({ id: _id }, process.env.JWTREFRESHTOKENSECRET);
  let _object = new this({
    userId: _id,
    Token: _token,
    expAt: expiredAt.getTime(),
  });
  console.log(_object);
  let refreshToken = await _object.save();
  return refreshToken;
};
JwtSchema.statics.VerifyExPToken = async function (token) {
  console.log(token.expAt.getTime() < new Date().getTime());
  return (await token.expAt.getTime()) < new Date().getTime();
};

const RefreshToken = mongoose.model("JwtCollection", JwtSchema);

module.exports = { RefreshToken };
