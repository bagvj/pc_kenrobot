// 引入 gulp及组件
const gulp = require('gulp'); //基础库
const gulpif = require('gulp-if'); //条件执行
const minimist = require('minimist'); //命令行参数解析
const runSequence = require('run-sequence'); //顺序执行
const concat = require('gulp-concat'); //合并文件
const rename = require('gulp-rename'); //重命名
const clean = require('gulp-clean'); //清空文件夹

const builder = require('electron-builder'); //electron打包

const path = require('path'); //路径
const child_process = require('child_process'); //子进程
const os = require('os'); //操作系统相关

var args = minimist(process.argv.slice(2)); //命令行参数

const SRC = './';
const DIST = './dist/';
const APP = 'edu_kenrobot';

gulp.task('copy', ['clean'], _ => {
	var path = args.release ? "public" : "resources";
	return gulp.src(`../${APP}/${path}/assets/**`)
		.pipe(gulp.dest(SRC + "assets/"));
});

// 清空图片、样式、js
gulp.task('clean', _ => {
	return gulp.src(DIST, {
			read: false
		})
		.pipe(clean());
});

// 默认任务
gulp.task('default', ['copy']);