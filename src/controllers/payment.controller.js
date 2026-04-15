import razorpay from "../config/razorpay.js";
import userModel from "../models/user.models.js";

export const createSubscription = async (req, res) => {
  try {
    const { userId, country } = req.body;
    console.log("req.body", req.body);

    const user = await userModel.findById(userId);
    console.log("user", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let plan_id = country === "IN" ? "plan_SdhjDS0jq0t1jI" : "plan_SdhjtzGVIQRmIL";

    const subscription = await razorpay.subscriptions.create({
      plan_id,
      customer_notify: 1,
      total_count: 12,
      notes: {
        // userId: user._id.toString(),
         userId: String(user._id),
      },
    });

    res.status(200).json({
      subscriptionId: subscription.id,
    });
    
  } catch (error) {
    console.log("error", error)
    res.status(500).json({
      message: "Subscription Failed",
      error: error.message,
    });
  }
};
