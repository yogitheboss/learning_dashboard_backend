import { UserModel } from "../../models/user.js";

export const setRole = async (req, res) => {
  const { role } = req.body;
  try {
    console.log(req.user,role)
    const user = await UserModel.findOne({ email: req.user.email });
    user.role = role.toLowerCase();
    await user.save();
    res.json({
      user,
      message: "Role updated",
      status: "success",
    });
  } catch (err) {
    console.error(err);
    res.json({ message: "Role not updated", status: "error" });
  }
};

export const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await UserModel.findOne({ email });
    res.json(user);
  } catch (err) {
    res.json({ message: "User not found" });
  }
};
