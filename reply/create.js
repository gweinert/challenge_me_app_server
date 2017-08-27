var cloud = require('../GoogleCloudService')
var {ObjectId} = require('mongodb')
var assert = require('assert')

const replyImageUpload = (req, res, next) => {
    cloud.upload(req, res, next)
}

const createReply = (req, res, next) => {
    
    const db = req.db
    const dateMs = new Date().getTime()
    var file = ""
    if(req.file) {
        file = req.file.cloudStoragePublicUrl
    }

    var newReply = {
         _id: ObjectId(),
        userID: req.body["UserID"],
        username: req.body["Username"],
        challengeId: req.body["ChallengeID"],
        votes: [],
        file: file,
        completed: false,
        dateCreated: dateMs
    }
    
    db.collection('challenges').updateOne(
    { _id : ObjectId(req.body["ChallengeID"]) }, 
    { 
        $addToSet: { replies: newReply },
        $inc: { repliesLength: 1 }
    })
    .then(({err, result}) => {
        assert.equal(1, result.nModified);

        if(err) res.json({success: 0, error: "database error on new reply"})

        // db.collection('users').updateOne(
        //     { _id: newReply.userID},
        //     { $addToSet: { replies: newReply}})
        // .then(({err, r}) => {
        //     assert.equal(null, err);
        //     assert.equal(1, r.matchedCount);
        //     assert.equal(1, r.modifiedCount);

        //     if(err) res.json({success: 0, error: "database error on new reply"})

        //     console.log(`Updated the user with new reply`)
        // })
        res.json({
            success: 1, 
            reply: newReply, 
            challenge: { _id: req.body["ChallengeID"]}
        })
       
    })

}

module.exports = [ replyImageUpload, createReply ]