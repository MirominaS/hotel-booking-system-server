import User from "../models/User.js";
import HotelOwner from "../models/HotelOwner.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

//register Service
export const registerService = async (data) => {
  const { firstName, lastName, email, password, phone, role } = data;

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    role: role || "customer",
  });

  return user;
};

//login service
export const loginService = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("Your account has been deactivated");
  }

  const token = generateToken(user);

  return {
    token,
    user,
  };
};
