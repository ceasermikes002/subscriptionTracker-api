import { SERVER_URL } from '../config/env.js';
import { workflowClient } from '../config/qstash.js';
import Subscription from '../database/models/subscription.model.js';

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      userId: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        'content-type': 'application/json',
      },
      retries: 0,
    })

    res.status(201).json({ success: true, data: { subscription, workflowRunId } });
  } catch (e) {
    next(e);
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if(req.user._id !== req.params.id) {
      const error = new Error('You are not authorized to view these subscriptions');
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ userId: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
}

export const updateSubscription = async (req, res, next) => {
  try {
    // First check if subscription belongs to user
    const existingSubscription = await Subscription.findById(req.params.id);
    
    if (!existingSubscription) {
      const error = new Error('Subscription not found');
      error.status = 404;
      throw error;
    }

    if (existingSubscription.userId.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to update this subscription');
      error.status = 401;
      throw error;
    }

    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: subscription });
  } catch (e) {
    next(e);
  }
}

export const deleteSubscription = async (req, res, next) => {
  try {
    // First check if subscription belongs to user
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      const error = new Error('Subscription not found');
      error.status = 404;
      throw error;
    }

    if (subscription.userId.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to delete this subscription');
      error.status = 401;
      throw error;
    }

    await Subscription.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (e) {
    next(e);
  }
}

export const cancelSubscription = async (req, res, next) => {
  try {
    // First check if subscription belongs to user
    const existingSubscription = await Subscription.findById(req.params.id);
    
    if (!existingSubscription) {
      const error = new Error('Subscription not found');
      error.status = 404;
      throw error;
    }

    if (existingSubscription.userId.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to cancel this subscription');
      error.status = 401;
      throw error;
    }

    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled' },
      { new: true }
    );

    res.status(200).json({ success: true, data: subscription });
  } catch (e) {
    next(e);
  }
}

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const subscriptions = await Subscription.find({
      userId: req.user._id,
      status: 'Active',
      nextBillingDate: {
        $gte: today,
        $lte: thirtyDaysFromNow
      }
    }).sort({ nextBillingDate: 1 });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
}

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find().populate('userId', 'username email');

    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
}
