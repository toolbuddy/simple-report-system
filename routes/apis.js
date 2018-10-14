const express = require( 'express' );
const router = new express.Router();
const v1 = require('./v1/v1');
const model = require('./v1/model')
const user = require('./v1/user')

router.use('/', model)
router.use('/user', user)
router.use('/api/v1',v1);

/**
 * Some static page
 */
router.use('/about', function(req,res){
    res.render('about.ejs',{
        title: "關於 PC 助教的這檔事 ... "
    })
})

router.use('/', function(req,res){
    res.render('landing.ejs',{
        title: "歡迎使用簡易回報系統！"
    })
})

module.exports = router;