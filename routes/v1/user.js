const express = require( 'express' );
const jsfs = require('jsonfile')
const path = require('path')
const router = new express.Router();

const {db} = require('./db')

router.use( '/login' , (req,res)=>{
    // POST method
    db.login(req.body.account, req.body.passwd, (err, obj)=>{
        if(err){
            res.render('error.ejs', {
                title: 404,
                msg: "使用者登入失敗",
                code: obj.msg
            })
        }
        else{
            // login successful, go to mn.ejs
            db.fetch_error_entries((err,error_entry)=>{
                // fetch logger
                db.fetch_logs((err,logs)=>{
                    res.render('mn.ejs', {
                        title: "User Management Page",
                        username: req.body.account,
                        error_entry: error_entry,
                        log_entry: logs
                    })
                })
            })
        }
    })
})

router.use( '/register' , (req,res)=>{
    // POST method
    db.register(req.body.account, req.body.passwd, req.body.secret, (err, obj)=>{
        if(err){
            res.render('error.ejs', {
                title: 404,
                msg: "使用者註冊失敗",
                code: obj.msg
            })
        }
        else{
            // login successful, go to redirect.ejs
            res.render('redirect.ejs',{
                title: "Redirecting to login page ...", 
                msg: "準備重新導向 ...",
                duration: 2, 
                url: "/api/v1/login"
            })
        }
    })
})


module.exports = router;