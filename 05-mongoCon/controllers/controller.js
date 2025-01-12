const User = require("../models/user");

//create a new user
async function createNewUser(req, res) {
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
        .json({ message: "User Created Successfully ✨✅", id: result._id });
}
//get all users
async function getAllUsers(req, res) {
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
}

//get single user
async function getUserById(req, res) {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User fetched by ID", user });
}

//Update or patch
async function updateUserById(req, res) {
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
}

//delete
async function deleteUser(req, res) {
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
}

module.exports = {
    createNewUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUser,
};
