import { loginService, registerService } from "../services/authService.js";
import generateToken from "../utils/generateToken.js";

//register
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

//login
export const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    const data = await loginService(email, password)

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: data.token,
      user: {
        id: data.user._id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: data.user.role,
      },
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error
    })
  }
}

export const getMe = async (req, res) => {
  try{
    res.status(200).json({
      success: true,
      user:req.user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}