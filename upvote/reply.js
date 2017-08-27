const {ObjectId} = require('mongodb');
var assert = require('assert')


// function userVoted(reply, userID) {
//     return reply.votes.some(vote => vote.userID == userID)
// }

function userVoted(replies, replyId, userID) {
    const reply = replies.find(reply => reply._id == replyId)
    return reply.votes.some(vote => vote.userID == userID)
}

function updateChallengeReplyUpvote(replies, replyId, newVote) {
    return replies.map(reply => {
        // console.log("reply", reply)
        if (reply && reply._id == replyId) {
            reply.votes.push(newVote)

            if (reply.votes.length > 2 && !reply.completed) {
                reply.completed = true
                
                // if (currentUser) {
                //     currentUser.completedChallenges = [...currentUser.completedChallenges, challenge]
                // }
            
            }

        }
        return reply
    })
}



const replyUpvote = module.exports = (req, res, next) => {
    
    const collection        = req.db.collection("challenges")
    const users             = req.db.collection("users")
    const challengeId       = req.params.challengeId
    const replyId           = req.params.id
    const userID            = req.body.UserID
    const nowMs             = new Date().getTime()
    var userVotedFlag       = false
    

    const newVote = {
        _id: ObjectId(),
        userID,
        createdAt: nowMs
    }

    // const currentUser = users.findOne({_id: userID})
    

    collection.findOne({ "replies._id":  ObjectId(replyId) })
    .then(challenge => {

        if (challenge == null) {
            return res.json({success: 0, err: "Challenge not found"})
        }

        if (userVoted(challenge.replies, replyId, newVote.userID)) {
            return res.json({success: 0, err: "Already exists"})            
        }

        const updatedReplies = updateChallengeReplyUpvote(challenge.replies, replyId, newVote)
              
        collection.updateOne(
            { _id: challenge._id },
            { $set: { replies: updatedReplies } }
        )
        .then(result => res.json({success: 1, newVote: newVote}) )
        .catch(err => res.json({success: 0, err}) )

    })

        // users.save(currentUser, function(err, r) {
        //     assert.equal(null, err);
        // })
}