import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:[true,"username should be unique"],
    },

    email:{
        type:String,
        required:[true, "email is required"],
        unique:[true, "email is unique"],
    },

    password:{
        type:String,
        required:[true, "password is required"]
    },

    isSubscribed:{
        type: Boolean,
        default:false,
    },

    currency:{
        type:String,
        default: "INR",
    },

    razorpayCustomerId:{
        type:String,
        default:null,
    },

    razorpaySubscriptionId:{
        type:String,
        default:null,
    },

    SubscriptionStatus:{
        type:String,
        default: "inactive",
    },



})


const userModel = mongoose.model("users", userSchema);

export default userModel;
