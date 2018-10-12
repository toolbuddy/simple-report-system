const express = require( 'express' );
const jsfs = require('jsonfile')
const path = require('path')
const router = new express.Router();

const {db} = require('./db')

router.use( '/login' , (req,res)=>{
    // POST method
    console.log(req.body)

    db.login(req.body.account, req.body.passwd, (err, obj)=>{
        if(err)
            res.end(JSON.stringify(obj))
        else{
            // login successful, go to mn.ejs
            db.fetch_error_entries((err,error_entry)=>{
                res.render('mn.ejs', {
                    title: "User Management Page",
                    username: req.body.account,
                    error_entry: error_entry
                })
            })
        }
    })
})

router.use( '/register' , (req,res)=>{
    // POST method
    console.log(req.body)

    db.register(req.body.account, req.body.passwd, req.body.secret, (err, obj)=>{
        if(err)
            res.end(JSON.stringify(obj))
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