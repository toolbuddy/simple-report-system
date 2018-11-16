/**
 * Use for fetching the change log of current repository
 * 
 */
const nodegit = require("nodegit"),
    path = require("path");

class changelog{
    constructor(){
        this.changelog = []
        this.init()
    }

    init(){
        // fetch changelog 
        let self=this
        nodegit.Repository.open(path.resolve(__dirname, "../../.git"))
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

    get_changelog(){
        return this.changelog
    }
}

module.exports = {
    changelog : new changelog()
}