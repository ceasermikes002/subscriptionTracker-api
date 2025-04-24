import { Router } from "express";
import {
  createSubscription,
  getUserSubscriptions,
  updateSubscription,
  deleteSubscription,
  cancelSubscription,
  getUpcomingRenewals,
  getAllSubscriptions,
} from "../controllers/subscription.controller.js";
import { protect, isAdmin } from "../middlewares/auth.middleware.js";

const subscriptionRouter = Router();

// Protect all routes
subscriptionRouter.use(protect);

// Regular user routes
subscriptionRouter.post("/", createSubscription);
subscriptionRouter.get("/user/:id", getUserSubscriptions);
subscriptionRouter.put("/update/:id", updateSubscription);
subscriptionRouter.delete("/delete/:id", deleteSubscription);
subscriptionRouter.put("/cancel/:id", cancelSubscription);
subscriptionRouter.get("/renewals/upcoming", getUpcomingRenewals);

// Admin only route
subscriptionRouter.get("/all", isAdmin, getAllSubscriptions);

export default subscriptionRouter;
