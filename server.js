var http = require('http');
var exec = require('child_process').exec;

var server = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    exec('gulp serve', {cwd: '/vagrant'},function(err, stdout, stderr){
        console.log(stdout);
    });
    console.log('finishing request');
    res.end('<!DOCTYPE html><html><a href="http://localhost:8080">Running application</a></html>');
});

server.listen(8000);
console.log('SERVER STARTED, VISIT http://localhost:8000 TO TRIGGER PROJECT BUILD');
