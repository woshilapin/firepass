import EventEmitter from 'events';
import { spawn } from 'child_process';
import readline from 'readline';
import _ from 'lodash';

process.env.PATH = `/usr/local/bin:${process.env.PATH}`;

class PassEmitter extends EventEmitter {};

const pass = new PassEmitter();

function exec(args) {

	let thread = spawn('pass', args);
	return readline.createInterface({
		"input": thread.stdout,
		"output": thread.stdin,
	});
}

pass.ls = () => {
	let rl = exec(['ls']);
	let current = [];
	let pathlist = [];
	let root = [];
	let paths = {};
	rl.on('line', (line) => {
		let level = Math.floor(line.search(/\w/) / 4) - 1;
		let name = line.match(/\w(?:\w|-\w)*$/)[0];
		if(level < 0) {
			return;
		}
		if(level >= current.length) {
			current[level] = name;
		} else {
			current = current.slice(0, level);
			current[level] = name;
		}
		let path = current.join('.');
		let existing = Object.assign({}, _.get(paths, path));
		_.set(paths, path, existing);
	});
	rl.on('pause', () => {
		pass.emit('end', paths);
		rl.close();
		thread.kill();
	});
}

pass.show = (path) => {
	let rl = exec(['show', path]);
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
