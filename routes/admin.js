const express = require('express');
const router = express.Router();
const { adminRequired } = require('../middleware/admin');
const Listing = require('../models/listing');
const User = require('../models/user');
const Review = require('../models/review');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Subscription = require('../models/Subscription');

// Admin middleware
const adminAuth = (req, res, next) => {
    if (req.user && req.user.isAdmin) next();
    else res.status(403).json({ message: 'Admin access required' });
};

// Manage plans
router.get('/plans', adminAuth, async (req, res) => {
    const plans = await SubscriptionPlan.find();
    res.json(plans);
});

router.post('/plans', adminAuth, async (req, res) => {
    try {
        const newPlan = await SubscriptionPlan.create(req.body);
        res.status(201).json(newPlan);
    } catch (err) {
        res.status(400).json({ message: 'Invalid plan data' });
    }
});

// Manage subscriptions
router.get('/subscriptions', adminAuth, async (req, res) => {
    const subscriptions = await Subscription.find().populate('owner plan');
    res.json(subscriptions);
});

router.get('/metrics', adminRequired, async (req, res) => {
    try {
      const [
        totalListings,
        activeUsers,
        totalReviews,
        ownerIds,
        totalSubscriptions
      ] = await Promise.all([
        Listing.countDocuments(),
        User.countDocuments({ lastLogin: { $gt: new Date(Date.now() - 30*24*60*60*1000) }}),
        Review.countDocuments(),
        Listing.distinct('owner'),
        Subscription.countDocuments()
      ]);
  
      res.json({
        totalListings,
        activeUsers,
        totalReviews,
        messOwners: ownerIds.length,
        studentUsers: await User.countDocuments() - ownerIds.length,
        callsMade: 0, // Placeholder
        totalRevenue: await calculateRevenue()
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

async function calculateRevenue() {
    const subs = await Subscription.find({ status: 'active' }).populate('plan');
    return subs.reduce((sum, sub) => sum + sub.plan.price, 0);
}

module.exports = router;