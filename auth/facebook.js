const passport              = require('passport')
const FacebookTokenStrategy = require('passport-facebook-token');



// passport.serializeUser(function(user, done) {
//   done(null, user._id);
// });

// passport.deserializeUser(function(id, done) {
//   db.collection('users').findOne({ _id: id }, function(err, doc) {
//       done(err, doc)
//     });
// });


passport.use(new FacebookTokenStrategy({
    clientID: secrets.facebook.appID,
    clientSecret: secrets.facebook.appSecret
  }, function(accessToken, refreshToken, profile, done) {

    db.collection('users').findOne(
      { _id: profile.id }, 
      
      function(err, doc) {
        
        if(doc == null) {
          
          db.collection('users').insertOne({
            _id: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            displayName: profile.displayName,
            createdChallenges: [],
            completedChallenges: [],
            replies: [],
            profileImg: profile.photos[0].value
          }, function(err, r) {
                
                assert.equal(null, err);
                // req.assert.equal(1, r.matchedCount);
                // req.assert.equal(1, r.modifiedCount);
                done(err, profile)
            
            }
          )
        } else {
          done(err, doc)
        }
      }
     )
  }
));