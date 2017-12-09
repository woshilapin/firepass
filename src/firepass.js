import protocol from './protocol.js';
import pass from './pass.js';

protocol.on('message', ({command, args}) => {
	if(command === 'show') {
		pass.show(args.path);
	}
	pass.on('end', (message) => protocol.send(message));
});
