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

module.exports = _;