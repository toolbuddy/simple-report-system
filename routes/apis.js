const express = require( 'express' );
const router = new express.Router();
const v1 = require('./v1/v1');
const model = require('./v1/model')

router.use('/', model)
router.use('/api/v1',v1);

module.exports = router;