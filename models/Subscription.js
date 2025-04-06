const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'canceled', 'expired'], default: 'active' },
  stripeSubscriptionId: String,
  paymentMethodId: String
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);