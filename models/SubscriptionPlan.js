const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, enum: ['Basic', 'Standard', 'Premium'] },
  price: { type: Number, required: true },
  duration: { type: String, required: true, enum: ['monthly', 'annual'] },
  benefits: [String],
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);