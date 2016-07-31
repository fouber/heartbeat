var fs = require('fs');
var file = '/tmp/map.json';
var sms = require('./sms');
var parse = require('./parse');

(function run(){
    var map = {};
    try {
        var json = fs.readFileSync(file, 'utf8');
        map = JSON.parse(json);
    } catch(e){}
    var ret = parse(map);
    var err = [];
    if(ret.alive && ret.alive.count < 150){
        err.push('有效进程数：' + ret.alive.count);
    }
    if(ret.zombie && ret.zombie.count > 0) {
        err.push('僵尸进程数：' + ret.zombie.count);
    }
    if(err.length){
        err.unshift('神秘服务发生异常');
        err = err.join('，');
        console.log(err);
        sms(err, function(){
            console.log('done');
        });
    }
    setTimeout(run, 30 * 1000);
})();