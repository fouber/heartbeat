var fs = require('fs');

function save(){
	var d = new Date(),
		year = d.getFullYear(),
		month = d.getMonth() + 1,
		today = d.getDate(),
		tname = year + "-" + month + "-" +today;
		var data = JSON.parse(fs.readFileSync('/tmp/uvlog.json'));
		data[tname] = data[tname]?parseInt(data[tname])+1:1;
    	fs.writeFileSync('/tmp/uvlog.json', JSON.stringify(data));
}
module.exports = save;