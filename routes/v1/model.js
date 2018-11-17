const express = require( 'express' );
const jsfs = require('jsonfile')
const path = require('path')
const router = new express.Router();
const {db} = require('./db')

// For deliver
router.use( '/deliver', (req,res)=>{
    db.add_deliver_request({
        classroom_id: req.query.cr,
        software_name: req.query.software_name,
        type: req.query.type,
        os: req.query.os,
        requirements: req.query.requirements,
        duration: req.query.duration,
        requester: req.query.requester
    }, (err, obj)=>{
        if(err){
            res.render('error.ejs',{
                title: 404,
                msg: "派送請求寫入失敗",
                code: obj.msg
            })
        } 
        // return 
        res.render('redirect.ejs',{
            title: "Redirecting back to deliver page ...", 
            msg: "成功申請軟體派送，靜候佳音！",
            duration: 2, 
            url: "/api/v1/delivery"
        })
    })
})

// For reporter 
router.use( '/report', (req,res)=>{
    db.add_error_entry({
        classroom_id: req.query.cr,
        problem_id: req.query.pi,
        seat_id: req.query.ps
    }, (err,obj)=>{
        if(err){
            res.render('error.ejs', {
                title: 404,
                msg: "報錯紀錄寫入失敗",
                code: obj.msg
            })
        }
        // return 
        res.render('redirect.ejs',{
            title: "Redirecting back to report page ...", 
            msg: "成功登錄錯誤內容，感謝回報！",
            duration: 2, 
            url: "/api/v1/reporter"
        })
    })
})

module.exports = router;