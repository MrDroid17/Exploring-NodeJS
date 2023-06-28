const http = require('http');
const crypto = require("crypto");
const fs = require('fs');
/**
 * By default node uses 4 threads in thread pool
 */
process.env.UV_THREADPOOL_SIZE = 5;

const start = Date.now();

function doRequest() {
    http.request("http://google.com", res => {
        res.on("data", () => { })
        res.on("end", () => {
            console.log("Request : ", Date.now() - start);
        })
    }).end();
}

function doHash(serial_no) {
    crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
        console.log("Hash : " + serial_no, Date.now() - start);
    })
}

doRequest();

fs.readFile('multitask.js', 'utf8', () => {
    console.log("FS: ", Date.now() - start);
})

doHash(1);
doHash(2);
doHash(3);
doHash(4);






