var EXPIRES_TIME = 25 * 60 * 1000;

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

module.exports = function(map){
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
    var now = Date.now();
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
    // for(var key in ret){
    //     if(ret.hasOwnProperty(key) && ret[key].count == 0){
    //         delete ret[key];
    //     }
    // }
    return ret;
}