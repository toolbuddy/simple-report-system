/** 
 * Routes for static pages
 */
const express = require( 'express' );
const router = new express.Router();

const {db} = require('../../model/db')
const {changelog} = require('../../model/changelog')

router.use('/software', function(req,res){
    // list current software in classroom
    res.render('software.ejs',{
        title: "已安裝軟體列表"
    })
})

router.use('/changelog', function(req,res){
    changelog.get_changelog((err, commits)=>{
        // sorting commits
        commits.sort(function(a,b){
            return new Date(b.date) - new Date(a.date);
        });

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
        db.fetch_deliver_logs((err,deliver_logs)=>{
            res.render('log.ejs',{
                title: "PC 助教 の 日誌",
                finished_request_list: deliver_logs,
                log_entry: logs
            })
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