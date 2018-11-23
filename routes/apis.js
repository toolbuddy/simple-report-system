const express = require( 'express' );
const router = new express.Router();
const v1 = require('./v1/v1');
const model = require('./v1/model')
const user = require('./v1/user')
const statics = require('./v1/static_pages')

const {changelog} = require('../model/changelog')

// running by developer only (cause heroku can't access .git/ folder)
setTimeout(()=>{
    changelog.sync_with_db()
}, 5000)

// routes' entry
router.use('/v1', v1)
router.use('/user', user)
router.use('/api/v1', model)
router.use('/', statics)

module.exports = router;