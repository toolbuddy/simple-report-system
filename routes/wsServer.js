/** 
 * Server instance for socket.io 
 * 
 * 
 */
const {db} = require('./v1/db')


class wsServer {
    constructor(httpServer){
        this.io = require('socket.io')(httpServer, {
            // below are engine.IO options
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false
        });
    }

    init(){
        this.io.on('connection', function(socket){
            console.log('a user connected');
            /** 
             * reporter 
             */ 
            socket.on('solve', function(msg){
                // msg.problem_id
                // msg.solver_id
                db.delete_solved_entry(msg.problem_id, msg.solver_id, 
                    (err,obj)=>{
                        if(err){
                            // error occur
                            console.log(obj)
                        }
                        // fetch the data , and send back to client
                        db.fetch_error_entries((err,errors)=>{
                            socket.emit('replot', errors)
                        })
                    })

            });

            /** 
             * delivery 
             */ 
            socket.on('finish', function(msg){
                // msg.problem_id
                // msg.solver_id
                db.delete_deliver_request(msg.problem_id, msg.solver_id, 
                    (err,obj)=>{
                        if(err){
                            // error occur
                            console.log(obj)
                        }
                        // fetch the data , and send back to client
                        db.fetch_deliver_request((err,requests)=>{
                            socket.emit('replot-request', requests)
                        })
                    })

            });
        });
    }
}

module.exports = wsServer