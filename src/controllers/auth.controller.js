import userModel from "../models/user.models.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import config from "../config/config.js";
 
export async function register (req,res){
const{username, email, password}= req.body;
const isAlreadyRegisted = await userModel.findOne({
    $or:[
        {username},
        {email}
    ]
})

if(isAlreadyRegisted){
    res.status(409).json({
        message:"username or email is already existed"
    })
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = await userModel.create({
    username,
    email,
    password:hashedPassword
})


const accessToken = jwt.sign({
    id:user._id
},config.JWT_SECRET,{
    expiresIn: "15m"
})

const refreshToken = jwt.sign({
    id:user.id
},config.JWT_SECRET,{
    expiresIn: "7d"
}
)

res.cookie("refreshToken", refreshToken,{
    httpOnly: true,
    secure: true,
    samesite: "strict",
    maxAge: 7*24*60*60*1000
})

res.status(201).json({
    message: "user registered successfully",
    user:{
        username:user.username,
        email:user.email
    },
    accessToken
})

}

export async function getMe(req, res){
    const token = req.headers.authorization?.split(" ")[1];

if(!token){
   return res.status(401).json({
    message:"token not found"
   })
}

const decoded = jwt.verify(token, config.JWT_SECRET)
const user = await userModel.findById(decoded.id)

res.status(200).json({
    message:"user fetched successfully",
    user:{
        username: user.username,
        email:user.email,
    }
})

}


export async function refreshToken(req, res){
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({
            message: "Refresh token not found"
        })
    }


    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)
    const accessToken = jwt.sign({
        id:decoded.id
    }, config.JWT_SECRET,{
        expiresIn: "15m"
    }

)

const newRefreshToken = jwt.sign({
    id: decoded.id
}, config.JWT_SECRET,
{
    expiresIn: "7d"
}
)


res.cookie("refreshToken", newRefreshToken,{
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7*24*60*60*1000
})


res.status(200).json({
    message: "Access token refreshed successfully",
    accessToken
})

}