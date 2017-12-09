import protocol from './protocol.js';
import pass from './pass.js';

protocol.on('message', (args) => {
	pass.password(args);
	pass.on('end', (message) => protocol.send(message));
});
