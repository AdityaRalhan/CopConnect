import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, phone, badgeNumber, password, role } = req.body;

    if (role === "anonymous") {
      return res
        .status(400)
        .json({ message: "Anonymous users do not need to register." });
    }

    let newUser;

    if (role === "police") {
      if (!name || !badgeNumber) {
        return res
          .status(400)
          .json({ message: "Police must provide name and badge number." });
      }

      // Hash the badgeNumber before storing
      const hashedBadgeNumber = await bcrypt.hash(badgeNumber, 10);

      newUser = new User({ name, badgeNumber: hashedBadgeNumber, role });
    } else if (role === "citizen") {
      if (!phone || !name) {
        return res
          .status(400)
          .json({ message: "Citizen must provide name and phone number." });
      }

      newUser = new User({ name, phone, role });
    }

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
        phone: newUser.phone,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed", error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { role } = req.body;

    if (role === "anonymous") {
      return res
        .status(403)
        .json({ message: "Anonymous users do not need login." });
    }

    let user;

    if (role === "police") {
      const { name, badgeNumber } = req.body;
      if (!name || !badgeNumber)
        return res
          .status(400)
          .json({ message: "Name and badge number are required" });

      user = await User.findOne({ name, badgeNumber });
    } else if (role === "citizen") {
      const { name, phone } = req.body;
      if (!name || !phone)
        return res.status(400).json({ message: "Name and phone are required" });

      user = await User.findOne({ name, phone });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate Token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        phone: user.phone,
        badgeNumber: user.badgeNumber,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("generated token is : ", token);

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

export const findPoliceOfficers = async (req, res) => {
  try {
    const officers = await User.find({ role: "police" });
    res.status(200).json(officers);
  } catch (err) {
    console.error("Error fetching police officers:", err);
    res.status(500).json({ error: "Failed to fetch police officers" });
  }
};
