var fs = require('fs');
var _ = {};

_.pad = function (str){
    return ('0' + str).slice(-2);
};

_.time = function(d){
    d = d || new Date();
    return [
        d.getFullYear(),
        _.pad(d.getMonth() + 1),
        _.pad(d.getDate())
    ].join('-');
};

function getIncrsPath(type, d){
    type = type || 'www';
    return '/tmp/' + type + '_' + _.time(d);
}

_.incrs = function(type){
    fs.writeFile(getIncrsPath(type), '1', { flag: 'a' });
};

_.count = function(type, d){
    var f = getIncrsPath(type, d);
    try {
        return fs.readFileSync(f, 'utf8').length;
    } catch(e) {}
    return 0;
};

module.exports = _;