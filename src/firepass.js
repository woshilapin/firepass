import protocol from './protocol.js';
import pass from './pass.js';

protocol.on('message', (input) => {
	pass.exec(['perso/web/test']);
	pass.on('end', (output) => protocol.send(output));
});
