var {ObjectId} = require('mongodb');
var assert = require('assert')


const editChallenge = module.exports = (req, res, next) => {
    var db = req.db

    const challenges = db.collection('challenges')
    
    var  updatedChallenge = {
        _id : ObjectId(req.body["ChallengeID"]),
        name: req.body["Name"],
        description: req.body["Description"],
        category: req.body["Category"],
        locationName: req.body["LocationName"]
    }

    challenges.updateOne({ _id : updatedChallenge._id, userID: req.user._id }, 
        { $set: {
                    name: updatedChallenge.name,
                    description: updatedChallenge.description,
                    category: updatedChallenge.category,
                    locationName: updatedChallenge.locationName,
                } 
        }, 
        function(err, r) {
            assert.equal(null, err);
            assert.equal(1, r.matchedCount);
            assert.equal(1, r.modifiedCount);
            
            if(err) { res.json({success: 0, error: "Database error"})}
            
            res.json({success: 1, updatedChallenge})
        }
    )
}