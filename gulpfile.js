/**
 * 引入 gulp及组件
 * npm install --save-dev gulp gulp-if gulp-concat gulp-rename gulp-clean gulp-ruby-sass gulp-clean-css gulp-autoprefixer gulp-requirejs-optimize gulp-uglify gulp-minify-html minimist run-sequence electron electron-builder getmac md5 gulp-sftp
 * npm install --save electron-debug electron-is electron-log fs-extra getmac md5 minimist q
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
const sftp = require('gulp-sftp') //

const minimist = require('minimist') //命令行参数解析
const runSequence = require('run-sequence') //顺序执行
const getmac = require('getmac') //获取mac地址
const md5 = require('md5') //

const builder = require('electron-builder') //electron打包

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
	return gulp.src(APP + 'main', {read: false})
		.pipe(clean())
})

gulp.task('clean-renderer', _ => {
	return gulp.src(APP + 'renderer', {read: false})
		.pipe(clean())
})

gulp.task('clean-views', _ => {
	return gulp.src(ASSETS_DIST + '*.html', {read: false})
		.pipe(clean())
})

gulp.task('clean-config', _ => {
	return gulp.src(ASSETS_DIST + '*.yml', {read: false})
		.pipe(clean())
})

gulp.task('clean-dist', _ => {
	return gulp.src(DIST, {read: false})
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
	return sass(ASSETS_SRC + 'css/*.scss', {style: "expanded"})
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
	return gulp.src(SRC + 'main/**/*')
		.pipe(gulp.dest(APP + 'main/'))
})

gulp.task('pack-renderer', ['clean-renderer'], _ => {
	return gulp.src(SRC + 'renderer/**/*')
		.pipe(gulp.dest(APP + 'renderer/'))
})

gulp.task('pack-views', ['clean-views'], _ => {
	return gulp.src(SRC + 'views/**.html')
		.pipe(gulp.dest(APP))
})

gulp.task('pack-config', ['clean-config'], _ => {
	return gulp.src([SRC + '/app-update.yml'])
		.pipe(gulp.dest(APP))
})

gulp.task('pack', ['pack-views', 'pack-main', 'pack-renderer', 'pack-assets'])

gulp.task('build', ['clean-dist'], callback => {
	var platform = args.platform || "win"
	var targets
	if(platform == "linux") {
		targets = builder.Platform.LINUX.createTarget(args.target || "AppImage", builder.archFromString(args.arch || "ia32"))
	} else if(platform == "arm") {
		targets = builder.Platform.LINUX.createTarget(args.target || "dir", builder.Arch.armv7l)
	} else if(platform == "mac") {
		targets = builder.Platform.MAC.createTarget(args.target || "dmg", builder.archFromString(args.arch || "ia32"))
	} else {
		targets = builder.Platform.WINDOWS.createTarget(args.target || "dir", builder.archFromString(args.arch || "ia32"))
	}

	builder.build({
		targets: targets,
		config: {
			extraFiles: [
      			`arduino-${platform}`,
      			"scripts"
    		],
		}
	}).then(result => {
		console.dir(result)
		if(!args.upload) {
			callback()
			return
		}
		
		var upload = require('./build/upload')
		gulp.src(result)
			.pipe(sftp(upload))
	}, err => {
		console.error(err)
		callback(err)
	})
})

gulp.task('build-pack', ['pack', 'build'])

// 默认任务
gulp.task('default', ['pack'])

gulp.task('clean-bin', _ => {
	return gulp.src('./build/bin', {read: false})
		.pipe(clean())
})

gulp.task('pre-build', ['clean-bin'], _ => {
	var platform = args.platform || "win"
	if(platform == "linux") {
		console.log("not support")
	} else if(platform == "arm") {
		console.log("not support")
	} else if(platform == "mac") {
		return gulp.src('./dist/mac/kenrobot.app/**/*')
			.pipe(gulp.dest('./build/bin'))
	} else {
		return gulp.src('./dist/win-ia32-unpacked/**/*')
			.pipe(gulp.dest('./build/bin'))
	}
})

gulp.task('mac', _ => {
	getmac.getMac((err, mac) => {
		if(err) {
			console.log(err)
			return
		}

		console.log(mac)
	})
})

gulp.task('e-mac', _ => {
	if(!args.mac) {
		console.log('please spec mac use "--mac"')
		return
	}

	var macs = args.mac.split(",")
	macs.map(mac => mac.replace(/-/g, ":").trim().toUpperCase()).forEach(mac => console.log(`${mac} => ${md5(mac)}`))
})
