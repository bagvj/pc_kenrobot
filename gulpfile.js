/**
 * 引入 gulp及组件
 * npm install --save-dev gulp gulp-if gulp-ruby-sass gulp-clean-css gulp-autoprefixer gulp-requirejs-optimize gulp-minify-html fs-extra minimist run-sequence electron@1.4.15 electron-builder gulp-sftp q hasha nconf globby isutf8 gulp-babel babel-preset-es2015 del
 * npm install --save electron-debug electron-is electron-log fs-extra minimist q glob 7zip-bin sudo-prompt hasha bufferhelper iconv-lite serialport
 */

const gulp = require('gulp') //基础库
const gulpif = require('gulp-if') //条件执行
const sass = require('gulp-ruby-sass') //css预编译
const cleanCSS = require('gulp-clean-css') //css压缩
const autoprefixer = require('gulp-autoprefixer') //自动前缀
const requirejsOptimize = require('gulp-requirejs-optimize') //requirejs打包
const minifyHtml = require("gulp-minify-html") //html压缩
const sftp = require('gulp-sftp') //
const Q = require('q')
const fs = require('fs-extra')
const globby = require('globby')
const isutf8 = require('isutf8')
const nconf = require('nconf')
const del = require('del')
const babel = require('gulp-babel')

const minimist = require('minimist') //命令行参数解析
const runSequence = require('run-sequence') //顺序执行
const hasha = require('hasha') //

const builder = require('electron-builder') //electron打包

const path = require('path') //路径
const child_process = require('child_process') //子进程
const os = require('os') //操作系统相关

var args = minimist(process.argv.slice(2)) //命令行参数

const SRC = './src/'
const DIST = './dist/'
const TEMP = '.temp/'

const APP = './app/'

const ASSETS_SRC = SRC + 'assets/'
const ASSETS_DIST = APP + 'assets/'

gulp.task('clean-assets-js', _ => {
	return del(ASSETS_DIST + 'js')
})

gulp.task('clean-assets-css', _ => {
	return del(ASSETS_DIST + 'css')
})

gulp.task('clean-assets-image', _ => {
	return del(ASSETS_DIST + 'image')
})

gulp.task('clean-assets-font', _ => {
	return del(ASSETS_DIST + 'font')
})

gulp.task('clean-main', _ => {
	return del(APP + 'main')
})

gulp.task('clean-renderer', _ => {
	return del(APP + 'renderer')
})

gulp.task('clean-scratch', _ => {
	return del(APP + 'scratch')
})

gulp.task('clean-views', _ => {
	return del(ASSETS_DIST + '*.html')
})

gulp.task('clean-dist', _ => {
	return del(DIST)
})

gulp.task('clean-assets-temp-js', _ => {
	return del(TEMP + 'js')
})

gulp.task('transform-assets-js', ['clean-assets-temp-js'], callback => {
	if(!args.force && !args.release) {
		callback()
		return
	}

	return gulp.src([ASSETS_SRC + 'js/**/*.js', '!' + ASSETS_SRC + 'js/require.js', '!' + ASSETS_SRC + 'js/vendor/**/*'])
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest(TEMP + 'js'))
})

gulp.task('copy-assets-vendor-js', ['clean-assets-temp-js'], callback => {
	if(!args.force && !args.release) {
		callback()
		return
	}

	return gulp.src([ASSETS_SRC + 'js/vendor/**/*'])
		.pipe(gulp.dest(TEMP + 'js/vendor/'))
})

gulp.task('pack-assets-js', ['clean-assets-js', 'transform-assets-js', 'copy-assets-vendor-js'], _ => {
	if(args.release) {
		gulp.src([ASSETS_SRC + 'js/require.js'])
			.pipe(gulp.dest(ASSETS_DIST + 'js/'))
	
		return gulp.src(TEMP + 'js/*.js')
			.pipe(requirejsOptimize({
				useStrict: true,
				optimize: "uglify",
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
	return gulp.src(SRC + 'main/**/*.js')
		.pipe(gulp.dest(APP + 'main/'))
})

gulp.task('pack-renderer', ['clean-renderer'], cb => {
	return gulp.src(SRC + 'renderer/**/*.js')
			.pipe(gulp.dest(APP + 'renderer/'))
})

gulp.task('pack-views', ['clean-views'], _ => {
	return gulp.src(SRC + 'views/**.html')
		.pipe(gulpif(args.release, minifyHtml()))
		.pipe(gulp.dest(APP))
})

gulp.task('pack-scratch', ['clean-scratch'], callback => {
	return gulp.src([SRC + 'scratch/**/*'])
		.pipe(gulp.dest(APP + 'scratch/'))
})

gulp.task('pack', ['pack-views', 'pack-main', 'pack-renderer', 'pack-scratch', 'pack-assets'])

/**
 * 用法: gulp build-pack --release --platform=PLATFORM --arch=ARCH --target=TARGET --branch=BRANCH --packages=XXX,YYY --feature=FEATURE
 * 示例: gulp build-pack --release --branch=beta
 *       gulp build-pack --release --platform=win --arch=x64 --target=nsis --branch=beta
 *       gulp build-pack --release --platform=win --arch=x64 --target=nsis --branch=beta --packages=Intel --feature=with-101
 */
gulp.task('build', ['packages', 'clean-dist'], callback => {
	var platform = args.platform || "win"
	var branch = args.branch || "release"
	var feature = args.feature || ""
	var arch
	var target
	var ext

	var targets
	if(platform == "linux") {
		arch = args.arch || "ia32"
		target = args.target || "AppImage"
		ext = target
		targets = builder.Platform.LINUX.createTarget(target, builder.archFromString(arch))
	} else if(platform == "arm") {
		arch = builder.Arch.armv7l.toString()
		target = args.target || "dir"
		ext = target
		targets = builder.Platform.LINUX.createTarget(target, builder.archFromString(arch))
	} else if(platform == "mac") {
		target = args.target || "dmg"
		ext = target
		targets = builder.Platform.MAC.createTarget(target)
	} else {
		arch = args.arch || "ia32"
		target = args.target || "nsis"
		ext = "exe"
		targets = builder.Platform.WINDOWS.createTarget(target, builder.archFromString(arch))
	}

	nconf.file('./app/package.json')
	nconf.set('buildInfo', {
		branch: branch,
		feature: feature,
		ext: ext,
	})
	nconf.save()
	
	builder.build({
		targets: targets,
		config: {
			extraFiles: [
      			`arduino-${platform}`,
      			"scripts",
      			`!scripts/**/*.${platform == "win" ? "sh" : "bat"}`,
      			"examples",
      			"packages/packages.json",
      			`packages/*${platform}.7z`,
    		],
		}
	}).then(result => {
		var output = result[0]
		var packageConfig = require('./app/package')
		var name = `${packageConfig.name}-${packageConfig.version}-${branch}${feature ? ("-" + feature) : ""}${arch ? ("-" + arch) : ""}${path.extname(output)}`
		var file = path.join(path.dirname(output), name)

		fs.move(output, file, err => {
			nconf.clear('buildInfo')
			nconf.save()
			
			console.log(file)
			if(!args.upload) {
				callback()
				return
			}

			var options = args.remotePath ? {remotePath: args.remotePath} : {}
			upload(file, options).then(_ => {
				callback()
			}, err1 => {
				console.error(err1)
				callback(err1)
			})
		})		
	}, err => {
		console.error(err)
		callback(err)
	})
})

gulp.task('build-pack', ['pack', 'build'])

// 默认任务
gulp.task('default', ['pack'])

//检查文件编码是否为utf8
gulp.task('check', callback => {
	globby(["./src/**/*.js", "./src/**/*.json", "./src/**/*.html", "./src/**/*.scss"]).then(files => {
		var result = []
		files.forEach(file => {
			if(!isutf8(fs.readFileSync(file))) {
				result.push(file)
			}
		})
		if(result.length > 0) {
			console.log('these files not encoding by utf8')
			console.log(result.join("\n"))
		} else {
			console.log('all files encoding by utf8')
		}
		callback()
	}, err => {
		callback(err)
	})
})

gulp.task('packages', callback => {
	var packageNames = args.packages ? args.packages.split(',') : []

	var reg = /([^-]+)-v(\d\.\d+\.\d+)-([^\.]+)\.7z/g
	var packages = []

	var platform = args.platform || "win"
	globby.sync(`packages/*${platform}.7z`).forEach(p => {
		var name = path.basename(p)
		reg.lastIndex = 0
		var match = reg.exec(name)
		if(!packageNames.includes(match[1])) {
			return
		}

		packages.push({
			name: match[1],
			version: match[2],
			platform: match[3],
			archiveName: name,
			checksum: "sha256:" + hasha.fromFileSync(p, {algorithm: "sha256"}),
		})
	})
	fs.writeJsonSync("packages/packages.json", packages)

	callback()
})

gulp.task('upload', _ => {
	if(!args.file) {
		console.log('please spec file use "--file"')
		return
	}
	
	var files = args.file.split(',')
	var options = args.remotePath ? {remotePath: args.remotePath} : {}

	return upload(files, options)
})

function upload(files, options) {
	var defer = Q.defer()

	var defaultOptions = require('./build/upload')
	options = Object.assign(defaultOptions, options)

	gulp.src(files)
		.pipe(sftp(options))
		.on('end', defer.resolve)
		.on('error', defer.reject)

	return defer.promise
}