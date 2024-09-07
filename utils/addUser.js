import { UserModel } from "../models/user.js";

export const addUser = async (name, email, nickname, picture) => {
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      return user;
    } else {
      const newUser = {
        name,
        email,
        userName: nickname,
        picture,
        role: "user",
      };
      const createdUser = await UserModel.create(newUser);
      return createdUser;
    }
  } catch (error) {
    console.log(error);
  }
};
