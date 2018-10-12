const express = require( 'express' );
const router = new express.Router();
const v1 = require('./v1/v1');
const model = require('./v1/model')
const user = require('./v1/user')

router.use('/', model)
router.use('/user', user)
router.use('/api/v1',v1);

module.exports = router;