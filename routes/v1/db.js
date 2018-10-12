// primitive
let crypto = require('crypto')
const rs = require('randomstring')
const Sequelize = require('sequelize')
const moment = require("moment")
const jsfs = require('jsonfile')
const path = require('path')

var dbconfig = jsfs.readFileSync(path.join(__dirname,'.dbconfig.json'));

class db{
    constructor(){
        const sequelize = new Sequelize(dbconfig.db_schema,dbconfig.db_username,dbconfig.db_userpasswd,{
            host: dbconfig.db_host,
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            define: {
                charset: 'utf8',
                dialectOptions: {
                    collate: 'utf8_general_ci'
                }
            },
            operatorsAliases: false
        });

        this.User = sequelize.define('users',{
            username: Sequelize.STRING,
            passwd: Sequelize.STRING,
            salt: Sequelize.STRING
        });

        this.Error = sequelize.define('errors',{
            date: Sequelize.DATE,
            classroom_id: Sequelize.STRING,
            seat_id: Sequelize.STRING,
            problem_id: Sequelize.CHAR(64)
        })

        // test connection
        sequelize
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });

        // sync with database
        sequelize.sync();
    }

    // login by admin (to manipulate backend data)
    login(username, passwd, cb){
        this.User.findOne({where: {username: username}}).then(userinfo => {
            if(userinfo == null){
                // not found
                cb(1, {
                    msg: "not found"
                })
            }
            else {
                // found one, return the message
                // check the user's salt
                if(crypto.pbkdf2Sync(passwd,userinfo.salt,100000,64,'sha512').toString('hex') == userinfo.passwd){
                    cb(0,{
                        msg: "success"
                    });
                }
                else{
                    cb(1,{
                        msg: "wrong password"
                    });
                }
            }
        })
    }

    // register as admin 
    register(username, passwd, secret, cb){
        // admin authenticate
        if(secret == dbconfig.secret_key){
            this.User.findOne({where: {username: username}}).then(user=>{
                if(user==null){
                    // create for this user
                    // TODO: need to pay for this key
                    let key = rs.generate(16);
        
                    // Using crypto to implement hash and salt mechansim
                    let product_key = crypto.pbkdf2Sync(passwd,key,100000,64,'sha512').toString('hex')
                    // insert it into database
                    this.User.create({
                        username: username,
                        passwd: product_key,
                        salt: key
                    })
                    // return
                    cb(0,{
                        msg: "success"
                    });
                }
                else{
                    cb(1,{
                        msg: "duplicated"
                    });
                }
            })
        }
    }

    add_error_entry(error, cb){
        this.Error.create({
            date: moment().format(),
            classroom_id: error.classroom_id,
            seat_id: error.seat_id,
            problem_id: error.problem_id
        })
        cb(0, {
            msg: "new"
        })
    }

    // delete entry by date
    delete_error_entry(month, cb){

    }

    // fetch all entries
    fetch_error_entries(cb){
        this.Error.findAll().then( errors=>{
            cb(0,errors)
        })
    }
}

module.exports = {
    db: new db()
}
