import { spawn } from 'child_process';
import readline from 'readline';

function send(message) {
	let messageToSend = Buffer.from(JSON.stringify(message), 'utf8');
	let messageLength = Buffer.alloc(4, 0);
	messageLength.writeInt32LE(Buffer.byteLength(messageToSend), 0);
	process.stdout.write(messageLength);
	process.stdout.write(messageToSend);
}
process.stdin.on('data', (buffer) => {
	let messageReceivedLength = buffer.readInt32LE(0);
	// TODO: Check that the size of the buffer is the size of the content that has to be read (if incomplete, JSON.parse will fail)
	let messageReceived = JSON.parse(buffer.slice(4));
	process.env.PATH = `/usr/local/bin:${process.env.PATH}`;
	let thread = spawn('pass', ['perso/web/test']);
	let rl = readline.createInterface({
		"input": thread.stdout,
		"output": thread.stdin,
	});
	let message = {};
	rl.on('line', (line) => {
		if(!message.password) {
			message.password = line;
		} else if (line.startsWith('login:')) {
			message.login = line.replace(/line: /, '');
		}
	});
	rl.on('pause', () => {
		send(message);
		rl.close();
		thread.kill();
	});
});
