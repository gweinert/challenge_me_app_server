const {ObjectId} = require('mongodb');
var assert = require('assert')


function getVotesPerHour(vote) {
    const numberOfVotes = vote.number
    const timeOfLastVoteMs = vote.timeOfVoteMs
    const nowMs = new Date().getTime()
    const hourInMs = 3600000
    const anHour = 1

    const voteTimeDiffHour = (nowMs - timeOfLastVoteMs) / hourInMs
    const votesPerHour = ( anHour -  voteTimeDiffHour ) * (numberOfVotes + 1)
    
    return votesPerHour

}

function userVoted(challenge, userID) {
    return challenge.votes.some(vote => vote.userID == userID)
}


module.exports = (req, res, next) => {
    
    const dateMs = new Date().getTime()
    const db = req.db
    var dbCol

    const collection = db.collection("challenges")
    const nowMs = new Date().getTime()
    const newVote = {
        _id: ObjectId(),
        userID: req.body["UserID"],
        createdAt: nowMs
    }


    collection.findOne({ _id: ObjectId(req.params.id)})
    .then((item, err) => {
        assert.equal(err, null);


        // var votesPerHour = getVotesPerHour(item.votes)
        if (userVoted(item, newVote.userID) || newVote.userID == undefined) {
            return res.json({success: 0, err: "Already voted"})
        }
        
        collection.updateOne(
            { _id : ObjectId(item._id) }, 
            { 
                $addToSet: { votes: newVote },
                $inc: { votesLength: 1 }
            }
        )
        .then(({err, result}) => {

            assert.equal(null, err);
            // assert.equal(1, result.matchedCount);
            // assert.equal(1, result.modifiedCount);
            if(err){
                res.json({success: 0, err: err})
            }
            res.json({
                success: 1, 
                newVote: newVote
            })
        })
    })
}