/**
 * Use for fetching the change log of current repository
 * 
 */
const nodegit = require("nodegit"),
    path = require("path"),
    fs = require('fs')
const {db} = require('./db')

class changelog{
    constructor(){
        this.changelog = []
        this.pathtogit = "../.git"
        this.init()
    }

    init(){
        // fetch changelog 
        let self=this
        
        if(fs.existsSync(path.resolve(__dirname, this.pathtogit))){
            nodegit.Repository.open(path.resolve(__dirname, this.pathtogit))
                .then(function(repo) {
                    return repo.getMasterCommit();
                })
                .then(function(firstCommitOnMaster){
                    // History returns an event.
                    let history = firstCommitOnMaster.history(nodegit.Revwalk.SORT.TIME);

                    // History emits "commit" event for each commit in the branch's history
                    history.on("commit", function(commit) {
                        let commitInfo = {
                            "commit": commit.sha(),
                            "author": commit.author().name() + " <" + commit.author().email() + ">",
                            "date": commit.date(),
                            "msg": commit.message()
                        }
                        // console.log(commitInfo)
                        self.changelog.push(commitInfo)
                    });

                    // Don't forget to call `start()`!
                    history.start();
                })
                .done()
        }
    }

    sync_with_db(){
        for(let i in this.changelog){
            console.log(this.changelog[i])
            // store into database
            db.store_changelog(this.changelog[i])
        }
    }

    get_changelog(cb){
        if(fs.existsSync(path.resolve(__dirname, this.pathtogit))){
            // local 
            cb(0,this.changelog)
        }
        else{
            // available when .git is unreachable
            db.fetch_changelog((err,commits)=>{
                cb(0,commits)
            })
        }
    }
}

module.exports = {
    changelog : new changelog()
}