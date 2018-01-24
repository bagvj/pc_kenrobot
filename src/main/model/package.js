import path from 'path'
import fs from 'fs-extra'
import Q from 'q'
import log from 'electron-log'
import is from 'electron-is'
import _ from 'lodash'

import util from '../util/util'
import packageOrders from '../config/packageOrders' //包优先级
import Url from '../config/url'

/**
 * 解压资源包
 */
function unzipAll(packages, skip, firstRun) {
	let deferred = Q.defer()

	packages = packages || []
	if(skip) {
		log.debug("skip unzip packages")
		setTimeout(() => deferred.resolve(), 10)

		return deferred.promise
	}

	log.debug("unzip packages")
	let packagesPath = path.join(util.getAppPath("appResource"), "packages")
	util.readJson(path.join(packagesPath, "packages.json")).then(pkgs => {
		let list = pkgs.filter(p => {
			if(firstRun) {
				return true
			}

			if(packages.find(o => o.name === p.name && o.checksum !== p.checksum)) {
				return true
			}

			return !fs.existsSync(path.join(util.getAppPath("packages"), p.name, "package.json"))
		})

		let total = list.length
		let doUnzip = () => {
			if(list.length === 0) {
				deferred.resolve(packages)
				return
			}

			let p = list.pop()
			util.uncompress(path.join(packagesPath, p.archiveName), util.getAppPath("packages"), true).then(() => {
				let index = packages.findIndex(o => o.name === p.name)
				if(index >= 0) {
					packages.splice(index, 1, p)
				} else {
					packages.push(p)
				}
			}, () => {

			}, progress => {
				deferred.notify({
					progress,
					name: p.name,
					version: p.version,
					count: total - list.length,
					total,
				})
			})
			.fin(() => doUnzip())
		}

		doUnzip()
	}, err => {
		err && log.info(err)
		deferred.resolve()
	})

	return deferred.promise
}

/**
 * 解压单个资源包
 */
function unzip(name, packagePath, removeOld) {
	let deferred = Q.defer()
	removeOld = removeOld !== false

	let doUnzip = () => {
		util.uncompress(packagePath, util.getAppPath("packages"), true).then(() => {
			let packageName = path.basename(packagePath)
			packageName = packageName.substring(0, packageName.indexOf("-"))
			let ext = is.windows() ? "bat" : "sh"
			util.searchFiles(`${path.join(util.getAppPath("packages"), packageName)}/**/post_install.${ext}`).then(scripts => {
				if(scripts.length === 0) {
					deferred.resolve()
					return
				}

				let scriptPath = scripts[0]
				util.execCommand(`"${scriptPath}"`, {cwd: path.dirname(scriptPath)}).then(() => {
					deferred.resolve()
				}, err => {
					err && log.info(err)
					deferred.reject(err)
				})
			}, err => {
				err && log.info(err)
				deferred.reject(err)
			})
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		}, progress => {
			deferred.notify(progress)
		})
	}

	if(removeOld) {
		remove(name).then(() => doUnzip(), err => {
			err && log.info(err)
			deferred.reject(err)
		})
	} else {
		doUnzip()
	}

	return deferred.promise
}

/**
 * 加载所有包
 */
function loadAll(extra) {
	let deferred = Q.defer()
	extra = extra !== false;

	let packages = []
	let pattern = [
		`${util.getAppPath("appResource")}/packages/*/package.json`,
		`${util.getAppPath("packages")}/*/package.json`,
	]
	log.debug(`loadPackages: ${pattern.join(',')}`)

	util.searchFiles(pattern, {absolute: true}).then(pathList => {
		Q.all(pathList.map(p => {
			let d = Q.defer()
			if(extra) {
				util.readJson(p).then(packageConfig => {
					if(packageOrders[packageConfig.name]) {
						packageConfig.order = packageOrders[packageConfig.name]
					}
					if(packageConfig.name === packageOrders.standardPackage) {
						packageConfig.builtIn = true
					}

					packageConfig.path = path.dirname(p).replace(/\\/g, '/')
					packageConfig.protocol = p.startsWith("/") ? "file://" : "file:///"
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
				util.readJson(p).then(packageConfig => {
					packageConfig.path = path.dirname(p).replace(/\\/g, '/')
					packages.push(packageConfig)
				}).fin(() => d.resolve())
			}
			return d.promise
		}))
		.then(() => {
			deferred.resolve(_.sortBy(packages, ["builtIn", "order", "name"], ["asc", "asc", "asc"]))
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function loadRemote() {
	let deferred = Q.defer()

	let appInfo = util.getAppInfo()
	util.request(Url.PACKAGE).then(result => {
		let packages = result.filter(p => p.platform === appInfo.platform)
		packages.forEach(packageConfig => {
			if(packageOrders[packageConfig.name]) {
				packageConfig.order = packageOrders[packageConfig.name]
			}
			if(packageConfig.name === packageOrders.standardPackage) {
				packageConfig.builtIn = true
			}
		})
		deferred.resolve(_.sortBy(packages, ["builtIn", "order", "name"], ["asc", "asc", "asc"]))
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function remove(name) {
	let deferred = Q.defer()

	log.debug(`deletePackage: ${name}`)
	util.removeFile(path.join(util.getAppPath("packages"), name)).then(() => {
		deferred.resolve()
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function loadExamples() {
	let deferred = Q.defer()

	let examples = []
	let pattern = [
		`${util.getAppPath("appResource")}/packages/*/examples/examples.json`,
		`${util.getAppPath("packages")}/*/examples/examples.json`,
	]

	log.debug(`loadExamples: ${pattern.join(',')}`)

	util.searchFiles(pattern, {absolute: true}).then(files => {
		Q.all(files.map(p => {
			let d = Q.defer()
			util.readJson(p).then(exampleConfig => {
				if(packageOrders[exampleConfig.package]) {
					exampleConfig.order = packageOrders[exampleConfig.package]
				}
				if(exampleConfig.package === packageOrders.standardPackage) {
					exampleConfig.builtIn = true
				}
				exampleConfig.examples.forEach(e => {
					e.path = path.join(path.dirname(p).replace(/\\/g, '/'), e.category, e.name)
				})
				examples.push(exampleConfig)
			}).fin(() => d.resolve())

			return d.promise
		}))
		.then(() => {
			deferred.resolve(_.sortBy(examples, ["builtIn", "order", "name"], ["asc", "asc", "asc"]))
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

module.exports.unzip = unzip
module.exports.unzipAll = unzipAll

module.exports.loadAll = loadAll
module.exports.loadRemote = loadRemote
module.exports.remove = remove

module.exports.loadExamples = loadExamples
