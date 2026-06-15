import User from "../models/User.js";
import bcrypt from "bcrypt";

export const registerService = async (data) => {
  const { firstName, lastName, email, password, phone } = data;

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
  });

  return user;
};
