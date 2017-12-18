const path = require('path')
const fs = require('fs-extra')
const Q = require('q')
const log = require('electron-log')
const is = require('electron-is')

const util = require('../util/util')
const packageOrders = require('../config/packageOrders') //包优先级

/**
 * 解压资源包
 */
function unzipAll(packages, skip, firstRun) {
	var deferred = Q.defer()

	packages = packages || []
	if(skip) {
		log.debug("skip unzip packages")
		setTimeout(() => deferred.resolve(), 10)

		return deferred.promise
	}

	log.debug("unzip packages")
	var packagesPath = path.join(util.getAppPath("appResource"), "packages")
	util.readJson(path.join(packagesPath, "packages.json")).then(pkgs => {
		var list = pkgs.filter(p => {
			if(firstRun) {
				return true
			}

			if(packages.find(o => o.name == p.name && o.checksum != p.checksum)) {
				return true
			}

			return !fs.existsSync(path.join(getPackagesPath(), p.name, "package.json"))
		})

		var total = list.length
		var doUnzip = () => {
			if(list.length == 0) {
				deferred.resolve(packages)
				return
			}

			var p = list.pop()
			util.uncompress(path.join(packagesPath, p.archiveName), getPackagesPath(), true).then(() => {
				var index = packages.findIndex(o => o.name == p.name)
				if(index >= 0) {
					packages.splice(index, 1, p)
				} else {
					packages.push(p)
				}
			}, err => {

			}, progress => {
				deferred.notify({
					progress: progress,
					name: p.name,
					version: p.version,
					count: total - list.length,
					total: total,
				})
			})
			.fin(() => doUnzip())
		}

		doUnzip()
	}, err => {
		err && log.error(err)
		deferred.resolve()
	})

	return deferred.promise
}

/**
 * 解压单个资源包
 */
function unzip(packagePath) {
	var deferred = Q.defer()

	util.uncompress(packagePath, getPackagesPath(), true).then(() => {
		var name = path.basename(packagePath)
		name = name.substring(0, name.indexOf("-"))
		var ext = is.windows() ? "bat" : "sh"
		util.searchFiles(path.join(getPackagesPath(), name) + `/**/post_install.${ext}`).then(scripts => {
			if(scripts.length == 0) {
				deferred.resolve()
				return
			}

			var scriptPath = scripts[0]
			util.execCommand(`"${scriptPath}"`, {cwd: path.dirname(scriptPath)}).then(() => {
				deferred.resolve()
			}, err => {
				err && log.error(err)
				deferred.reject(err)
			})
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	}, progress => {
		deferred.notify(progress)
	})

	return deferred.promise
}

/**
 * 加载所有包
 */
function load(extra) {
	var deferred = Q.defer()
	extra = extra !== false;

	var packages = []
	var packagesPath = getPackagesPath()
	log.debug(`loadPackages: ${packagesPath}`)

	util.searchFiles(`${packagesPath}/*/package.json`).then(pathList => {
		Q.all(pathList.map(p => {
			var d = Q.defer()
			if(extra) {
				util.readJson(p).then(packageConfig => {
					packageConfig.order = packageOrders[packageConfig.name] || 0
					packageConfig.path = path.dirname(p)
					packageConfig.protocol = packagesPath.startsWith("/") ? "file://" : "file:///"
					packageConfig.boards && packageConfig.boards.forEach(board => {
						board.build && board.build.prefs && Object.keys(board.build.prefs).forEach(key => {
							board.build.prefs[key] = board.build.prefs[key].replace("PACKAGE_PATH", packageConfig.path)
						})

						if(board.upload && board.upload.command) {
							board.upload.command = board.upload.command.replace(/PACKAGE_PATH/g, packageConfig.path)
						}
					})

					packages.push(packageConfig)
				})
				.fin(() => {
					d.resolve()
				})
			} else {
				util.readJson(p).then(packageConfig => packages.push(packageConfig)).fin(() => d.resolve())
			}
			return d.promise
		}))
		.then(() => {
			deferred.resolve(packages)
		})
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function remove(name) {
	var deferred = Q.defer()

	log.debug(`deletePackage: ${name}`)
	util.removeFile(path.join(getPackagesPath(), name)).then(() => {
		deferred.resolve()
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function getPackagesPath() {
	return path.join(util.getAppPath("appDocuments"), "packages")
}

module.exports.unzip = unzip
module.exports.unzipAll = unzipAll

module.exports.load = load
module.exports.remove = remove
module.exports.getPackagesPath = getPackagesPath
