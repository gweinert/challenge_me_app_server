var multer  = require('multer')
var express = require('express')
var router = express.Router()
var reply = require('../../reply')
const maxSize = 1e+7
var upload = multer({limits: { fileSize: maxSize }})
var isAuthenticated = require('../auth/index');


router.post('/',
    upload.single('Reply'), 
    isAuthenticated,
    reply.create
)

router.post('/remove/:id', 
    upload.none(),
    isAuthenticated,
    reply.remove
)

router.get('/getUser/:userId',
    // isAuthenticated,
    reply.getUser
)

module.exports = router