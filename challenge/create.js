var cloud = require('../GoogleCloudService')
var {ObjectId} = require('mongodb')
var assert = require('assert')


const challengeImageUpload = (req, res, next) => {
    cloud.upload(req, res, next)
}

const createChallenge = (req, res, next) => {
    
    const db = req.db
    const dateMs = new Date().getTime()
    var image = ""
    if(req.file) {
        image = req.file.cloudStoragePublicUrl
    }

    const lng = parseFloat(req.body["Longitude"])
    const lat = parseFloat(req.body["Latitude"])

    var newChallenge = {
        _id: ObjectId(),
        name: req.body["Name"],
        description: req.body["Description"],
        category: req.body["Category"],
        userID: req.body["UserID"],
        username: req.body["Username"],
        votes: [],
        votesLength: 0,
        image: image,
        location: [lng, lat],
        locationName: req.body["LocationName"],
        replies: [],
        repliesLength: 0,
        theme: Math.floor((Math.random() * 10) + 1),
        createdAt: dateMs
    }
    
    try {
        db.collection('challenges').insertOne(newChallenge)
        .then(({err, r}) => {
            assert.equal(null, err)
        
            if(err != null) { res.send({success: 0}) }

            // db.collection('users').updateOne(
            //     { _id: newChallenge.userID},
            //     { $addToSet: { createdChallenges: newChallenge } }
            // )
            // .then(({err, r}) => {
            //     assert.equal(null, err)
            //     if(err != null) { res.send({success: 0}) }
                
            // })
            res.send({success: 1, challenge: newChallenge})
        
        })
    } catch (e) {
        console.log("error", e)
        res.send({success: 0, err: e})
    }

}

module.exports = [ challengeImageUpload, createChallenge ]