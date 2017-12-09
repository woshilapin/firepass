import { spawn } from 'child_process';
import readline from 'readline';

import protocol from './protocol.js';

protocol.on('message', (input) => {
	process.env.PATH = `/usr/local/bin:${process.env.PATH}`;
	let thread = spawn('pass', ['perso/web/test']);
	let rl = readline.createInterface({
		"input": thread.stdout,
		"output": thread.stdin,
	});
	let output = {};
	rl.on('line', (line) => {
		if(!output.password) {
			output.password = line;
		} else if (line.startsWith('login:')) {
			output.login = line.replace(/line: /, '');
		}
	});
	rl.on('pause', () => {
		protocol.send(output);
		rl.close();
		thread.kill();
	});
});
