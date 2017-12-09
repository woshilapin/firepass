import protocol from './protocol.js';
import pass from './pass.js';

protocol.on('message', ({command, args}) => {
	pass[command](args);
	pass.on('end', (message) => protocol.send(message));
});
