
var {ObjectId} = require('mongodb')
var assert = require('assert')


const getUser = module.exports = (req, res, next) => {

    
    const db = req.db
    const collection = db.collection('challenges')
    const userID = req.params["userId"]

    if (userID) {
        collection.find({"replies.userID": userID}).toArray().then(docs => {
            res.json({success: 1, data: docs})
        })
    } else res.json({success: 0, err: "No user ID"})
}
