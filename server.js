const app = require("./app");
const conactionMongodb = require("./db/database");

// process.on("uncaughtException", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log("shutting down the server for handling uncaught exception");
// });

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./config/.env" });
}

app.get("/", (req, res) => {
  res.send("run");
});

// connect mongodb
conactionMongodb();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost/${process.env.PORT}`);
});

// process.on("unhandledRejection", (err) => {
//   console.log(`shutting down the server for ${err.message}`);
//   console.log("shutting down the server for unhandling promise rejection");

//   server.close(() => {
//     process.exit(1);
//   });
// });
