var fs = require('fs');
var _ = require('./util');
var DATA_ROOT = __dirname + '/data/';
var DATA_TOTAL = DATA_ROOT + 'total.json';

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
    fs.writeFile(getIncrsPath(type), '1', { flag: 'a' });
};

exports.current = function(type){
    return read(type || 'www');
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
            var www = exports.current('www');
            var m = exports.current('m');
            if(index == -1){
                total.date.push(date);
                total.data.www.push(www);
                total.data.m.push(m);
            } else {
                total.data.www[index] = www;
                total.data.m[index] = m;
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

exports.saveYestoday = function(){
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var date = [
        d.getFullYear(),
        _.pad(d.getMonth() + 1),
        _.pad(d.getDate())
    ].join('-');
    exports.save(date);
    console.log('store data at %s', date);
};