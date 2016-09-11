var fs = require('fs');
var express = require('express');
var _ = require('./util');
var count = require('./count');
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
    res.render('index', {
        ret: parse(map),
        count: {
            www: count.current('www'),
            m: count.current('m')
        },
        speed: {
            www: count.speed('www'),
            m: count.speed('m')
        },
        total: count.total(true)
    });
});
app.use(express.static(__dirname));
app.get('/incrs', function(req, res){
    res.json({code: 0});
    count.incrs(req.query.type);
});
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
function save(){
    fs.writeFileSync('/tmp/map.json', JSON.stringify(map, null, 2));
}
var PORT = 5000;
app.listen(PORT, function(){
    console.log('[D] server run at port %d, see http://127.0.0.1:%d/', PORT, PORT);
});