import path from 'path';

export default {
	"target": 'node',
	"context": path.resolve(__dirname, 'src/'),
	"entry": {
		"firepass": './firepass.js',
	},
	"output": {
		"path": path.resolve(__dirname, 'dist/'),
		"filename": '[name].js',
	},
	"module": {
		"rules": [
			{
				"test": /\.js?$/,
				"exclude": /node_modules/,
				"loader": 'babel-loader',
			},
		],
	},
	"devtool": "source-map",
};
