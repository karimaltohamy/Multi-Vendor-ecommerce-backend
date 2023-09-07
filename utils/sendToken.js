const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  const cookisOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  const { password, ...info } = user._doc;

  res.status(statusCode).cookie("token", token, cookisOptions).json({
    success: true,
    info,
    token,
  });
};

module.exports = sendToken;
