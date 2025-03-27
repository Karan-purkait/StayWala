const { Gateway } = require('fabric-network');
const cryptoService = require('./crypto');

class BlockchainClient {
    async submitReview(userId, reviewData) {
        const gateway = new Gateway();
        await gateway.connect({
            wallet: cryptoService.wallet,
            identity: userId,
            discovery: { enabled: true, asLocalhost: true }
        });
        
        const network = await gateway.getNetwork('review-channel');
        const contract = network.getContract('review-chaincode');
        
        const result = await contract.submitTransaction(
            'SubmitReview',
            JSON.stringify(reviewData)
        );
        
        gateway.disconnect();
        return result.toString();
    }

    async getReviews(listingId) {
        // Similar implementation for query
    }
}

module.exports = new BlockchainClient();