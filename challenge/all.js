var assert = require('assert')

const RADIUS_DEGREES = 1 // about 69 mile radius
const CHALLENGE_LIMIT = 4

module.exports = (req, res, next) => {

    // console.log("all chall req query", req.query, req.params)
    const db = req.db
    const collection = db.collection('challenges')
    const lng = parseFloat(req.query["Longitude"])
    const lat = parseFloat(req.query["Latitude"])
    let radius = parseFloat(req.query["Radius"]) || RADIUS_DEGREES
    const pageNumber = parseInt(req.params.pageNumber) || 0 // prevent NaN
    const userID = req.query["UserID"]
    let cursor
    
    if(lat && lng) {
        cursor = collection.find({
            location: {
                $geoWithin: { $center: [[lng, lat], radius]}
            }
        })
    } else {
        cursor = collection.find({})
    }

    if (userID) {
        collection.find({userID: userID}).toArray(function(err, docs) {
            if (err) return res.json({data: []})
            res.json({data: docs})
        })
    } else {
        cursor.sort({votesLength: 1, createdAt: -1, repliesLength: 1})
        .skip(pageNumber * CHALLENGE_LIMIT).limit(CHALLENGE_LIMIT).toArray(function(err, docs) {
            assert.equal(err, null);
            res.json({challenges: docs})
        })
    }
    
    
}