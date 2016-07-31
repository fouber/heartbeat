var fs = require('fs');
var file = '/tmp/map.json';
var sms = require('./sms');
var parse = require('./parse');
var MIN_ALIVE_COUNT = 140;
var MAX_ZOMBIE_COUNT = 0;

(function run(){
    var map = {};
    try {
        var json = fs.readFileSync(file, 'utf8');
        map = JSON.parse(json);
    } catch(e){}
    var ret = parse(map);
    var err = [];
    if(ret.alive && ret.alive.count < MIN_ALIVE_COUNT){
        err.push('有效进程数：' + ret.alive.count);
    }
    if(ret.zombie && ret.zombie.count > MAX_ZOMBIE_COUNT) {
        err.push('僵尸进程数：' + ret.zombie.count);
    }
    if(err.length){
        err.unshift('神秘服务异常');
        err.push('服务地址：http://52.41.18.233:5000/');
        err = err.join('，');
        console.log(err);
        sms(err, function(){
            console.log('done');
        });
    }
    setTimeout(run, 30 * 1000);
})();