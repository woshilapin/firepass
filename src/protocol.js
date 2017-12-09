import EventEmitter from 'events';

class ProtocolEmitter extends EventEmitter {}

const protocol = new ProtocolEmitter();

protocol.send = function send(message) {
	let messageToSend = Buffer.from(JSON.stringify(message), 'utf8');
	let messageLength = Buffer.alloc(4, 0);
	messageLength.writeInt32LE(Buffer.byteLength(messageToSend), 0);
	process.stdout.write(messageLength);
	process.stdout.write(messageToSend);
}

process.stdin.on('data', (buffer) => {
	let messageLength = buffer.readInt32LE(0);
	// TODO: Check that the size of the buffer is the size of the content that has to be read (if incomplete, JSON.parse will fail)
	let message = JSON.parse(buffer.slice(4));
	protocol.emit('message', message);
});

export default protocol;
