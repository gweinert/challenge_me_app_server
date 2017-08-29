var {ObjectId} = require('mongodb');
var assert = require('assert')

const detail = module.exports = (req, res, next) => {

    const db        = req.db
    const users     = db.collection('users')
    const { id }    = req.params
    
    users.findOne({_id: id})
    .then(user => {

        if (user == null) { return res.json({success: 0, err: "User not found"}) }
        
        res.json({success: 1, data: user})
    
    })
}