var assert = require('assert')

const bookmark = module.exports = (req, res, next) => {

    const db = req.db
    const users = db.collection('users')
    
    const { id } = req.params
    const { UserID } = req.body

    users.updateOne({ _id : UserID }, 
        { $addToSet: { bookmarkedChallenges: id } },
        function(err, r) {
            assert.equal(null, err);
            assert.equal(1, r.matchedCount);
            assert.equal(1, r.modifiedCount);
            
            if(err) { res.json({success: 0, error: "Database error"})}
            
            res.json({success: 1, data: id})
        }
    )

}