 var {ObjectId} = require('mongodb')
const passport  = require('passport')


const isAuthenticated = module.exports = (req, res, next) => {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	passport.authenticate('facebook-token', {session: false}, function (err, user, info) {
		if (err) {
			if (err.oauthError) {
				var oauthError = JSON.parse(err.oauthError.data)
				res.status(401).send(oauthError.error.message)
			} else {
				res.send(err)
			}
		} else {
			next()
		}
	})(req, res)
}