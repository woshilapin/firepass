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

export default protocol;
