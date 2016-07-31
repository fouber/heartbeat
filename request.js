var zlib = require('zlib');
var http = require('http');
var https = require('https');

module.exports = function(opt, data, callback){
    var client = opt.port == 443 ? https : http;
    callback = callback || function(){};
    var req = client.request(opt, function(res){
        var chunks =[], encoding = res.headers['content-encoding'];
        if( encoding === 'undefined'){
            res.setEncoding('utf-8');
        }
        res.on('data', function(chunk){
            chunks.push(chunk);
        });
        res.on('end', function(){
            var buffer = Buffer.concat(chunks);
            if (encoding == 'gzip') {
                zlib.gunzip(buffer, function (err, decoded) {
                    data = decoded.toString();
                    callback( err, data, res );
                });
            } else if (encoding == 'deflate') {
                zlib.inflate(buffer, function (err, decoded) {
                    data = decoded.toString();
                    callback( err, data, res );
                });
            } else {
                data = buffer.toString();
                callback( null, data, res );
            }
        });
    });
    req.on('error', function(e){
        callback(e);
    });
    if(data) req.write(data);
    if(opt.timeout) req.setTimeout(opt.timeout);
    req.end();
    return req;
};