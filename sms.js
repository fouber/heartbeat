var request = require('./request');
var API_HOST_NAME = 'sms.yunpian.com';
var API_PATH = '/v1/sms/multi_send.json';
var API_KEY = 'a107eed4b0270199218058b16405a77b';
var TEMPLATE = '【全民TV】发生线上故障：#content# ，请尽快修复！[#date_time#]';

var MOBILE = [ '18998499080', '13436429178', '15510079178' ];

function pad(str){
    return ('0' + str).slice(-2);
}

function moment(){
    var d = new Date();
    var YY = d.getFullYear();
    var MM = pad(d.getMonth() + 1);
    var DD = pad(d.getDate());
    var hh = pad(d.getHours());
    var mm = pad(d.getMinutes());
    var ss = pad(d.getSeconds());
    return [
        [ YY, MM, DD ].join('-'),
        [ hh, mm, ss ].join(':')
    ].join(' ');
}

function genText(content, repeat){
    var time = moment();
    var text = TEMPLATE.replace('#content#', content);
    text = text.replace('#date_time#', time);
    text = encodeURIComponent(text);
    var ret = [];
    for(var i = 0; i < repeat; i++){
        ret.push(text);
    }
    return ret.join(',');
}

function genForm(content){
    var form = {
        apikey: API_KEY,
        mobile: MOBILE.join(','),
        text: genText(content, MOBILE.length)
    };
    var data = [];
    for(var key in form){
        if(form.hasOwnProperty(key)){
            data.push(key + '=' + form[key]);
        }
    }
    return data.join('&');
}

function noop(){}

module.exports = function(content, callback){
    console.log('[E] ' + content);
    if(content.length > 460){
        var head = content.substring(0, 229);
        var tail = content.slice(-228);
        content = head + '...' + tail;
    }
    content = content.replace(/,/g, '，').replace(/\\/g, '');
    var data = genForm(content);
    callback = callback || noop;
    var opt = {
        hostname: API_HOST_NAME,
        port: 443,
        path: API_PATH,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Content-Length': data.length
        }
    };
    request(opt, data, function(err, body){
        console.log('[D] sms response: ' + body);
        callback.apply(null, arguments);
    });
};