import gulp from 'gulp';
import gchmod from 'gulp-chmod';
import ginsert from 'gulp-insert';
import grename from 'gulp-rename';
import gsourcemaps from 'gulp-sourcemaps';
import gwebpack from 'webpack-stream';

import del from 'del';
import webpack from 'webpack';

import webpackConfig from './webpack.config.js';

// FIXME: Need to be OS-aware (see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Native_manifests#Manifest_location)
let manifestPath = '/Users/simardj/Library/Application\ Support/Mozilla/NativeMessagingHosts/';

export function clean() {
	return del(['dist/']);
}
clean.description = 'Clean directory';

export function scripts() {
	return gulp.src('src/firepass.js', {"since": gulp.lastRun(scripts)})
		.pipe(gwebpack(webpackConfig, webpack))
		.pipe(gulp.dest('dist/'));
};
scripts.description = 'Generate Javascript';

export let build = gulp.series(
	clean,
	gulp.parallel(
		scripts
	)
);
build.description = 'Build the whole project';

function installBinary() {
	return gulp.src('dist/firepass.js')
		.pipe(grename('firepass'))
		.pipe(gchmod(0o755))
		.pipe(ginsert.prepend('#!/usr/bin/env /usr/local/bin/node\n'))
		.pipe(gulp.dest('/usr/local/bin/'));
}
function installManifest() {
	return gulp.src('firepass.json')
		.pipe(gulp.dest(manifestPath));
}
export let install = gulp.series(
	clean,
	build,
	gulp.parallel(
		installBinary,
		installManifest
	)
)
install.description = 'Install the binary';

export let watch = gulp.series(
	build,
	function watch() {
		webpackConfig.watch = true;
		return scripts();
	}
);
watch.description = 'Activate watch mode';

export default build;
