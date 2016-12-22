// 引入 gulp及组件
const gulp = require('gulp') //基础库
const gulpif = require('gulp-if') //条件执行
const minimist = require('minimist') //命令行参数解析
const runSequence = require('run-sequence') //顺序执行
const concat = require('gulp-concat') //合并文件
const rename = require('gulp-rename') //重命名
const clean = require('gulp-clean') //清空文件夹

const uglify = require('gulp-uglify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

const builder = require('electron-builder') //electron打包

const path = require('path') //路径
const child_process = require('child_process') //子进程
const os = require('os') //操作系统相关

var args = minimist(process.argv.slice(2)) //命令行参数

const SRC = './src/'
const DIST = './dist/'

const APP = './app/'

const ASSETS_SRC = '../edu_kenrobot/public/assets/**'
const ASSETS_DIST = APP + 'assets/'

// 清理dist
gulp.task('clean', _ => {
	return gulp.src([DIST, ASSETS_DIST], {
			read: false
		})
		.pipe(clean())
})

// 复制assets
gulp.task('copy-assets', ['clean'], _ => {
	return gulp.src(ASSETS_SRC)
		.pipe(gulp.dest(ASSETS_DIST))
})

gulp.task('pack-main', _ => {
	// return browserify('src/main/index.js')
	// 	.bundle()
	// 	.pipe(source('main.js'))
    //   	.pipe(buffer())
    //   	.pipe(uglify())
    //   	.pipe(gulp.dest(APP));
	return gulp.src(SRC + 'main/index.js')
		.pipe(concat('main.js'))
		.pipe(gulp.dest(APP))
})

gulp.task('pack-renderer', _ => {
	// return browserify('src/renderer/index.js')
	// 	.bundle()
	// 	.pipe(source('renderer.js'))
    //   	.pipe(buffer())
    //   	.pipe(uglify())
    //   	.pipe(gulp.dest(APP));
	return gulp.src(SRC + 'renderer/index.js')
		.pipe(concat('renderer.js'))
		.pipe(gulp.dest(APP))
})

gulp.task('pack', ['copy-assets', 'pack-main', 'pack-renderer'])

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