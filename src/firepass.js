import protocol from './protocol.js';
import pass from './pass.js';

protocol.on('message', (args) => {
	pass.exec(args);
	pass.on('end', (message) => protocol.send(message));
});
