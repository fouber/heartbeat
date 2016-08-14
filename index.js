var express = require('express');
var uvlog = require('./uvlog');
var app = express();
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

var EXPIRES_TIME = 25 * 60 * 1000;
var map = {};
try {
    map = require('/tmp/map.json');
} catch(e){}
var parse = require('./parse');
app.get('/', function(req, res){
    var ret = parse(map);
    res.render('index', {ret: ret});
});
app.use(express.static(__dirname));
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
app.get('/start', function(req, res){
    var id = req.query.id;
    var repeat = false;
    if(map.hasOwnProperty(id)){
        repeat = true;
        console.log('repeat process %s', id);
    }
    map[id] = Date.now();
    console.log('start process %s', id);
    res.json({ code: 0, repeat: repeat });
    save();
});
app.get('/end', function(req, res){
    var id = req.query.id;
    var has = false;
    if(map.hasOwnProperty(id)){
        has = true;
        delete map[id];
        console.log('end process %s', id);
    }
    res.json({ code: 0, has: has });

    save();
});

//自有统计数据输出
app.get('/uvlog', function(req, res){
    var data = fs.readFileSync('/tmp/uvlog.json');
    res.end(data);
});
app.get('/finish', function(req, res){
    //自有统计
    uvlog();
    var data = fs.readFileSync('/tmp/uvlog.json');
    res.json({ code: 0 });
});

var fs = require('fs');
function save(){
    fs.writeFileSync('/tmp/map.json', JSON.stringify(map, null, 2));
}
var PORT = 5000;
app.listen(PORT, function(){
    console.log('[D] server run at port %d, see http://127.0.0.1:%d/', PORT, PORT);
});