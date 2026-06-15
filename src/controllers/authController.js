import { registerService } from "../services/authService.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const user = await registerService(req.body);

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      message: "Account created successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
