var express = require('express');
var app = express();
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.get('/', function(req, res){
    res.render('index');
});
var PORT = 5000;
app.listen(PORT, function(){
    console.log('[D] server run at port %d, see http://127.0.0.1:%d/', PORT, PORT);
});