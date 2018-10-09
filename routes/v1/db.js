// primitive
const Sequelize = require('sequelize')
const moment = require("moment")

class db{
    constructor(){
        const sequelize = new Sequelize('reporter',"root","kevin",{
            host: "localhost",
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
            passwd: Sequelize.STRING
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
