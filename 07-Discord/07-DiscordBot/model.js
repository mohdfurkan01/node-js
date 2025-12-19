import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    originalUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//export const Url = mongoose.model("Url", urlSchema);

const Url = mongoose.model("Url", urlSchema);

export { Url };
