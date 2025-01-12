const express = require("express");
const { connectMongoDb } = require("./connection");

const { logReqRes } = require("./middlewares/middle");

const userRouter = require("./routes/user");

const app = express();
const PORT = 8000;

//connection
connectMongoDb("mongodb://127.0.0.1:27017/crud-db1").then(() => {
  console.log("MongoDB Connected")
}).catch(() => console.log("Not Connected"))

//middleware
//agr middleware add nhi kiya to body "undefined" aur "400 Bad Request The server could not understand the request. Maybe a bad syntax?" ye erros aati h
app.use(express.urlencoded({ extended: false })); // For form-encoded requests
app.use(express.json()); // For JSON requests
app.use(logReqRes("log.txt")); //custome middleware

//Routes
app.use("/api/users", userRouter);

app.listen(PORT, () => console.log(`server start on port no: ${PORT}`));
