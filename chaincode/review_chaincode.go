package main

import (
    "encoding/json"
    "fmt"
    "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type Review struct {
    ID        string `json:"id"`
    ListingID string `json:"listingId"`
    Rating    int    `json:"rating"`
    Comment   string `json:"comment"`
    Author    string `json:"author"`
    Timestamp int64  `json:"timestamp"`
}

type ReviewContract struct {
    contractapi.Contract
}

func (rc *ReviewContract) SubmitReview(ctx contractapi.TransactionContextInterface, reviewJSON string) error {
    var review Review
    json.Unmarshal([]byte(reviewJSON), &review)
    
    exists, _ := ctx.GetStub().GetState(review.ID)
    if exists != nil {
        return fmt.Errorf("review ID already exists")
    }
    
    return ctx.GetStub().PutState(review.ID, []byte(reviewJSON))
}

func (rc *ReviewContract) GetReviewsByListing(ctx contractapi.TransactionContextInterface, listingID string) ([]*Review, error) {
    query := fmt.Sprintf(`{"selector":{"listingId":"%s"}}`, listingID)
    resultsIterator, err := ctx.GetStub().GetQueryResult(query)
    if err != nil {
        return nil, err
    }
    defer resultsIterator.Close()
    
    var reviews []*Review
    for resultsIterator.HasNext() {
        queryResponse, _ := resultsIterator.Next()
        var review Review
        json.Unmarshal(queryResponse.Value, &review)
        reviews = append(reviews, &review)
    }
    return reviews, nil
}