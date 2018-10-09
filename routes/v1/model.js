const express = require( 'express' );
const jsfs = require('jsonfile')
const path = require('path')
const router = new express.Router();

const {db} = require('./db')

router.use( '/report', (req,res)=>{
    console.log(req.query)
    db.add_error_entry({
        classroom_id: req.query.cr,
        problem_id: req.query.pi,
        seat_id: req.query.ps
    }, (err,obj)=>{
        // return 
        res.end(JSON.stringify(obj))
    })
})

router.use( '/login' , (req,res)=>{
})

router.use( '/fetch' , (req,res)=>{
    db.fetch_error_entries((err,obj)=>{
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.end(JSON.stringify(obj))
    })
})

module.exports = router;