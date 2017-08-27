var {ObjectId} = require('mongodb');
var cloud = require('../GoogleCloudService')
var assert = require('assert')



//removes main image and all replies
function removeAllImages(challenge) {
    var files = []

    if (challenge.image) {
        files.push(challenge.image)
    }
    
    challenge.replies.forEach(reply => {
        if(reply.file) {
            files.push(reply.file)
        }
    })
    cloud.remove(files)
}

var removeChallenge = (req, res, next) => {

    const db = req.db
    const collection = db.collection('challenges')
    const { id } = req.params
    const { UserID } = req.body

    collection.findOne({ _id: ObjectId(id), userID: UserID})
    .then( challenge => {

        if (challenge == null) {
            return res.json({success: 0, err: "No challenge found"})
        }

        collection.deleteOne({ _id : ObjectId(id), userID: UserID })
        .then(({err, result}) => {
            assert.equal(err, null)
            assert.equal(1, result.n)
            
            removeAllImages(challenge)
            
            res.json({success: 1, id: id, resource: 'challenge'})
        }) 
    }) 
}

module.exports = removeChallenge