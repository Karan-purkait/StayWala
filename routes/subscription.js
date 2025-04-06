const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Subscription = require('../models/Subscription');
const { jwtAuthMiddleware } = require('../auth');

// Get available plans
router.get('/plans', async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find({ isActive: true });
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create subscription
router.post('/subscribe', jwtAuthMiddleware, async (req, res) => {
    try {
        const { planId } = req.body;
        const plan = await SubscriptionPlan.findById(planId);
        const user = req.user;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: plan.stripePriceId,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/subscription/canceled`,
            customer_email: user.Email,
            metadata: {
                userId: user._id.toString(),
                planId: planId
            }
        });

        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ message: 'Subscription creation failed' });
    }
});

// Webhook handler
router.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            handleSubscriptionCreated(event.data.object);
            break;
        case 'invoice.paid':
            handleInvoicePaid(event.data.object);
            break;
        case 'invoice.payment_failed':
            handlePaymentFailed(event.data.object);
            break;
        case 'customer.subscription.deleted':
            handleSubscriptionCanceled(event.data.object);
            break;
    }

    res.json({ received: true });
});

module.exports = router;