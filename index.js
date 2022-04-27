// SA-MP HTTP Server, created by Platinum#8716
/*
Additional information, this project was for experimental-purposes, bug and error may occur.
So you need to fix it by yourself
*/

// Import library
var http = require("http");
const fs = require("fs");

// Database
var serverName = "SAMP Server";
var access_ip = [""];
var playerData = "./database/player/";

// Blacklist system
var visit = 0;
var blacklist = new Map();
var timeout = 10000;
function add_address(address) {
    blacklist.set(address, Date.now() + 10000);
}

// HTTP Server
function serverEvent(port) {
    // Create server event
    var server = http.createServer(async function (req, res) {
        // Filter IP
        var ip = ((req.headers['cf-connecting-ip'] && req.headers['cf-connecting-ip'].split(', ').length) ? req.headers['cf-connecting-ip'].split(', ')[0] : req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(/::ffff:/g).filter(i => i).join('');

        // Main default page
        if (req.url == "/") {
            if (req.method == "GET") {
                console.log(`[LOGS] Client: ${ip} entered default page`)
                res.writeHead(200);
                res.write("Welcome to SA-MP HTTP Server, Made proudly by Platinum#8716");
                return res.end();
            }
        }

        // Database page
        if (req.url == "/database/player/") {
            if (req.method == "POST") { // Database path will only accept POST method
                console.log(`[LOGS] Client: ${ip} accessed database value`)
                access_ip.push(ip);
                fs.readdir(playerData, (err, files) => {
                    files.forEach(file => {
                        for (i in file) {
                            fs.readFile(i);
                        }
                    });
                });
            }
            else { // Give an exception if the method given is not POST
                console.log(`[LOGS] Client: ${ip} has been blocked | trying to bypass`)
                if (!blacklist.has(ip) + req.url) {
                    add_address(ip + req.url);
                }
                else {
                    var not_allowed = blacklist.get(req.connection.remoteAddress + req.url);
                    if (Date.now() > not_allowed) {
                        console.log(`[BLACKLIST] Client: ${ip} removed from blacklist`);
                        blacklist["delete"](req.connection.remoteAddress + req.url);
                    }
                    else {
                        console.log(`[BLACKLIST] Client: ${ip} has been blacklisted`);
                        return req.connection.destroy();
                    }
                }
                if (!ip in access_ip) {
                    res.writeHead(404);
                    res.write("Access denied, 404");
                    req.connection.destroy();
                    return res.end();
                }
                else {
                    res.writeHead(404);
                    res.write("Access denied, 404");
                    req.connection.destroy();
                    return res.end();
                }
            }
        }
    });
    // Start and run the server event
    server.listen(port);
    server.on("listening", function () { 
        console.log("[EVENT] SA-MP HTTP Server is running, currently running on port: " + port)
        console.log(`[INFO] Server Name: ${serverName}`)
    });
}

// Run server
serverEvent(80);