var fs = require('fs');
var _ = require('./util');
var DATA_ROOT = __dirname + '/data/';
var DATA_TOTAL = DATA_ROOT + 'total.json';
var current = {
    www: read('www'),
    m: read('m')
};

function read(type, d){
    var f = getIncrsPath(type, d);
    try {
        return fs.readFileSync(f, 'utf8').length;
    } catch(e) {}
    return 0;
}

function getIncrsPath(type, d){
    type = type || 'www';
    return DATA_ROOT + type + '_' + _.time(d);
}

exports.incrs = function(type){
    if(current.hasOwnProperty(type)){
        current[type]++;
    } else {
        current[type] = 1;
    }
    fs.writeFile(getIncrsPath(type), '1', { flag: 'a' });
};

exports.current = function(type){
    return current[type] || 0;
};

exports.total = function(today){
    var total = {
        date: [],
        data: {
            www: [],
            m: []
        }
    };
    try {
        total = JSON.parse(fs.readFileSync(DATA_TOTAL, 'utf8'));
        if(today){
            var date = _.time();
            var index = total.date.indexOf(date);
            if(index == -1){
                total.date.push(date);
                total.data.www.push(current.www || 0);
                total.data.m.push(current.m || 0);
            } else {
                total.data.www[index] = current.www || 0;
                total.data.m[index] = current.m || 0;
            }
        }
    } catch (e){}
    return total;
};

exports.save = function(date){
    var www_file = DATA_ROOT + 'www_' + date;
    var m_file = DATA_ROOT + 'm_' + date;
    var www = fs.readFileSync(www_file, 'utf8').length;
    var m = fs.readFileSync(m_file, 'utf8').length;
    var total = exports.total();
    var index = total.date.indexOf(date);
    if(index === -1){
        total.date.push(date);
        total.data.www.push(www);
        total.data.m.push(m);
    } else {
        total.data.www[index] = www;
        total.data.m[index] = m;
    }
    fs.writeFileSync(DATA_TOTAL, JSON.stringify(total, null, 2));
    fs.unlinkSync(www_file);
    fs.unlinkSync(m_file);
};