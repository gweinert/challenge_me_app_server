const {ObjectId} = require('mongodb');
const cloud = require('../GoogleCloudService')
var assert = require('assert')


//removes main image and all replies
function removeReplyImage(reply) {
    let files = []

    if(reply && reply.file) {
        files.push(reply.file)

        //takes an array of files
        cloud.remove(files)
    }
}

const removeReply = module.exports = (req, res, next) => {

    const db = req.db
    const collection = db.collection('challenges')
    const { id } = req.params

    collection.findOne(
        // { _id: ObjectId(challengeId), userID: req.user._id}, 
        { "replies._id": ObjectId(id), "replies.userID": req.body["UserID"]},
        
        function(err, challenge) {

            if (err || challenge == null) {
                return res.json({success: 0, err: "Does not exist"})
            }

            let replyToDelete
            const updatedReplies = challenge.replies.filter(reply => {
                if (reply._id == id) {
                        replyToDelete = reply
                    return false
                } else return true
            })
            challenge.replies = updatedReplies

            collection.save(challenge, function(err, r) {
                assert.equal(null, err);
                if (err) {
                    res.json({success: 0, err})
                }

                removeReplyImage(replyToDelete)
                res.json({success: 1, id, resource: 'reply', challengeID: challenge._id})
            })
        }
    )      
}