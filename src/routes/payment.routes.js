import {Router} from 'express';
import * as paymentController from "../controllers/payment.controller.js";

const subscriptionRouter = Router()


// post /api/payment/create-Subscription
subscriptionRouter.post("/create-Subscription", paymentController.createSubscription );

export default subscriptionRouter;