const http = require('http')
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
/* core */
const routes = require('./routes/apis');
const app = express();
// using 2 type of render engine (pug/ejs)
app.set('view engine', 'ejs');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// Solving the cross-domain problem
app.use("*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    if (req.method === 'OPTIONS') {
        res.send(200)
    } else {
        next()
    }
});

/* For extension */
app.set('views',path.join(__dirname,'public/views'));
app.use(express.static(path.join(__dirname,'public/elements')));
app.use(express.static(path.join(__dirname,'public/images')));
app.use(express.static(path.join(__dirname,'public/css')));

app.use('/',routes);

/* ssl usage
var options = {
    key: fs.readFileSync(path.join('/','var','www','sslforfree','private.key')),
    cert: fs.readFileSync(path.join('/','var','www','sslforfree','certificate.crt'))
}
*/

/* Initialize all module */
const server = http.createServer(app);

/* 2 Server create! */
let port = process.env.PORT || process.env.npm_package_config_port;
server.listen(port, function() {
    console.log("Secure Server listening on port " + port);
});