
const cluster = require('cluster');
/**
 * check if process is master
 */
if(cluster.isMaster){
    /***
     * create and manage child processes
     */
    cluster.fork();// 1st child process
    // cluster.fork();// 2nd child process
    // cluster.fork(); // 3rd child process
    // cluster.fork(); // 4th child process
} else {
    
    const express = require('express');
    const app = express();
    
    function doWork(duration){
        const start = Date.now();
        while(Date.now()-start < duration){};
    }
    
    
    app.get("/", (req, res) => {
        doWork(5000);
        res.send("Hi There");
    });

    app.get("/fast", (req, res) => {
        res.send("That was Fast.");
    });
    app.listen(3000);
}