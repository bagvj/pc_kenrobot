/**
 * 引入 gulp及组件
 * npm install --save-dev gulp gulp-if gulp-concat gulp-clean gulp-ruby-sass gulp-clean-css gulp-autoprefixer gulp-requirejs-optimize gulp-uglify gulp-minify-html minimist run-sequence electron-builder browserify vinyl-source-stream vinyl-buffer
 */

const gulp = require('gulp') //基础库
const gulpif = require('gulp-if') //条件执行
const concat = require('gulp-concat') //合并文件
const rename = require('gulp-rename') //重命名
const clean = require('gulp-clean') //清空文件夹
const sass = require('gulp-ruby-sass') //css预编译
const cleanCSS = require('gulp-clean-css') //css压缩
const autoprefixer = require('gulp-autoprefixer') //自动前缀
const requirejsOptimize = require('gulp-requirejs-optimize') //requirejs打包
const uglify = require('gulp-uglify') //js压缩
const minifyHtml = require("gulp-minify-html") //html压缩

const minimist = require('minimist') //命令行参数解析
const runSequence = require('run-sequence') //顺序执行

const builder = require('electron-builder') //electron打包

const browserify = require('browserify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

const path = require('path') //路径
const child_process = require('child_process') //子进程
const os = require('os') //操作系统相关

var args = minimist(process.argv.slice(2)) //命令行参数

const SRC = './src/'
const DIST = './dist/'

const APP = './app/'

const ASSETS_SRC = SRC + 'assets/'
const ASSETS_DIST = APP + 'assets/'

gulp.task('clean-assets-js', _ => {
	return gulp.src(ASSETS_DIST + 'js', {read: false})
		.pipe(clean())
})

gulp.task('clean-assets-css', _ => {
	return gulp.src(ASSETS_DIST + 'css', {read: false})
		.pipe(clean())
})

gulp.task('clean-assets-image', _ => {
	return gulp.src(ASSETS_DIST + 'image', {read: false})
		.pipe(clean())
})

gulp.task('clean-assets-font', _ => {
	return gulp.src(ASSETS_DIST + 'font', {read: false})
		.pipe(clean())
})

gulp.task('clean-main', _ => {
	return gulp.src(APP + 'main.js', {read: false})
		.pipe(clean())
})

gulp.task('clean-renderer', _ => {
	return gulp.src(APP + 'renderer.js', {read: false})
		.pipe(clean())
})

gulp.task('clean-views', _ => {
	return gulp.src(ASSETS_DIST + '*.html', {read: false})
		.pipe(clean())
})

gulp.task('pack-assets-js', ['clean-assets-js'], _ => {
	if(args.release) {
		gulp.src([ASSETS_SRC + 'js/require.js'])
			.pipe(gulp.dest(ASSETS_DIST + 'js/'))
			
		return gulp.src(ASSETS_SRC + 'js/index.js')
			.pipe(requirejsOptimize({
				useStrict: true,
				optimize: args.min == 'false' ? "none" : "uglify",
			}))
			.pipe(gulp.dest(ASSETS_DIST + 'js/'))
	} else {
		return gulp.src(ASSETS_SRC + 'js/**/*.js')
			.pipe(gulp.dest(ASSETS_DIST + 'js/'))
	}
})

gulp.task('pack-assets-css', ['clean-assets-css'], _ => {
	return sass(ASSETS_SRC + 'css/*.scss', {style: 'expanded'})
		.pipe(autoprefixer())
		.pipe(gulpif(args.release, cleanCSS()))
		.pipe(gulp.dest(ASSETS_DIST + 'css/'))
})

gulp.task('pack-assets-image', ['clean-assets-image'], _ => {
	return gulp.src(ASSETS_SRC + 'image/**/*')
		.pipe(gulp.dest(ASSETS_DIST + 'image/'))
})

gulp.task('pack-assets-font', ['clean-assets-font'], _ => {
	return gulp.src(ASSETS_SRC + 'font/**/*')
		.pipe(gulp.dest(ASSETS_DIST + 'font/'))
})

gulp.task('pack-assets', ['pack-assets-image', 'pack-assets-font', 'pack-assets-css', 'pack-assets-js'])

gulp.task('pack-main', ['clean-main'], _ => {
	return gulp.src(SRC + 'main/index.js')
		.pipe(rename('main.js'))
		.pipe(gulp.dest(APP))
})

gulp.task('pack-renderer', ['clean-renderer'], _ => {
	return gulp.src(SRC + 'renderer/index.js')
		.pipe(rename('renderer.js'))
		.pipe(gulp.dest(APP))
})

gulp.task('pack-views', ['clean-views'], _ => {
	return gulp.src(SRC + 'views/**.html')
		// .pipe(gulpif(args.release, minifyHtml()))
		.pipe(gulp.dest(APP))
})

gulp.task('pack', ['pack-views', 'pack-main', 'pack-renderer', 'pack-assets'])

gulp.task('build', ['pack'], _ => {
	builder.build({
		targets: builder.Platform.WINDOWS.createTarget(args.target || "dir", builder.archFromString(args.arch || "ia32")),
		devMetadata: {
			asar: args.release == true,
		}
	}).then(result => {
		console.dir(result)
	}).catch(err => {
		console.error(err)
	})
})

// 默认任务
gulp.task('default', ['pack'])