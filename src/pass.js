import EventEmitter from 'events';
import { spawn } from 'child_process';
import readline from 'readline';

process.env.PATH = `/usr/local/bin:${process.env.PATH}`;

class PassEmitter extends EventEmitter {};

const pass = new PassEmitter();

pass.exec = function exec(args) {
	let thread = spawn('pass', args);
	let rl = readline.createInterface({
		"input": thread.stdout,
		"output": thread.stdin,
	});
	let output = {};
	rl.on('line', (line) => {
		if(!output.password) {
			output.password = line;
		} else if (/^\w(?:\w|-\w)*:/.test(line)) {
			let index = line.indexOf(':');
			let key = line.substring(0, index).trim();
			output[key] = line.substring(index + 1).trim();
		}
	});
	rl.on('pause', () => {
		pass.emit('end', output);
		rl.close();
		thread.kill();
	});
};

export default pass;
