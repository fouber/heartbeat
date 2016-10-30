var fs = require('fs');
var file = '/tmp/map.json';
var sms = require('./sms');
var alarm = require('./alarm');
var parse = require('./parse');
var MIN_ALIVE_COUNT = 180;
var MAX_ZOMBIE_COUNT = 0;
var count = 0;

(function run(){
    var map = {};
    try {
        var json = fs.readFileSync(file, 'utf8');
        map = JSON.parse(json);
    } catch(e){}
    var ret = parse(map);
    if(count % 60 == 0){
        alarm(ret, function(){
            console.log('wx_done');
        });
    }
    count++;
    var err = [];
    if(ret.alive && ret.alive.count < MIN_ALIVE_COUNT){
        err.push('有效进程数：' + ret.alive.count);
    // }
    // if(ret.zombie && ret.zombie.count > MAX_ZOMBIE_COUNT) {
        err.push('僵尸进程数：' + ret.zombie.count);
    }
    if(err.length){
        err.unshift('神秘服务异常');
        err.push('服务地址：http://120.27.116.219:5000/');
        err = err.join('，');
        console.log(err);
        sms(err, function(){
            console.log('done');
        });
    }
    setTimeout(run, 60 * 1000);
})();
