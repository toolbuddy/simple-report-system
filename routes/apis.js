const express = require( 'express' );
const router = new express.Router();
const v1 = require('./v1/v1');
const model = require('./v1/model')
const user = require('./v1/user')

const {db} = require('./v1/db')
const {changelog} = require('./v1/changelog')

// running by developer only (cause heroku can't access .git/ folder)
setTimeout(()=>{
    changelog.sync_with_db()
}, 5000)

router.use('/', model)
router.use('/user', user)
router.use('/api/v1',v1);

/**
 * Some static page
 */
router.use('/changelog', function(req,res){
    changelog.get_changelog((err, commits)=>{
        if(err){
            // error 
            res.render('error.ejs', {
                title: 404,
                msg: "獲取 Changelog 失敗",
                code: "unknown errors."
            })
        }
        else{
            res.render('changelog.ejs',{
                title: "更新日誌",
                changelog: commits
            })
        }
    })
    
})

router.use('/log', function(req,res){
    // fetch logger
    db.fetch_logs((err,logs)=>{
        res.render('log.ejs',{
            title: "修繕日誌",
            log_entry: logs
        })
    })
})

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