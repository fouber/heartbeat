var express = require('express');
var app = express();
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

var EXPIRES_TIME = 20 * 60 * 1000
var map = {};
try {
    map = require('/tmp/map.json');
} catch(e){}
var pad = function(str){
    return ('0' + str).slice(-2);
};
var soFar = function(d){
    var now = Date.now();
    var diff = Math.round((now - d.getTime()) / 1000);
    var second = diff % 60;
    diff = (diff - second)/60;
    var minute = diff % 60;
    var hour = (diff - minute)/60;
    return [pad(hour), pad(minute), pad(second)].join(':');
};
app.get('/clean', function(req, res){
    var now = Date.now();
    for(var key in map){
        if(map.hasOwnProperty(key)){
            var time = map[key];
            var d = new Date(time);
            if(now - time > EXPIRES_TIME){
                delete map[key];
            }
        }
    }
    console.log('clean all zombie process');
    res.json({ code: 0 });
    save();
});
app.get('/', function(req, res){
    var now = Date.now();
    var ret = {
        zombie: {
            count: 0,
            items: {}
        },
        alive: {
            count: 0,
            items: {}
        }
    };
    for(var key in map){
        if(map.hasOwnProperty(key)){
            var time = map[key];
            var d = new Date(time);
            var info = {
                startAt: d + '',
                sofar: soFar(d)
            };
            if(now - time > EXPIRES_TIME){
                ret.zombie.count++;
                ret.zombie.items[key] = info;
            } else {
                ret.alive.count++;
                ret.alive.items[key] = info;
            }
        }
    }
    for(var key in ret){
        if(ret.hasOwnProperty(key) && ret[key].count == 0){
            delete ret[key];
        }
    }
    res.render('index', {ret: ret});
});
app.get('/start', function(req, res){
    var id = req.query.id;
    map[id] = Date.now();
    console.log('start process %s', id);
    res.json({ code: 0 });
    save();
});
app.get('/end', function(req, res){
    var id = req.query.id;
    delete map[id];
    console.log('end process %s', id);
    res.json({ code: 0 });
    save();
});

var fs = require('fs');
function save(){
    fs.writeFileSync('/tmp/map.json', JSON.stringify(map, null, 2));
}
var PORT = 5000;
app.listen(PORT, function(){
    console.log('[D] server run at port %d, see http://127.0.0.1:%d/', PORT, PORT);
});