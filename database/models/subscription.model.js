import mongoose from "mongoose";

function calculateNextBillingDate(startDate, billingCycle) {
  const newDate = new Date(startDate);
  switch (billingCycle.toLowerCase()) {
    case "daily":
      newDate.setDate(newDate.getDate() + 1);
      break;
    case "weekly":
      newDate.setDate(newDate.getDate() + 7);
      break;
    case "monthly":
      newDate.setMonth(newDate.getMonth() + 1);
      break;
    case "yearly":
      newDate.setFullYear(newDate.getFullYear() + 1);
      break;
  }
  return newDate;
}

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      max: [99999999, "Price is too high"],
    },
    currency: {
      type: String,
      required: true,
      enum: [
        "USD", "EUR", "GBP", "NGN", "JPY", "CAD", "AUD", "CHF", "SEK", 
        "DKK", "PLN", "CZK", "HUF", "RUB", "INR", "MXN", "BRL", "ARS", 
        "CLP", "PYG", "UYU", "VEF", "TRY", "NZD", "SGD", "HKD", "MYR", 
        "PHP", "THB", "IDR", "VND"
      ],
      default: "USD",
    },
    billingCycle: {
      type: String,
      required: true,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
      default: "Monthly",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function(value) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          return value >= tomorrow;
        },
        message: 'Start date must be at least tomorrow or later'
      }
    },
    nextBillingDate: {
      type: Date,
      required: true,
      default: function() {
        return this.calculateNextBillingDate(this.startDate);
      }
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Cancelled", "Expired"],
      default: "Active",
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Food", "Transportation", "Entertainment", "Utilities", "Health",
        "Education", "Rent", "Savings", "Groceries", "Shopping", "Travel",
        "Insurance", "Internet", "Mobile", "Donations", "Debt Repayment",
        "Subscriptions", "Gifts", "Taxes", "Miscellaneous", "Other"
      ]
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    notificationEnabled: {
      type: Boolean,
      default: true,
    },
    notificationDays: {
      type: Number,
      default: 7,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
subscriptionSchema.index({ userId: 1, nextBillingDate: 1 });
subscriptionSchema.index({ status: 1 });

// Virtual for calculating days until next billing
subscriptionSchema.virtual("daysUntilBilling").get(function () {
  const today = new Date();
  const timeDiff = this.nextBillingDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Method to check if subscription needs renewal
subscriptionSchema.methods.needsRenewal = function () {
  return this.daysUntilBilling <= this.notificationDays;
};

// Pre-validate middleware to set nextBillingDate
subscriptionSchema.pre('validate', function(next) {
  if (this.isNew || this.isModified('startDate') || this.isModified('billingCycle')) {
    this.nextBillingDate = calculateNextBillingDate(this.startDate, this.billingCycle);
  }
  next();
});

// Pre-save middleware to handle updates
subscriptionSchema.pre("save", function (next) {
  const now = new Date();
  
  // Auto update status and nextBillingDate if renewal date has passed
  if (this.nextBillingDate < now && this.status === "Active") {
    if (this.autoRenew) {
      while (this.nextBillingDate < now) {
        this.nextBillingDate = calculateNextBillingDate(this.nextBillingDate, this.billingCycle);
      }
    } else {
      this.status = "Expired";
    }
  }
  
  next();
});

// Add the calculateNextBillingDate as a static method
subscriptionSchema.statics.calculateNextBillingDate = calculateNextBillingDate;

// Add the calculateNextBillingDate as an instance method
subscriptionSchema.methods.calculateNextBillingDate = function(date) {
  return calculateNextBillingDate(date, this.billingCycle);
};

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
