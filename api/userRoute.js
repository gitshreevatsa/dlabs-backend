const router = require("express").Router();
const {
  registerUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
} = require("../controller/UserController");

router.route("/").get(getAllUsers).post(registerUser);

router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
