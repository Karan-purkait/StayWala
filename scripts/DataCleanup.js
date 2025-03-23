// scripts/dataCleanup.js
const mongoose = require('mongoose');
const User = require('../models/user');
const Listing = require('../models/listing');

// Connect using your existing connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wanderlust');

const retentionPeriod = process.env.DATA_RETENTION_DAYS || 365; // Default 1 year

async function deleteOldData() {
    try {
        const cutoffDate = new Date(Date.now() - retentionPeriod * 24 * 60 * 60 * 1000);
        
        // Delete inactive users
        const userResult = await User.deleteMany({ 
            lastLogin: { $lt: cutoffDate } 
        });
        
        // Delete old listings without reviews
        const listingResult = await Listing.deleteMany({
            createdAt: { $lt: cutoffDate },
            reviews: { $size: 0 }
        });

        console.log(`Cleaned up:
        - Users: ${userResult.deletedCount}
        - Listings: ${listingResult.deletedCount}`);
        
    } catch (err) {
        console.error('Cleanup failed:', err);
    } finally {
        mongoose.disconnect();
    }
}

// Run if executed directly
if (require.main === module) {
    deleteOldData();
}

module.exports = deleteOldData;