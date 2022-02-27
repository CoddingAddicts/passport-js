const jwt = require("jsonwebtoken");
require("dotenv").config();
const TokenSchem = require("../utils/TokenSchema");

const RefreshTokenMid = async (req, res, next) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }
  try {
    let refreshToken = await RefreshToken.findOne({ Token: requestToken });
    console.log(refreshToken);
    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }
    const IsValid = await RefreshToken.VerifyExPToken(refreshToken);
    console.log(IsValid);
    if (IsValid) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }
    /*console.log(refreshToken.userId); */
    let newAccessToken = jwt.sign(
      { id: refreshToken.userId },
      process.env.JWTSECRET,
      {
        expiresIn: process.env.JWT_ACC_EXP_TIME,
      }
    );
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.Token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err });
  }
};

module.exports = { RefreshTokenMid };
