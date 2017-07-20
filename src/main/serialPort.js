const path = require('path')
const log = require('electron-log')
const Q = require('q')

const SerialPort = require('serialport') //串口

var connectedPorts = {
	autoPortId: 0,
	ports: {}
}

/**
 * 查询串口
 */
function listSerialPort() {
	var deferred = Q.defer()

	log.debug("listSerialPort")
	SerialPort.list((err, ports) => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		if(ports.length == 0) {
			deferred.reject()
			return
		}

		deferred.resolve(ports)
	})

	return deferred.promise
}

/**
 * 打开串口
 * @param {*} comName 串口路径
 * @param {*} options 选项
 * @param {*} callbacks 回调
 */
function openSerialPort(comName, options, callbacks) {
	var deferred = Q.defer()

	log.debug(`openSerialPort: ${comName}, options: ${JSON.stringify(options)}`)
	options.autoOpen = false
	if(options.parser == "raw") {
		options.parser = SerialPort.parsers.raw
	} else {
		var type = Object.prototype.toString.call(options.parser)
		if(type == "[object String]") {
			var newline = options.parser.replace("NL", '\n').replace("CR", '\r')
			options.parser = SerialPort.parsers.readline(newline)
		} else if(type == "[object Array]") {
			options.parser = SerialPort.parsers.byteDelimiter(options.parser)
		}
	}

	var port = new SerialPort(comName, options)
	port.open(err => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		var portId = ++connectedPorts.autoPortId
		connectedPorts.ports[portId] = port

		port.on('error', err => {
			callbacks && callbacks.onError && callbacks.onError(portId, err)
		})
		.on('close', _ => {
			delete connectedPorts.ports[portId]
			callbacks && callbacks.onClose && callbacks.onClose(portId)
		})
		.on('data', data => {
			callbacks && callbacks.onData && callbacks.onData(portId, data)
		})

		port.flush(_ => {
			deferred.resolve(portId)
		})
	})

	return deferred.promise
}

/**
 * 串口发送
 * @param {*} portId 串口id
 * @param {*} content 发送内容，Buffer | String
 */
function writeSerialPort(portId, content) {
	var  deferred = Q.defer()

	log.debug(`writeSerialPort: ${portId}, ${content}`)
	var port = connectedPorts.ports[portId]
	if(!port) {
		setTimeout(_ => {
			deferred.reject()
		}, 10)
		return deferred.promise
	}

	port.write(Buffer.from(content), err => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		port.drain(_ => {
			deferred.resolve()
		})
	})

	return deferred.promise
}

/**
 * 关闭串口
 * @param {*} portId 串口id
 */
function closeSerialPort(portId) {
	var  deferred = Q.defer()

	log.debug(`closeSerialPort, portId: ${portId}`)
	var port = connectedPorts.ports[portId]
	if(!port) {
		setTimeout(_ => {
			deferred.reject()
		}, 10)
		return deferred.promise
	}

	port.close(_ => {
		deferred.resolve()
	})

	return deferred.promise
}

/**
 * 关闭所有串口
 */
function closeAllSerialPort() {
	log.debug(`closeAllSerialPort`)
	for(var key in connectedPorts.ports) {
		connectedPorts.ports[key].close()
	}
	connectedPorts.ports = {}
}

/**
 * 更新串口设置
 * @param {*} portId 串口id
 * @param {*} options 选项
 */
function updateSerialPort(portId, options) {
	var  deferred = Q.defer()

	log.debug(`updateSerialPort, portId: ${portId}`)
	var port = connectedPorts.ports[portId]
	if(!port) {
		setTimeout(_ => {
			deferred.reject()
		}, 10)
		return deferred.promise
	}

	port.update(options, _ => {
		deferred.resolve()
	})

	return deferred.promise
}

/**
 * 清空串口缓冲区
 * @param {*} portId 串口id
 * @param {*} options 选项
 */
function flushSerialPort(portId, options) {
	var  deferred = Q.defer()

	log.debug(`flushSerialPort, portId: ${portId}`)
	var port = connectedPorts.ports[portId]
	if(!port) {
		setTimeout(_ => {
			deferred.reject()
		}, 10)
		return deferred.promise
	}

	port.flush(_ => {
		deferred.resolve()
	})

	return deferred.promise
}

function resetSerialPort(comName) {
	var deferred = Q.defer()

	var serialPort = new SerialPort(comName, {
		baudRate: 1200
	})

	serialPort.on('open', _ => {
		serialPort.set({
			rts: true,
			dtr: false,
		})
		setTimeout(_ => {
			serialPort.close(_ => {
				deferred.resolve()
			})
		}, 650)
	}).on('error', err => {
		log.error(err)
		serialPort.close(_ => {
			deferred.reject(err)
		})
	})

	return deferred.promise
}

module.exports.listSerialPort = listSerialPort
module.exports.openSerialPort = openSerialPort
module.exports.writeSerialPort = writeSerialPort
module.exports.closeSerialPort = closeSerialPort
module.exports.closeAllSerialPort = closeAllSerialPort
module.exports.updateSerialPort = updateSerialPort
module.exports.flushSerialPort = flushSerialPort
module.exports.resetSerialPort = resetSerialPort
