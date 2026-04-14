import userModel from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";



//register
export async function register(req, res) {
  const { username, email, password } = req.body;

  const isAlreadyRegisted = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isAlreadyRegisted) {
    res.status(409).json({
      message: "username or email is already existed",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
    isSubscribed:false,
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "user registered successfully",
    user: {
      username: user.username,
      email: user.email,
    },
    accessToken,
  });
}


//getme
export async function getMe(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "token not found",
    });
  }

  const decoded = jwt.verify(token, config.JWT_SECRET);
  const user = await userModel.findById(decoded.id);

  res.status(200).json({
    message: "user fetched successfully",
    user: {
      username: user.username,
      email: user.email,
      isSubscribed: user.isSubscribed,
    },
  });
}


//refresh token
export async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token not found",
    });
  }

  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
  const accessToken = jwt.sign(
    {
      id: decoded.id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const newRefreshToken = jwt.sign(
    {
      id: decoded.id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Access token refreshed successfully",
    accessToken,
  });
}




//login

export async function login(req, res) {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "email and password is required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    const accessToken = jwt.sign(
      {
        // id: decoded.id,
        id: user._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      {
        // id: decoded.id,
        id:user._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login Successful",
      accessToken,
      user:{
        // id: decoded.id,
        id: user._id,
        username: user.username,
        email:user.email,
        isSubscribed: user.isSubscribed,
      }
    });
  } catch (error) {
    return res.status(500).json({
      message:"Server error",
      error: error.message,
    });
    
  }
}
