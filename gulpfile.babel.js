import gulp from 'gulp';
import gchmod from 'gulp-chmod';
import gclean from 'gulp-clean';
import grename from 'gulp-rename';
import gsourcemaps from 'gulp-sourcemaps';
import gwebpack from 'webpack-stream';

import webpack from 'webpack';

import webpackConfig from './webpack.config.js';

export function clean() {
	return gulp.src('dist/')
		.pipe(gclean({force: true}))
		.pipe(gulp.dest('dist/'));
}
clean.description = 'Clean directory';

export function shell() {
	return gulp.src('src/firepass.sh')
		.pipe(grename('firepass'))
		.pipe(gchmod(0o755))
		.pipe(gulp.dest('dist/'));
}
shell.description = "Copy over the launcher";

export function scripts() {
	return gulp.src('src/firepass.js', {"since": gulp.lastRun(scripts)})
		.pipe(gwebpack(webpackConfig, webpack))
		.pipe(gulp.dest('dist/'));
};
scripts.description = 'Generate Javascript';

export let build = gulp.series(
	clean,
	gulp.parallel(
		shell,
		scripts
	)
);
build.description = 'Build the whole project';

export let watch = gulp.series(
	build,
	function watch() {
		webpackConfig.watch = true;
		return scripts();
	}
);
watch.description = 'Activate watch mode';

export default build;
