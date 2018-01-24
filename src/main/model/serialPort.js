import log from 'electron-log'
import Q from 'q'
import SerialPort from 'serialport' // eslint-disable-line import/extensions

const Delimiter = SerialPort.parsers.Delimiter

let connectedPorts = {
	autoPortId: 0,
	ports: {}
}

/**
 * 查询串口
 */
function listSerialPort() {
	let deferred = Q.defer()

	log.debug("listSerialPort")
	SerialPort.list((err, ports) => {
		if(err) {
			log.info(err)
			deferred.reject(err)
			return
		}

		if(ports.length === 0) {
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
	let deferred = Q.defer()

	log.debug(`openSerialPort: ${comName}, options: ${JSON.stringify(options)}`)
	options.autoOpen = false


	let port = new SerialPort(comName, options)
	port.open(err => {
		if(err) {
			log.info(err)
			deferred.reject(err)
			return
		}

		let portId = ++connectedPorts.autoPortId
		connectedPorts.ports[portId] = port

		port.on('error', err2 => {
			callbacks && callbacks.onError && callbacks.onError(portId, err2)
		})
		port.on('close', () => {
			delete connectedPorts.ports[portId]
			callbacks && callbacks.onClose && callbacks.onClose(portId)
		})

		let target = options.parser === "raw" ? port : port.pipe(new Delimiter({delimiter: Buffer.from(options.parser)}))
		target.on('readable', () => {
			let data = target.read()
			data && callbacks && callbacks.onData && callbacks.onData(portId, data)
		})

		port.flush(() => {
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
	let deferred = Q.defer()

	log.debug(`writeSerialPort: ${portId}, ${content}`)
	let port = connectedPorts.ports[portId]
	if(!port) {
		setTimeout(() => deferred.reject(), 10)
		return deferred.promise
	}

	port.write(Buffer.from(content), err => {
		if(err) {
			log.info(err)
			deferred.reject(err)
			return
		}

		port.drain(() => {
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
	let deferred = Q.defer()

	log.debug(`closeSerialPort, portId: ${portId}`)
	let port = connectedPorts.ports[portId]
	if(!port) {
		setTimeout(() => deferred.reject(), 10)
		return deferred.promise
	}

	port.close(() => {
		deferred.resolve()
	})

	return deferred.promise
}

/**
 * 关闭所有串口
 */
function closeAllSerialPort() {
  log.debug(`closeAllSerialPort`)
  Object.keys(connectedPorts.ports).forEach(key => {
    connectedPorts.ports[key] && connectedPorts.ports[key].close()
  })
	connectedPorts.ports = {}
}

/**
 * 更新串口设置
 * @param {*} portId 串口id
 * @param {*} options 选项
 */
function updateSerialPort(portId, options) {
	let deferred = Q.defer()

	log.debug(`updateSerialPort, portId: ${portId}`)
	let port = connectedPorts.ports[portId]
	if(!port) {
		setTimeout(() => deferred.reject(), 10)
		return deferred.promise
	}

	port.update(options, () => {
		deferred.resolve()
	})

	return deferred.promise
}

/**
 * 清空串口缓冲区
 * @param {*} portId 串口id
 * @param {*} options 选项
 */
function flushSerialPort(portId) {
	let deferred = Q.defer()

	log.debug(`flushSerialPort, portId: ${portId}`)
	let port = connectedPorts.ports[portId]
	if(!port) {
		setTimeout(() => deferred.reject(), 10)
		return deferred.promise
	}

	port.flush(() => {
		deferred.resolve()
	})

	return deferred.promise
}

function resetSerialPort(comName) {
	let deferred = Q.defer()

	let serialPort = new SerialPort(comName, {
		baudRate: 1200
	})

	serialPort.on('open', () => {
		serialPort.set({
			rts: true,
			dtr: false,
		})
		setTimeout(() => {
			serialPort.close(() => deferred.resolve())
		}, 650)
	}).on('error', err => {
		log.info(err)
		serialPort.close(() => {
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
