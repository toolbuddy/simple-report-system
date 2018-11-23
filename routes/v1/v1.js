const express = require( 'express' );
const jsfs = require('jsonfile')
const path = require('path')
const router = new express.Router();

const {db} = require('../../model/db')

// for maintainer login and the continuous manage
router.use( '/login', (req,res)=>{
    // manage page 
    res.render("login.ejs", {
        title: "管理員頁面"
    })
})

// software delivery request page
router.use( '/delivery', (req,res)=>{
    // delivery request page
    db.fetch_deliver_request((err,requests)=>{
        res.render("delivery.ejs", {
            title: "成功大學資訊系 - 電腦教室軟體派送請求", 
            request_list: requests
        })
    })
})

// main report page
router.use( '/reporter', (req,res)=>{
    var problem_list = jsfs.readFileSync(path.join(__dirname,'problem.json'));
    // report page
    db.fetch_error_entries((err,objs)=>{
        res.render("report.ejs",{
            title: "成功大學資訊系 - 電腦教室問題回報系統",
            problem_list,
            error_entry: objs
        });
    })
    
})

module.exports = router;