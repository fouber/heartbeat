var request = require('./request');

module.exports = function(data, callback){
    callback = callback || function(){};
    request.post(url,
        {
            form: {
                alive: data.alive.count,
                zombie: data.zombie.count
            }
        }, 
        function(err,httpResponse,body){
            callback.apply(null, arguments);
        }
    ); 
};