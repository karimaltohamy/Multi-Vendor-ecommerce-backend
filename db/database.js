const mongoose = require("mongoose");

const conactionMongodb = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((data) =>
      console.log(`mongodb connect with server ${data.connection.port}`)
    )
    .catch((err) => console.log("mongodb not connect"));
};

module.exports = conactionMongodb;
