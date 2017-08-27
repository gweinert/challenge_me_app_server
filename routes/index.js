const express       = require('express')
const router        = express.Router()
const passport      = require('passport')
const challenge     = require('./challenge')
const upvote        = require('./upvote')
const reply         = require('./reply')
const user          = require('./user')
// const FacebookTokenStrategy = require('passport-facebook-token')



// define the home page route
router.get('/', function (req, res) {
  res.send('404')
})

router.use('/challenge', challenge)
router.use('/upvote', upvote)
router.use('/reply', reply)
router.use('/user', user)

router.get('/auth/facebook/token',
  passport.authenticate('facebook-token', { session: false }),
  function (req, res) {
    res.json({success: 1, user: req.user})
  }
);

router.get('/getUser', (req, res) => {
  if(req.user){
    res.json({success: 1, user: req.user, sessionID: req.sessionID})
  } else {
    res.json({success: 0, sessionID: req.sessionID})
  }
})

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


module.exports = router