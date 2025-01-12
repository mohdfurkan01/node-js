const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUser,
  createNewUser
} = require("../controllers/controller");

// router.post("/", createUser);
// router.get("/", getAllUsers);
//combine
router.route("/").get(getAllUsers).post(createNewUser)

router.route("/:id").get(getUserById).patch(updateUserById).delete(deleteUser);

module.exports = router;
