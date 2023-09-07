const sendSellerToken = (shop, statusCode, res) => {
  const token = shop.getJwtToken();

  const cookisOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  const { password, ...info } = shop._doc;

  res.status(statusCode).cookie("seller_token", token, cookisOptions).json({
    success: true,
    info,
    token,
  });
};

module.exports = sendSellerToken;
