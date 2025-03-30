const { Matrix } = require('ml-matrix');

class Recommender {
  async train() {
    const {interactions, listings} = await this._loadTrainingData();
    // Perform alternating least squares
    this.userFactors = this._initializeFactors(userCount);
    this.itemFactors = this._initializeFactors(itemCount);
    
    for(let iter = 0; iter < 20; iter++) {
      this.userFactors = this._optimizeUsers(interactions);
      this.itemFactors = this._optimizeItems(interactions);
    }
  }

  async getRecommendations(userId, context) {
    const userVector = await this._getUserEmbedding(userId);
    const scores = listings.map(listing => 
      this._scoreItem(userVector, listing.embedding, context)
    );
    return this._diversify(scores);
  }
}