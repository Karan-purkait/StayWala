const applySubscriptionBenefits = async (req, res, next) => {
    const listing = req.body.listing;
    const owner = await User.findById(req.user._id).populate('subscription');
    
    if (owner.subscription) {
        const plan = await SubscriptionPlan.findById(owner.subscription.plan);
        listing.isHighlighted = plan.benefits.includes('highlighted');
        listing.priority = plan.benefits.includes('priority_search') ? 1 : 0;
    }
    
    next();
};

const checkSubscription = async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('subscription');
    
    if (user.subscription && user.subscription.status !== 'active') {
        return res.status(403).json({ message: 'Subscription required' });
    }
    
    next();
};

module.exports = { applySubscriptionBenefits };