import path from 'path'
import os from 'os'
import child_process from 'child_process'
import asar from 'asar'
import is from 'electron-is'
import fs from 'fs-extra'
import * as builder from 'electron-builder' //electron打包
import minimist from 'minimist' //命令行参数解析
import globby from 'globby'
import hasha from 'hasha'
import nconf from 'nconf'
import {path7za} from '7zip-bin'
import Q from 'q'

let args = minimist(process.argv.slice(2)) //命令行参数

computePackages()
packApp()

function packApp() {
	let platform = args.platform || "win"
	let branch = args.branch || "release"
	let feature = args.feature || ""
	let arch
	let target
	let ext

	let packagePath = path.resolve(__dirname, '../../app/package.json')
	let packageConfig = fs.readJsonSync(packagePath)

	var targets
	if (platform == "linux") {
		arch = args.arch || "ia32"
		target = args.target || "AppImage"
		ext = target
		targets = builder.Platform.LINUX.createTarget(target, builder.archFromString(arch))
	} else if (platform == "arm") {
		arch = args.arch || "armv7l"
		target = args.target || "dir"
		ext = target
		targets = builder.Platform.LINUX.createTarget(target, builder.archFromString(arch))
	} else if (platform == "mac") {
		target = args.target || "dmg"
		ext = target
		targets = builder.Platform.MAC.createTarget(target)
	} else {
		arch = args.arch || "ia32"
		target = args.target || "nsis"
		ext = "exe"
		targets = builder.Platform.WINDOWS.createTarget(target, builder.archFromString(arch))
	}

	nconf.file(packagePath)
	nconf.set('buildInfo', {
		branch: branch,
		feature: feature,
		ext: ext,
		appBit: arch == "ia32" ? 32 : 64,
		date: parseInt(new Date().getTime() / 1000),
	})
	nconf.save()

	let packageNames = args.packages ? args.packages.split(',') : []
	let standardPackage = args.standardPackage || "Arduino"

	if (args.standalone) {
		let extraFiles = [
			`./data/arduino-${platform}/**/*`,
			"./data/scripts/**/*",
			`!./data/scripts/**/*.${platform == "win" ? "sh" : "bat"}`,
			"./data/examples/**/*",
			"./data/libraries/libraries.json",
			"./data/packages/packages.json",
			"./data/packages/${standardPackage}/**/*",
		]

		packageNames.length > 0 && extraFiles.push(`./data/packages/@(${packageNames.join('|')})*${platform}.7z`)

		let dist = path.join(DIST, `${platform}-${arch}-dir`)
		let taskA = () => {
			let defer = Q.defer()
			gulp.src(extraFiles, {
					base: "."
				})
				.pipe(gulp.dest(dist))
				.on('end', () => {
					defer.resolve()
				})
				.on('error', err => {
					defer.reject(err)
				})

			return defer.promise
		}

		let distApp = path.join(dist, 'resources', 'app')

		let taskB = () => {
			let defer = Q.defer()

			gulp.src([
					APP + '**/*',
					"!" + APP + "node_modules/serialport/build/Release/obj",
					"!" + APP + "node_modules/serialport/build/Release/obj/**/*",
					"!" + APP + "node_modules/**/test",
					"!" + APP + "node_modules/**/test/**/*",
					"!" + APP + "node_modules/**/tests",
					"!" + APP + "node_modules/**/tests/**/*",
					"!" + APP + "node_modules/**/example",
					"!" + APP + "node_modules/**/example/**/*",
					"!" + APP + "node_modules/**/examples",
					"!" + APP + "node_modules/**/examples/**/*",
					"!" + APP + "node_modules/**/docs",
					"!" + APP + "node_modules/**/docs/**/*",
					"!" + APP + "node_modules/**/doc",
					"!" + APP + "node_modules/**/doc/**/*",
					"!" + APP + "node_modules/**/*.md",
					"!" + APP + "node_modules/**/*.d.ts",
					"!" + APP + "node_modules/**/*appveyor.yml*",
					"!" + APP + "node_modules/**/.*",
				]).pipe(gulp.dest(distApp))
				.on('end', () => {
					defer.resolve()
				})
				.on('error', err => {
					defer.reject(err)
				})

			return defer.promise
		}

		let taskC = () => {
			let defer = Q.defer()

			nconf.clear('buildInfo')
			nconf.save()

			asar.createPackageWithOptions(distApp, path.join(path.dirname(distApp), "app.asar"), {
				unpackDir: `node_modules/7zip-bin-${platform}`,
			}, () => {
				fs.removeSync(distApp)
				defer.resolve()
			})

			return defer.promise
		}

		let taskD = () => {
			var defer = Q.defer()

			if (!args.compress) {
				setTimeout(() => {
					defer.resolve()
				}, 10)

				return defer.promise
			}

			let name = `${packageConfig.productName}-${packageConfig.version}-${branch}${feature ? ("-" + feature) : ""}${arch ? ("-" + arch) : ""}-${platform}-standalone`
			let command = `cd "${path.resolve(path.dirname(dist))}" && "${path7za}" a ${name}.7z ${path.basename(dist)}/*`
			child_process.exec(command, (err, stdout, stderr) => {
				if (err) {
					console.log(err)
					defer.reject(err)
					return
				}

				console.log(stdout)
				defer.resolve()
			})

			return defer.promise
		}

		taskA().then(taskB).then(taskC).then(taskD).catch(err => {
			console.log(err)
		}).done(() => {
			console.log("done")
		})
	} else {
		let extraFiles = [
			`data/arduino-${platform}`,
			"data/scripts",
			`!data/scripts/**/*.${platform == "win" ? "sh" : "bat"}`,
			"data/examples",
			"data/libraries/libraries.json",
			"data/packages/packages.json",
			`data/packages/${standardPackage}`
		]

		packageNames.length > 0 && extraFiles.push(`data/packages/@(${packageNames.join('|')})*${platform}.7z`)

		builder.build({
			targets: targets,
			config: {
				extraFiles: extraFiles,
				win: args.sign ? {
					certificateSubjectName: "911101083484411499",
					certificateSha1: "CF853B3F7C8B5FFE9C40D48025EB348BBE360914",
				}: undefined
			},
			appInfo: {
				buildNumber: packageConfig.buildNumber,
				companyName: packageConfig.companyName,
			}
		}).then(result => {
			nconf.clear('buildInfo')
			nconf.save()

			let output = result[result.length - 1]
			let name = `${packageConfig.productName}-${packageConfig.version}-${branch}${feature ? ("-" + feature) : ""}${arch ? ("-" + arch) : ""}${path.extname(output)}`
			let newPath = path.join(path.dirname(output), name)

      fs.moveSync(output, newPath, {overwrite: true})
      console.log(newPath)
			console.log("done")
		}, err => {
			console.error(err)
		})
	}
}

function computePackages() {
	let packagesDir = path.resolve(__dirname, "../../data/packages")
	let packageNames = args.packages ? args.packages.split(',') : []

	let reg = /([^-]+)-v(\d\.\d+\.\d+)-([^\.]+)\.7z/g
	let packages = []

	let platform = args.platform || "win"
	globby.sync(`${packagesDir}/*${platform}.7z`).forEach(p => {
		let name = path.basename(p)
		reg.lastIndex = 0
		let match = reg.exec(name)
		if (!packageNames.includes(match[1])) {
			return
		}

		packages.push({
			name: match[1],
			version: match[2],
			platform: match[3],
			archiveName: name,
			checksum: "sha256:" + hasha.fromFileSync(p, {
				algorithm: "sha256"
			}),
		})
	})

	fs.writeJsonSync(`${packagesDir}/packages.json`, packages)
}
