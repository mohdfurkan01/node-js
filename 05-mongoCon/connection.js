const mongoose = require("mongoose");

async function connectMongoDb(url) {
  //   mongoose
  //     .connect("mongodb://127.0.0.1:27017/crud-db1")
  //     .then(() => console.log("Database Connected"))
  //     .catch((error) => console.log("Not Connected", error));

  return mongoose.connect(url);
}

module.exports = {
  connectMongoDb,
};
