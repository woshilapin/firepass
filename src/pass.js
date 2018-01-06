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
	let paths = [];
	rl.on('line', (line) => {
		let level = Math.floor(line.search(/\w/) / 4) - 1;
		let name = line.match(/\w(?:\w|-\w)*$/)[0];
		if(level < 0) {
			return;
		}
		if(level < current.length) {
			current = current.slice(0, level);
		}
		current[level] = name;
		paths.push(Array.from(current));
	});
	rl.on('pause', () => {
		let insertPath = (logins, path) => {
			if(path.length < 1) {
				return;
			}
			let name = path[0];
			if(path.length === 1) { // It is file
				logins.push({
					"type": 'file',
					name,
				});
			} else { // It is a folder
				let find = logins.find((f) => f.name === name);
				if(find !== undefined && find.type === 'file') { // Transform the find into a folder
					find.type = 'folder';
					find.files = [];
				} else if(find === undefined) {
					find = {
						"type": 'folder',
						name,
						files: [],
					}
				}
				insertPath(find.files, path.slice(1));
			}
		}
		let logins = [];
		for(let path of paths) {
			insertPath(logins, path);
		}
		/*
		for(let path of paths) {
			let current = logins;
			for(let [i, folder] of path.entries()) {
				let isFile = (i === path.length - 1);
				if(isFile) {
					current.push({
						"type": 'file',
						"name": folder,
					});
				} else {
					let find = current.find((f) => f.name === folder);
					if(find !== undefined) {
						if(find.type === 'file') {
							find.type = 'folder';
							find.files = [];
						}
						current = find.files;
					} else {
						let newFolder = {
							"type": 'folder',
							"name": folder,
							"files": [],
						};
						current.push(newFolder);
						current = newFolder.files;
					}
				}
			}
		}
		*/
		pass.emit('end', logins);
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
