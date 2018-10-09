const express = require( 'express' );
const jsfs = require('jsonfile')
const path = require('path')
const router = new express.Router();

router.use( '/', (req,res)=>{
    var problem_list = jsfs.readFileSync(path.join(__dirname,'problem.json'));
    // report page
    res.render("report.ejs",{
        title: "Simple Report System",
        problem_list
    });
})

module.exports = router;