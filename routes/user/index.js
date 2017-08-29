const express = require('express')
const router = express.Router()
const user = require('../../user')
var multer  = require('multer')
var isAuthenticated = require('../auth/index');

const maxSize = 2000000
var upload = multer({limits: { fileSize: maxSize }})


router.get('/', user.all)

router.get('/detail/:id', user.detail)

router.post('/bookmark/:id',
    upload.none(),
    isAuthenticated,
    user.bookmark
)

router.post('/bookmark/delete/:id',
    upload.none(),
    isAuthenticated,
    user.deleteBookmark
)

module.exports = router