var assert = require('assert')

const all = module.exports = (req, res, next) => {

    const db            = req.db
    const users         = db.collection('users')
    
    users.find({}).toArray(function(err, docs) {

        if (err) { return res.json({success: 0, err}) }
        
        assert.equal(err, null);
        
        res.json({success: 1, data: docs})
    })
}