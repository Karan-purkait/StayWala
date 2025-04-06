const express = require('express');
const router = express.Router();
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

module.exports = router;