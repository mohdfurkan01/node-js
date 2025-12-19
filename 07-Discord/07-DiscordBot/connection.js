//const mongoose = require("mongoose");
import { mongoose } from "mongoose";

export async function conMongoDB(url) {
  return mongoose.connect(url);
}
