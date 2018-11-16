const express = require( 'express' );
const jsfs = require('jsonfile')
const path = require('path')
const router = new express.Router();
const {db} = require('./db')

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
            url: "/api/v1"
        })
    })
})

module.exports = router;