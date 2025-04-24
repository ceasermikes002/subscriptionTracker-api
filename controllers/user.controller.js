import User from "../database/models/user.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res
      .status(200)
      .json({
        data: users,
        success: true,
        message: "Users fetched successfully",
      });
  } catch (error) {
    next(error);
  }
};


export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if(!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return res
      .status(200)
      .json({
        data: user,
        success: true,
        message: "User fetched successfully",
      });
  } catch (error) {
    next(error);
  }
};
