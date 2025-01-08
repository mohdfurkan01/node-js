const express = require("express");
const mongoose = require("mongoose");

const app = express();

const PORT = 8000;

//middleware
//agr middleware add nhi kiya to body "undefined" aur "400 Bad Request The server could not understand the request. Maybe a bad syntax?" ye erros aati h
app.use(express.urlencoded({ extended: false })); // For form-encoded requests
//app.use(express.json()); // For JSON requests

//Connetion
mongoose
  .connect("mongodb://127.0.0.1:27017/crud-db1")
  .then(() => console.log("Database Connected"))
  .catch((error) => console.log("Not Connected", error));

// mongoose
//   .connect("mongodb://127.0.0.1:27017/testdb")
//   .then(() => console.log("Connected!"));

//Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      //can be empty
    },
    email: {
      type: String,
      required: true,
      unique: true, //same id can not be exist in my DB
    },

    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  //timestamps add krne se db me createdAt aur updatedAt dikhega like  createdAt: 2025-01-08T17:22:39.135Z,
  { timestamps: true }
);

//Model
const User = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.send("hello from server");
});

//post route
app.post("/api/users", async (req, res) => {
  const body = req.body;
  // console.log("=======>", req.body);
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  } else {
  }
  //these fields must be same like first_name for the the postman
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });

  //console.log("result", result);
  return res
    .status(201)
    .json({ message: "User Created Successfully ✨✅", result });
});

//All users visible in the browser
app.get("/users", async (req, res) => {
  const allUsers = await User.find({});
  const html = `<ul>
  ${allUsers
    .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
    .join("")}
  </ul>`;

  res.send(html);
});

//all users
app.get("/api/users", async (req, res) => {
  try {
    // Fetch all users from the database
    const allUsers = await User.find({});

    // Check if users exist
    if (!allUsers.length) {
      //OR if (allUsers.length === 0)
      return res.status(404).json({ message: "No users found." });
    }

    // Send success response
    return res
      .status(200)
      .json({ message: "All Users fetched Successfully✅", allUsers });
  } catch (error) {
    // Handle database or server errors
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch users.", error: error.message });
  }
});

//user by id

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User fetched by ID", user });
  })
  .patch(async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { lastName: "changed" }, // Replace with your update logic
        { new: true } // Return the updated document
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }

      return res
        .status(200)
        .json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      return res
        .status(500)
        .json({ message: "Failed to update user.", error: error.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found." });
      }
      return res
        .status(200)
        .json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res
        .status(500)
        .json({ message: "Failed to delete user.", error: error.message });
    }
  });

app.listen(PORT, () => console.log(`server start on port no: ${PORT}`));
