// primitive
let crypto = require('crypto')
const rs = require('randomstring')
const Sequelize = require('sequelize')
const jsfs = require('jsonfile')
const path = require('path')
const moment = require("moment")
moment.tz.setDefault("Asia/Taipei")

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
            date: Sequelize.STRING,
            classroom_id: Sequelize.STRING,
            seat_id: Sequelize.STRING,
            problem_id: Sequelize.CHAR(64)
        })

        this.Delivery = sequelize.define('deliveries',{
            date: Sequelize.STRING,
            classroom_id: Sequelize.STRING,
            software_name: Sequelize.STRING,
            type: Sequelize.STRING,
            os: Sequelize.STRING,
            requirements: Sequelize.STRING(4096),
            duration: Sequelize.INTEGER,
            requester: Sequelize.STRING
        })

        this.Logger = sequelize.define('logs',{
            solver_id: Sequelize.STRING,
            date: Sequelize.STRING,
            classroom_id: Sequelize.STRING,
            seat_id: Sequelize.STRING,
            problem_id: Sequelize.CHAR(64)
        })

        this.DeliverLogger = sequelize.define('deliverlogs',{
            solver_id: Sequelize.STRING,
            date: Sequelize.STRING,
            classroom_id: Sequelize.STRING,
            software_name: Sequelize.STRING,
            type: Sequelize.STRING,
            os: Sequelize.STRING,
            requirements: Sequelize.STRING(4096),
            duration: Sequelize.INTEGER,
            requester: Sequelize.STRING
        })

        this.Changelog = sequelize.define('changelogs',{
            commit: Sequelize.STRING,
            date: Sequelize.STRING,
            author: Sequelize.STRING,
            msg: Sequelize.CHAR(255)
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
        else{
            cb(1, {
                msg: "認証碼錯誤"
            })
        }
    }

    /** 
     * Changelog
     * 
     */
    store_changelog(commits){
        return new Promise((resolve, reject)=>{
            this.Changelog.findOne({where: {commit: commits.commit}})
                .then((commit)=>{
                    if(commit==null){
                        // create commit
                        // insert it into database
                        this.Changelog.create({
                            commit: commits.commit,
                            date: commits.date.toString(),
                            msg: commits.msg,
                            author: commits.author
                        })
                        // return 
                        resolve({msg: "finished"})
                    }
                    else{
                        resolve({msg: "duplicated"})
                    }
                })
            })
    }

    fetch_changelog(cb){
        this.Changelog.findAll().then( commits=>{
            cb(0,commits)
        })
    }

    /**
     * Logger
     * 
     */
    // fetch all logs
    fetch_logs(cb){
        this.Logger.findAll().then( logs=>{
            cb(0,logs)
        })
    }

    fetch_deliver_logs(cb){
        this.DeliverLogger.findAll().then( logs=>{
            cb(0,logs)
        })
    }

    /** 
     * Software Deliver Request
     */
    add_deliver_request(request, cb){
        // TODO
        this.Delivery.create({
            date: moment().format(),
            classroom_id: request.classroom_id,
            software_name: request.software_name,
            type: request.type,
            os: request.os,
            requirements: request.requirements,
            duration: request.duration,
            requester: request.requester
        })
        cb(0,{
            msg: "new"
        })
    }

    delete_deliver_request(id, solver_id, cb){
        this.Delivery.findOne({where: {id: id}}).then(request=>{
            this.Delivery.destroy({where: {id: id}, cascade: false})
                .then(affectedRows => {
                    // using logger to log who modify the data
                    this.DeliverLogger.create({
                        solver_id: solver_id,
                        date: moment().format(),
                        classroom_id: request.classroom_id,
                        software_name: request.software_name,
                        type: request.type,
                        os: request.os,
                        requirements: request.requirements,
                        duration: request.duration,
                        requester: request.requester
                    }).then(()=>{
                        // return
                        cb(0, {msg: "deleted"})
                    }).catch(err=>{
                        // return
                        cb(1, {msg: "[delete] error code: "+err})
                    })
                }).catch((err)=>{
                    cb(1, {msg: "[delete] error code: "+err})
                })
        }).catch(err=>{
            cb(1, {msg: "[delete] error code: "+err})
        })
    }

    fetch_deliver_request(cb){
        this.Delivery.findAll().then( requests=>{
            cb(0, requests)
        })
    }

    /**
     * Dealing with Error Schema
     *
     */

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

    // del by solve 
    delete_solved_entry(id, solver_id, cb){
        this.Error.findOne({where: {id: id}}).then(error=>{
            this.Error.destroy({where: {id: id}, cascade: false})
                .then(affectedRows => {
                    // using logger to log who modify the data
                    this.Logger.create({
                        solver_id: solver_id,
                        date: moment().format(),
                        classroom_id: error.classroom_id,
                        seat_id: error.seat_id,
                        problem_id: error.problem_id
                    }).then(()=>{
                        // return
                        cb(0, {msg: "deleted"})
                    }).catch(err=>{
                        // return
                        cb(1, {msg: "[delete] error code: "+err})
                    })
                }).catch((err)=>{
                    cb(1, {msg: "[delete] error code: "+err})
                })
        }).catch(err=>{
            cb(1, {msg: "[delete] error code: "+err})
        })
        
    }
}

module.exports = {
    db: new db()
}
