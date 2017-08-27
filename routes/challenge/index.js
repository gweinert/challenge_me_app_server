var multer  = require('multer')
var express = require('express')
var router = express.Router()
var challenge = require('../../challenge')
var isAuthenticated = require('../auth/index');

const maxSize = 2000000
var upload = multer({limits: { fileSize: maxSize }})

router.get('/:pageNumber', challenge.all)

router.post('/',
    upload.single('Image'),
    isAuthenticated,
    challenge.create)

router.post('/edit', 
    upload.none(), 
    isAuthenticated,
    challenge.edit)

router.post('/remove/:id', 
    upload.none(),
    isAuthenticated,
    challenge.remove
)

module.exports = router