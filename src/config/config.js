import dotenv from "dotenv";

dotenv.config();

if(!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI  is not defined in environment variable");
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in environment variables");
}

if(!process.env.RAZORPAY_KEY_ID){
    throw new Error("Razorpay Id is not defined in environment variables");
}

if(!process.env.RAZORPAY_KEY_Secret){
    throw new Error("Razorpay secret is not defined in environment variables");
}


const config ={
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
}


export default config;