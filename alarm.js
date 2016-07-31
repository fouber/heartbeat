var request = require('request');

module.exports = function(data, callback){
    callback = callback || function(){};
    request.post("http://egaogong.com/weixinaa/tplinfo",
        {
            form: {
                alive: data.alive.count,
                zombie: data.zombie.count
            }
        }, 
        function(err,httpResponse,body){
            if(err) console.log('[E] ' + err);
            callback.apply(null, arguments);
        }
    ); 
};